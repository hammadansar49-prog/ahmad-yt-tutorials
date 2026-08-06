import fs from "fs/promises";
import path from "path";

export type Video = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
  category: string;
  tools: string[];
  prompt: string;
};

const filePath = path.join(process.cwd(), "src/data/videos.json");

export async function getVideos(): Promise<Video[]> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Video[];
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
  const videos = await getVideos();
  return videos.find((v) => v.slug === slug);
}

export async function saveVideos(videos: Video[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(videos, null, 2), "utf-8");
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueSlug(title: string, excludeSlug?: string): Promise<string> {
  const base = slugify(title) || "tutorial";
  const videos = await getVideos();
  let candidate = base;
  let i = 2;
  while (videos.some((v) => v.slug === candidate && v.slug !== excludeSlug)) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}
