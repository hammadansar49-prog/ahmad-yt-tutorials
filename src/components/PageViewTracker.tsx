"use client";

import { useEffect } from "react";

export default function PageViewTracker({ slug }: { slug?: string }) {
  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug ?? null }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
