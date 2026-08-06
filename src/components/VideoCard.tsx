import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/videos-store";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <article className="group/card rounded-xl sm:rounded-2xl border border-white/10 bg-[#0d1330]/80 backdrop-blur shadow-lg shadow-black/30 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#3b82f6]/40 hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)] hover:-translate-y-1">
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
      </Link>

      <div className="p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-3 flex-1">
        <Link href={`/tutorial/${video.slug}`}>
          <h3 className="text-sm sm:text-lg font-bold text-white leading-snug hover:text-[#ff8a1c] transition line-clamp-2">
            {video.title}
          </h3>
        </Link>
        <p className="hidden sm:block text-sm text-white/60 line-clamp-2">
          {video.description}
        </p>

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
