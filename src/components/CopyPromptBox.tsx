"use client";

import { useState } from "react";

export default function CopyPromptBox({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="rounded-lg border border-white/10 bg-black overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <span className="text-xs font-medium text-white/60 tracking-wide">
            Master Prompt
          </span>
          <div className="flex items-center gap-2">
            <IconButton title="Copy" onClick={handleCopy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </IconButton>
            <IconButton title="Expand" onClick={() => setExpanded(true)}>
              <ExpandIcon />
            </IconButton>
            <IconButton title="Download" onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>
          </div>
        </div>
        <pre className="px-4 py-3 font-mono text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed max-h-[40rem] overflow-y-auto">
          {prompt}
        </pre>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] rounded-lg border border-white/10 bg-black overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-xs font-medium text-white/60 tracking-wide">
                Master Prompt
              </span>
              <div className="flex items-center gap-2">
                <IconButton title="Copy" onClick={handleCopy}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
                <IconButton title="Download" onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
                <IconButton title="Close" onClick={() => setExpanded(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <pre className="px-4 py-3 font-mono text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed overflow-y-auto">
              {prompt}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex items-center justify-center h-7 w-7 rounded-md text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition"
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-400" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
