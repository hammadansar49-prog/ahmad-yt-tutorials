"use client";

import { useRouter } from "next/navigation";

export default function BackToTutorials() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition mb-6"
    >
      ← Back to all tutorials
    </button>
  );
}
