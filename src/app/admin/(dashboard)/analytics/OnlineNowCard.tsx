"use client";

import { useEffect, useState } from "react";

export default function OnlineNowCard() {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    function poll() {
      fetch("/api/presence")
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setOnline(data.online ?? 0);
        })
        .catch(() => {});
    }

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <p className="text-white/50 text-sm">Online Right Now</p>
      </div>
      <p className="text-3xl font-extrabold">{online ?? "—"}</p>
    </div>
  );
}
