"use server";

import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  getVideos,
  addOrUpdateVideo,
  deleteVideoBySlug,
  uniqueSlug,
  type Video,
} from "@/lib/videos-store";

// Thumbnails are only ever displayed at small/medium sizes on the site, so
// no matter how large the uploaded file is (a raw 4K photo, a phone camera
// shot, etc.), we downscale and re-encode it as compressed WebP here. This
// keeps page load fast regardless of what admins upload.
const MAX_THUMBNAIL_WIDTH = 1280;
const THUMBNAIL_QUALITY = 75;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function saveThumbnail(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const optimizedBuffer = await sharp(inputBuffer)
    .rotate() // respect EXIF orientation before resizing
    .resize({ width: MAX_THUMBNAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toBuffer();

  const publicId = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads", public_id: publicId, format: "webp" },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error);
        resolve(uploadResult);
      }
    );
    stream.end(optimizedBuffer);
  });

  return result.secure_url;
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

  await addOrUpdateVideo(newVideo);

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

  await addOrUpdateVideo(updated);
  if (newSlug !== originalSlug) {
    await deleteVideoBySlug(originalSlug);
  }

  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath(`/tutorial/${newSlug}`);
  redirect("/admin/videos");
}

export async function deleteVideoAction(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;

  const slug = String(formData.get("slug") ?? "");
  await deleteVideoBySlug(slug);

  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath(`/tutorial/${slug}`);
}
