"use client";

import { useState } from "react";

export default function CountryBreakdown({
  countries,
}: {
  countries: { country: string; count: number }[];
}) {
  const [open, setOpen] = useState(false);
  const top = countries[0];
  const total = countries.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={countries.length === 0}
        className="w-full text-left p-6 disabled:cursor-default"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm mb-1">Top Country</p>
            <p className="text-3xl font-extrabold">
              {top ? top.country : "—"}
            </p>
            {top && (
              <p className="text-xs text-white/40 mt-1">
                {top.count} view{top.count !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {countries.length > 0 && (
            <svg
              viewBox="0 0 24 24"
              className={`w-5 h-5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>

      {open && countries.length > 0 && (
        <div className="border-t border-white/10 max-h-72 overflow-y-auto">
          {countries.map((c) => {
            const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
            return (
              <div
                key={c.country}
                className="flex items-center justify-between px-6 py-2.5 text-sm border-b border-white/5 last:border-0"
              >
                <span className="text-white/80">{c.country}</span>
                <span className="text-white/50">
                  {c.count} <span className="text-white/30">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
