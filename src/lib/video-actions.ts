"use server";

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  getVideos,
  saveVideos,
  uniqueSlug,
  type Video,
} from "@/lib/videos-store";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

// Thumbnails are only ever displayed at small/medium sizes on the site, so
// no matter how large the uploaded file is (a raw 4K photo, a phone camera
// shot, etc.), we downscale and re-encode it as compressed WebP here. This
// keeps page load fast regardless of what admins upload.
const MAX_THUMBNAIL_WIDTH = 1280;
const THUMBNAIL_QUALITY = 75;

async function saveThumbnail(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  await fs.mkdir(uploadsDir, { recursive: true });

  const safeName = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const optimizedBuffer = await sharp(inputBuffer)
    .rotate() // respect EXIF orientation before resizing
    .resize({ width: MAX_THUMBNAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toBuffer();

  await fs.writeFile(path.join(uploadsDir, safeName), optimizedBuffer);

  return `/uploads/${safeName}`;
}

function parseTools(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
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
  const prompt = String(formData.get("prompt") ?? "").trim();
  const thumbnailFile = formData.get("thumbnail") as File | null;

  if (!title || !description || !category || !youtubeUrl || !prompt) {
    return { error: "Please fill in all required fields." };
  }

  const thumbnail = thumbnailFile ? await saveThumbnail(thumbnailFile) : null;
  if (!thumbnail) {
    return { error: "Please upload a thumbnail image." };
  }

  const slug = await uniqueSlug(title);
  const videos = await getVideos();

  const newVideo: Video = {
    slug,
    title,
    description,
    thumbnail,
    youtubeUrl,
    category,
    tools,
    prompt,
  };

  await saveVideos([newVideo, ...videos]);

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
  const prompt = String(formData.get("prompt") ?? "").trim();
  const thumbnailFile = formData.get("thumbnail") as File | null;

  if (!title || !description || !category || !youtubeUrl || !prompt) {
    return { error: "Please fill in all required fields." };
  }

  const videos = await getVideos();
  const existing = videos.find((v) => v.slug === originalSlug);
  if (!existing) return { error: "Tutorial not found." };

  const uploadedThumbnail = thumbnailFile
    ? await saveThumbnail(thumbnailFile)
    : null;

  const newSlug =
    title.trim() === existing.title.trim()
      ? existing.slug
      : await uniqueSlug(title, existing.slug);

  const updated: Video = {
    slug: newSlug,
    title,
    description,
    thumbnail: uploadedThumbnail ?? existing.thumbnail,
    youtubeUrl,
    category,
    tools,
    prompt,
  };

  const nextVideos = videos.map((v) => (v.slug === originalSlug ? updated : v));
  await saveVideos(nextVideos);

  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath(`/tutorial/${newSlug}`);
  redirect("/admin/videos");
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;

  const slug = String(formData.get("slug") ?? "");
  const videos = await getVideos();
  await saveVideos(videos.filter((v) => v.slug !== slug));

  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath(`/tutorial/${slug}`);
}
