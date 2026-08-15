"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
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

  return (
    <section className="relative w-full overflow-hidden border-b border-white/10">
      <div className="relative w-full flex items-center justify-center py-4 sm:py-6">
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
          style={{ aspectRatio: "16 / 9" }}
          className="w-[92%] sm:w-[90%] h-auto max-h-[75vh] object-contain object-center pointer-events-none"
        />
      </div>
    </section>
  );
}
