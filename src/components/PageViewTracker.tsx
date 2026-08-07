"use client";

import { useEffect } from "react";

export default function PageViewTracker({
  slug,
  trackKey,
}: {
  slug?: string;
  trackKey: string;
}) {
  useEffect(() => {
    const storageKey = `ayt_viewed_${trackKey}`;

    if (localStorage.getItem(storageKey) === "1") return;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug ?? null }),
    })
      .then(() => {
        localStorage.setItem(storageKey, "1");
      })
      .catch(() => {});
  }, [slug, trackKey]);

  return null;
}
