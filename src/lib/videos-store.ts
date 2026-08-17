import { FieldValue } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";

export type Video = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
  category: string;
  tools: string[];
  prompts: string[];
  views?: number;
  likes?: number;
  faqs?: { question: string; answer: string }[];
  sidePictures?: string[];
  // { [languageCode]: { title, description } }
  translations?: Record<string, Record<string, string>>;
};

const videosCollection = () => adminDb.collection("videos");

// Older docs stored a single `prompt: string` field before multi-prompt
// support was added — normalize those into the `prompts` array on read.
function normalizeVideo(data: FirebaseFirestore.DocumentData): Video {
  const legacyPrompt = (data as { prompt?: string }).prompt;
  const prompts = Array.isArray(data.prompts)
    ? data.prompts
    : legacyPrompt
    ? [legacyPrompt]
    : [];
  return { ...(data as Video), prompts };
}

async function fetchVideos(): Promise<Video[]> {
  const snap = await videosCollection().get();
  return snap.docs.map((d) => normalizeVideo(d.data()));
}

export const getVideos = unstable_cache(fetchVideos, ["videos"], {
  tags: ["videos"],
  // View counts bump on nearly every page visit — don't tie that to cache
  // invalidation (it would defeat the cache), just let it self-refresh.
  revalidate: 60,
});

export async function incrementViews(slug: string): Promise<number> {
  const ref = videosCollection().doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return 0;
  await ref.update({ views: FieldValue.increment(1) });
  const updated = await ref.get();
  return (updated.data() as Video).views ?? 0;
}

export async function toggleLike(
  slug: string,
  liked: boolean
): Promise<number> {
  const ref = videosCollection().doc(slug);
  const result = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return 0;
    const current = (snap.data() as Video).likes ?? 0;
    const next = liked ? current + 1 : Math.max(0, current - 1);
    tx.update(ref, { likes: next });
    return next;
  });
  return result;
}

export async function getVideoBySlug(slug: string): Promise<Video | undefined> {
  const snap = await videosCollection().doc(slug).get();
  if (!snap.exists) return undefined;
  return normalizeVideo(snap.data()!);
}

export async function saveVideos(videos: Video[]): Promise<void> {
  const batch = adminDb.batch();
  for (const video of videos) {
    batch.set(videosCollection().doc(video.slug), video);
  }
  await batch.commit();
}

export async function addOrUpdateVideo(video: Video): Promise<void> {
  await videosCollection().doc(video.slug).set(video);
}

export async function deleteVideoBySlug(slug: string): Promise<void> {
  await videosCollection().doc(slug).delete();
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
