"use client";

import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/videos-store";
import LikeButton from "./LikeButton";
import ExpandableDescription from "./ExpandableDescription";
import { useLang } from "./LanguageProvider";

export default function VideoCard({
  video,
  commentCount = 0,
}: {
  video: Video;
  commentCount?: number;
}) {
  const lang = useLang();
  const title = (lang && video.translations?.[lang]?.title) || video.title;
  const description =
    (lang && video.translations?.[lang]?.description) || video.description;

  return (
    <article className="pop-card v-card group/card h-full flex flex-col gap-2.5 sm:gap-3.5">
      <Link
        href={`/tutorial/${video.slug}`}
        className="v-thumb relative block aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-soft2"
      >
        <Image
          src={video.thumbnail}
          alt={title}
          fill
          quality={90}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
          className="object-cover"
        />
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full bg-white/95 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-ink">
          {video.category}
        </span>
        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-xs font-medium text-white">
          <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {video.views ?? 0}
        </span>
        <span className="v-play absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true">
            <path d="M7 4l13 8-13 8z" fill="#0b0b0f" />
          </svg>
        </span>
      </Link>

      <div className="flex flex-col gap-1.5 sm:gap-2.5 flex-1">
        <Link href={`/tutorial/${video.slug}`}>
          <h3 className="v-title text-sm sm:text-lg font-semibold text-ink leading-snug tracking-tight line-clamp-2 transition-colors">
            {title}
          </h3>
        </Link>
        <ExpandableDescription text={description} />

        <div className="flex items-center gap-3 sm:gap-4 text-muted">
          <LikeButton slug={video.slug} initialLikes={video.likes ?? 0} size="sm" />
          <Link
            href={`/tutorial/${video.slug}#comments`}
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.2A7.96 7.96 0 0 1 21 12Z" />
            </svg>
            {commentCount}
          </Link>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-1">
          <Link
            href={`/tutorial/${video.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink text-white font-medium text-xs sm:text-sm py-2 sm:py-2.5 hover:bg-brand"
          >
            View Prompt <span className="arrow-move" aria-hidden="true">→</span>
          </Link>
          {video.youtubeUrl && (
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-line text-ink font-medium text-xs sm:text-sm py-2 sm:py-2.5 hover:border-ink"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
              </svg>
              YouTube
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
