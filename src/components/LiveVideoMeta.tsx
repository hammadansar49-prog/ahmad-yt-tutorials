"use client";

import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import LikeButton from "./LikeButton";
import type { Video } from "@/lib/videos-store";

export default function LiveVideoMeta({
  slug,
  initialVideo,
  commentCount,
}: {
  slug: string;
  initialVideo: Video;
  commentCount: number;
}) {
  const video = useFirestoreDoc<Video>("videos", slug, initialVideo);
  const views = video?.views ?? initialVideo.views ?? 0;
  const likes = video?.likes ?? initialVideo.likes ?? 0;

  return (
    <div className="mt-4 flex items-center gap-5 text-white/60">
      <span className="inline-flex items-center gap-1.5 text-sm">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {views} views
      </span>
      <LikeButton slug={slug} initialLikes={likes} />
      <a
        href="#comments"
        className="inline-flex items-center gap-1.5 text-sm hover:text-white transition"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.2A7.96 7.96 0 0 1 21 12Z" />
        </svg>
        {commentCount}
      </a>
    </div>
  );
}
