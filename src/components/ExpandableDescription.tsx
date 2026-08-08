"use client";

import { useState } from "react";

const TRUNCATE_THRESHOLD = 80;

export default function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > TRUNCATE_THRESHOLD;

  return (
    <div className="hidden sm:block text-sm text-white/60 min-h-[2.6em]">
      <p
        className={expanded ? "break-words" : "overflow-hidden break-words"}
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                textOverflow: "ellipsis",
              }
        }
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setExpanded((v) => !v);
          }}
          className="mt-0.5 text-xs font-semibold text-[#ff8a1c] hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
