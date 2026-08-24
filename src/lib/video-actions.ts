"use server";

import sharp from "sharp";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { sendPushToAll } from "@/lib/push-actions";
import { translateFields } from "@/lib/translate";
import {
  getVideos,
  addOrUpdateVideo,
  deleteVideoBySlug,
  uniqueSlug,
  type Video,
} from "@/lib/videos-store";

// Images are stored directly as base64 data URIs on the Firestore document
// (same approach as the theottdeals site) instead of going through an
// external image host. That removes the outbound network call entirely —
// no third-party service to hang or fail — but a Firestore document maxes
// out at 1MB total, and this document can hold a thumbnail plus up to 5
// side pictures. Keep each image small enough that the whole set comfortably
// fits: bigger/higher quality for the thumbnail (the one shown large on
// video cards), smaller for side pictures (shown as thumbnails alongside
// the FAQs).
const THUMBNAIL_MAX_WIDTH = 1280;
const THUMBNAIL_QUALITY = 80;
const SIDE_PICTURE_MAX_WIDTH = 640;
const SIDE_PICTURE_QUALITY = 72;

// Shared hosting (Hostinger) gives this process very limited RAM/CPU. sharp
// defaults to using multiple threads per operation and caching decoded
// output, both of which can spike memory enough to get the whole Node
// process OOM-killed on a single large photo upload. Capping concurrency
// and disabling the cache keeps resource use predictable at the cost of
// slightly slower resizing.
sharp.concurrency(1);
sharp.cache(false);

// A raw phone photo can be 10-20MB+; decoding one of those on a host with
// very little RAM is itself enough to crash the process before we ever get
// a chance to downscale it. Reject oversized uploads early with a normal
// form error instead of letting the process die.
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

async function processImage(
  file: File,
  { maxWidth, quality }: { maxWidth: number; quality: number }
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(
        1
      )}MB). Please use an image under 15MB.`
    );
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const optimizedBuffer = await sharp(inputBuffer)
    .rotate() // respect EXIF orientation before resizing
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  return `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
}

async function saveThumbnail(file: File): Promise<string | null> {
  return processImage(file, {
    maxWidth: THUMBNAIL_MAX_WIDTH,
    quality: THUMBNAIL_QUALITY,
  });
}

const MAX_SIDE_PICTURES = 5;

async function saveSidePictures(files: File[]): Promise<string[]> {
  const usable = files.filter((f) => f && f.size > 0).slice(0, MAX_SIDE_PICTURES);
  // Sequential on purpose: processing several images through sharp at once
  // spikes memory hard, which is enough to crash the Node process outright
  // on a low-RAM production host (Hostinger). One at a time keeps peak
  // memory bounded regardless of how many side pictures are uploaded.
  const uploaded: (string | null)[] = [];
  for (const f of usable) {
    uploaded.push(
      await processImage(f, {
        maxWidth: SIDE_PICTURE_MAX_WIDTH,
        quality: SIDE_PICTURE_QUALITY,
      })
    );
  }
  return uploaded.filter((url): url is string => Boolean(url));
}

// Firestore rejects writes over 1MB per document outright. Rather than let
// that surface as an opaque Firestore error (or worse, a hung request),
// check it ourselves first and give the admin a clear, actionable message.
const MAX_DOC_BYTES = 950_000;

function assertFitsInDoc(video: Video): void {
  const size = Buffer.byteLength(JSON.stringify(video));
  if (size > MAX_DOC_BYTES) {
    throw new Error(
      `These images are too large to save together (${(size / 1024).toFixed(
        0
      )}KB, limit ~${(MAX_DOC_BYTES / 1024).toFixed(0)}KB). Try uploading fewer side pictures or smaller images.`
    );
  }
}

function parseTools(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parsePrompts(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p): p is string => typeof p === "string")
      .map((p) => p.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseFaqs(raw: string): { question: string; answer: string }[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (f) =>
        f &&
        typeof f.question === "string" &&
        typeof f.answer === "string" &&
        f.question.trim() &&
        f.answer.trim()
    );
  } catch {
    return [];
  }
}

export type VideoFormState = { error?: string };

export async function createVideoAction(
  _prevState: VideoFormState,
  formData: FormData
): Promise<VideoFormState> {
  if (!(await isAuthed())) return { error: "Not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();
  const tools = parseTools(String(formData.get("tools") ?? ""));
  const faqs = parseFaqs(String(formData.get("faqs") ?? "[]"));
  const prompts = parsePrompts(String(formData.get("prompts") ?? "[]"));
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const sidePictureFiles = formData.getAll("sidePictures") as File[];

  if (!title || !description || !category || !youtubeUrl || prompts.length === 0) {
    return { error: "Please fill in all required fields." };
  }

  let thumbnail: string | null;
  let sidePictures: string[];
  try {
    thumbnail = thumbnailFile ? await saveThumbnail(thumbnailFile) : null;
    sidePictures = await saveSidePictures(sidePictureFiles);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to process the uploaded image(s).",
    };
  }
  if (!thumbnail) {
    return { error: "Please upload a thumbnail image." };
  }

  const slug = await uniqueSlug(title);

  const translations = await translateFields({ title, description }).catch(
    () => undefined
  );

  const newVideo: Video = {
    slug,
    title,
    description,
    thumbnail,
    youtubeUrl,
    category,
    tools,
    prompts,
    faqs,
    sidePictures,
    translations,
  };

  try {
    assertFitsInDoc(newVideo);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Images too large to save." };
  }

  await addOrUpdateVideo(newVideo);

  try {
    await sendPushToAll({
      title: "New Tutorial: " + title,
      body: description,
      url: `/tutorial/${slug}`,
    });
  } catch {
    // Never block publishing a video on notification delivery failing.
  }

  updateTag("videos");
  revalidatePath("/");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function updateVideoAction(
  originalSlug: string,
  _prevState: VideoFormState,
  formData: FormData
): Promise<VideoFormState> {
  if (!(await isAuthed())) return { error: "Not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();
  const tools = parseTools(String(formData.get("tools") ?? ""));
  const faqs = parseFaqs(String(formData.get("faqs") ?? "[]"));
  const prompts = parsePrompts(String(formData.get("prompts") ?? "[]"));
  const thumbnailFile = formData.get("thumbnail") as File | null;
  const sidePictureFiles = formData.getAll("sidePictures") as File[];

  if (!title || !description || !category || !youtubeUrl || prompts.length === 0) {
    return { error: "Please fill in all required fields." };
  }

  const videos = await getVideos();
  const existing = videos.find((v) => v.slug === originalSlug);
  if (!existing) return { error: "Tutorial not found." };

  let uploadedThumbnail: string | null;
  let uploadedSidePictures: string[];
  try {
    uploadedThumbnail = thumbnailFile ? await saveThumbnail(thumbnailFile) : null;
    uploadedSidePictures = await saveSidePictures(sidePictureFiles);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to process the uploaded image(s).",
    };
  }
  const sidePictures =
    uploadedSidePictures.length > 0
      ? uploadedSidePictures
      : existing.sidePictures ?? [];

  const newSlug =
    title.trim() === existing.title.trim()
      ? existing.slug
      : await uniqueSlug(title, existing.slug);

  const textChanged = title !== existing.title || description !== existing.description;
  const translations = textChanged
    ? await translateFields({ title, description }).catch(() => existing.translations)
    : existing.translations;

  const updated: Video = {
    slug: newSlug,
    title,
    description,
    thumbnail: uploadedThumbnail ?? existing.thumbnail,
    youtubeUrl,
    category,
    tools,
    prompts,
    faqs,
    sidePictures,
    translations,
  };

  try {
    assertFitsInDoc(updated);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Images too large to save." };
  }

  await addOrUpdateVideo(updated);
  if (newSlug !== originalSlug) {
    await deleteVideoBySlug(originalSlug);
  }

  updateTag("videos");
  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath(`/tutorial/${newSlug}`);
  redirect("/admin/videos");
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;

  const slug = String(formData.get("slug") ?? "");
  await deleteVideoBySlug(slug);

  updateTag("videos");
  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath(`/tutorial/${slug}`);
}

export async function bulkDeleteVideosAction(
  slugs: string[]
): Promise<{ error?: string }> {
  if (!(await isAuthed())) return { error: "Not authorized." };
  if (slugs.length === 0) return {};

  await Promise.all(slugs.map((slug) => deleteVideoBySlug(slug)));

  updateTag("videos");
  revalidatePath("/");
  revalidatePath("/admin/videos");
  for (const slug of slugs) {
    revalidatePath(`/tutorial/${slug}`);
  }
  return {};
}
