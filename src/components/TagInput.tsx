"use client";

import { useState } from "react";

export default function TagInput({
  name,
  defaultValue = [],
  placeholder,
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
}) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const value = draft.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(index: number) {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2 flex flex-wrap items-center gap-1.5 focus-within:border-[#ff6a3d]/60 transition"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus();
        }
      }}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-[#ff6a3d]/15 border border-[#ff6a3d]/30 px-2.5 py-1 text-xs text-white"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="text-white/50 hover:text-white transition leading-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent px-1 py-1 text-sm text-white placeholder-white/30 focus:outline-none"
      />
      <input type="hidden" name={name} value={tags.join(", ")} />
    </div>
  );
}
