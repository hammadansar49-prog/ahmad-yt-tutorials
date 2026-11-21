import type { Video } from "./videos-store";

// Thumbnail/side pictures are stored as base64 data URIs on the document.
// Point at /api/image/ instead so pages stay small and images are cacheable.
// Client-safe (no firebase-admin import), so cards can use it too.
export function thumbnailSrc(video: Pick<Video, "slug" | "thumbnail">): string {
  if (!video.thumbnail?.startsWith("data:")) return video.thumbnail;
  return `/api/image/${video.slug}/thumbnail`;
}

export function sidePictureSrc(
  video: Pick<Video, "slug" | "sidePictures">,
  index: number
): string {
  const src = video.sidePictures?.[index] ?? "";
  if (!src.startsWith("data:")) return src;
  return `/api/image/${video.slug}/side-${index}`;
}

/** Only what list/grid cards need — keeps base64 images and prompts out of the HTML. */
export function toListVideo(video: Video): Video {
  return {
    slug: video.slug,
    title: video.title,
    description: video.description,
    thumbnail: thumbnailSrc(video),
    youtubeUrl: video.youtubeUrl,
    category: video.category,
    tools: video.tools,
    prompts: [],
    views: video.views,
    likes: video.likes,
    onWorking: video.onWorking,
    translations: video.translations,
    createdAt: video.createdAt,
  };
}
