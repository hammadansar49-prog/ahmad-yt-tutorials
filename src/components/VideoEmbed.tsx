"use client";

import { useState } from "react";
import Image from "next/image";
import { getYouTubeId } from "@/lib/youtube";

/**
 * Click-to-play YouTube embed: shows the thumbnail with a play button
 * (cheap to render, no YouTube iframe/JS loaded up front) and only swaps
 * in the real embedded player once the user clicks — so the video plays
 * right here on the site instead of forcing a tab-out to YouTube.
 */
export default function VideoEmbed({
  youtubeUrl,
  thumbnail,
  title,
  category,
}: {
  youtubeUrl: string;
  thumbnail: string;
  title: string;
  category?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(youtubeUrl);

  if (playing && videoId) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      disabled={!videoId}
      aria-label={`Play ${title}`}
      className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 block text-left"
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        priority
        quality={92}
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
      {category && (
        <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
          {category}
        </span>
      )}
      {videoId && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition">
          <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] shadow-xl shadow-black/40 group-hover:scale-110 transition-transform">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 sm:w-8 sm:h-8 text-white translate-x-0.5"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}
    </button>
  );
}
