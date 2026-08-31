"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Shows a big confirmation right after a create/edit redirect (driven by
// ?saved=1 / ?edited=1 on the URL), then cleans the query param off the URL
// so refreshing the page doesn't keep showing it.
export default function SavedBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved") === "1";
  const edited = searchParams.get("edited") === "1";
  const [visible, setVisible] = useState(saved || edited);

  useEffect(() => {
    if (!saved && !edited) return;
    router.replace("/admin/videos", { scroll: false });
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for this redirect, not on every router identity change
  }, [saved, edited]);

  if (!visible || (!saved && !edited)) return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500/20 text-green-400 shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <p className="text-lg sm:text-xl font-bold text-green-400">
        {edited ? "Editing Saved" : "Saved"}
      </p>
    </div>
  );
}
