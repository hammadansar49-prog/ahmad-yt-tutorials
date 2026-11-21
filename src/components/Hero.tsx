"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export default function Hero({
  stats,
}: {
  stats?: { tutorials: number; views: number; likes: number };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay was blocked (data-saver / battery-saver mode on some
        // mobile browsers ignore the autoplay attribute) — retry on the
        // very first user interaction anywhere on the page.
        const resume = () => {
          video.play().catch(() => {});
        };
        window.addEventListener("touchstart", resume, { once: true });
        window.addEventListener("click", resume, { once: true });
        window.addEventListener("scroll", resume, { once: true, passive: true });
      });
    };

    tryPlay();

    // Some mobile browsers pause background/inactive-tab video; resume
    // whenever the tab/page becomes visible again.
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const statItems = stats
    ? [
        { value: fmt(stats.tutorials), label: "Tutorials published" },
        { value: fmt(stats.views), label: "Total views" },
        { value: fmt(stats.likes), label: "Total likes" },
        { value: "Free", label: "Every prompt, free to copy" },
      ]
    : [];

  return (
    <>
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 flex flex-wrap items-center gap-12 lg:gap-16">
        <div className="flex-[999_1_520px] min-w-0">
          <p className="fade-up mb-7 text-sm text-muted flex items-center gap-2.5">
            <span className="pulse-dot w-2 h-2 rounded-full bg-brand" />
            YouTube educator · AI &amp; creator tools
          </p>
          <h1
            data-no-scrub
            className="fade-up delay-1 font-serif font-normal text-[52px] sm:text-7xl lg:text-[84px] leading-[0.98] tracking-tight"
          >
            Practical tutorials for{" "}
            <em className="text-brand">modern creators.</em>
          </h1>
          <p className="fade-up delay-2 mt-10 max-w-xl text-lg leading-relaxed text-muted">
            Clear, step-by-step videos on AI tools, YouTube growth and
            editing. Every tutorial includes the exact prompts and resources
            used.
          </p>
          <div className="fade-up delay-2 mt-8 flex flex-wrap gap-3">
            <a
              href="#tutorials"
              className="rounded-lg bg-ink px-6 py-3.5 text-[15px] font-medium text-white hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse tutorials
            </a>
            <Link
              href="/about"
              className="rounded-lg border border-line px-6 py-3.5 text-[15px] font-medium text-ink hover:border-ink"
            >
              About me
            </Link>
          </div>
        </div>

        <div className="fade-up delay-3 relative flex-[1_1_340px] max-w-[440px] mx-auto pt-6 pb-16">
          <div className="float-y overflow-hidden rounded-2xl bg-ink shadow-[0_40px_80px_-30px_rgba(11,11,15,0.45)]">
            <video
              ref={videoRef}
              src="/banner.mp4?v=2"
              poster="/banner.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              width={1920}
              height={1080}
              style={{ aspectRatio: "16 / 10" }}
              className="w-full h-auto object-cover pointer-events-none"
            />
            <div className="flex items-center gap-3 px-4 py-3 text-xs text-white/70">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M7 4l13 8-13 8z" fill="currentColor" />
              </svg>
              <span className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
                <span className="bar-grow block h-full bg-white" />
              </span>
              <span>Latest video</span>
            </div>
          </div>
          <div className="float-y-2 absolute -left-4 sm:-left-8 bottom-0 w-[78%] rounded-xl border border-line bg-white p-4 shadow-[0_24px_48px_-20px_rgba(11,11,15,0.3)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">Prompt</span>
              <span className="text-[11px] font-medium rounded-md bg-ink text-white px-2.5 py-1">
                Copy
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-muted">
              Cinematic wide shot, golden hour light, slow tracking camera…
            </p>
          </div>
          <div className="float-y-2 absolute -right-2 top-0 flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold shadow-[0_12px_28px_-14px_rgba(11,11,15,0.3)]">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-brand" />
            Free to copy
          </div>
        </div>
      </div>
    </section>

    {statItems.length > 0 && (
      <section className="border-y border-line">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
          {statItems.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 sm:px-6 py-7 sm:py-9 hover:bg-soft transition-colors ${
                i % 2 === 1 ? "border-l border-line" : ""
              } ${i === 2 ? "lg:border-l lg:border-line border-t lg:border-t-0" : ""} ${
                i === 3 ? "border-t lg:border-t-0" : ""
              }`}
            >
              <p className="font-serif text-4xl sm:text-5xl leading-none">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    )}
    </>
  );
}
