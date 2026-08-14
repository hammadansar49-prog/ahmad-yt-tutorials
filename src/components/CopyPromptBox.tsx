"use client";

import { useState } from "react";

export default function CopyPromptBox({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#0a1030] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-medium text-white/60 tracking-wide">
          Master Prompt
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] hover:brightness-110 active:scale-95 transition"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="px-4 py-3 text-sm text-white/85 whitespace-pre-wrap break-words leading-relaxed max-h-56 overflow-y-auto">
        {prompt}
      </pre>
    </div>
  );
}
