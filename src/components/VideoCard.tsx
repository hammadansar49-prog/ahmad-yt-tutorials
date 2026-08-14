import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/videos-store";
import LikeButton from "./LikeButton";
import ExpandableDescription from "./ExpandableDescription";

export default function VideoCard({
  video,
  commentCount = 0,
}: {
  video: Video;
  commentCount?: number;
}) {
  return (
    <article className="pop-card group/card h-full rounded-xl sm:rounded-2xl border border-white/10 bg-[#0d1330]/80 backdrop-blur shadow-lg shadow-black/30 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#3b82f6]/40 hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)] hover:-translate-y-1">
      <Link
        href={`/tutorial/${video.slug}`}
        className="relative block aspect-video group"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 rounded-full bg-black/60 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white/90 backdrop-blur">
          {video.category}
        </span>
        <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-white/90 backdrop-blur">
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {video.views ?? 0}
        </span>
      </Link>

      <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-3 flex-1">
        <Link href={`/tutorial/${video.slug}`}>
          <h3 className="text-sm sm:text-lg font-bold text-white leading-snug hover:text-[#ff8a1c] transition line-clamp-2 min-h-[2.5em] sm:min-h-[3.5em]">
            {video.title}
          </h3>
        </Link>
        <ExpandableDescription text={video.description} />

        <div className="flex items-center gap-3 sm:gap-4 text-white/60">
          <LikeButton
            slug={video.slug}
            initialLikes={video.likes ?? 0}
            size="sm"
          />
          <Link
            href={`/tutorial/${video.slug}#comments`}
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-white transition"
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
          </Link>
        </div>

        <div className="mt-auto flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-0">
          <Link
            href={`/tutorial/${video.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold text-xs sm:text-sm py-1.5 sm:py-2 hover:brightness-110 transition"
          >
            View Prompt
          </Link>
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-[#06102b] font-semibold text-xs sm:text-sm py-1.5 sm:py-2 hover:brightness-110 transition"
          >
            Watch on YouTube
          </a>
        </div>
      </div>
    </article>
  );
}
