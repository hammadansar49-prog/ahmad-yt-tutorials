"use client";

import { useState } from "react";
import AutoGrowTextarea from "@/components/AutoGrowTextarea";

export default function PromptListInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [prompts, setPrompts] = useState<string[]>(
    defaultValue && defaultValue.length > 0 ? defaultValue : [""]
  );

  function updatePrompt(index: number, value: string) {
    setPrompts((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  function addPrompt() {
    setPrompts((prev) => [...prev, ""]);
  }

  function removePrompt(index: number) {
    setPrompts((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  return (
    <div className="space-y-4">
      {prompts.map((prompt, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">
              Prompt {i + 1}
            </span>
            {prompts.length > 1 && (
              <button
                type="button"
                onClick={() => removePrompt(i)}
                className="text-white/50 hover:text-white transition text-xs"
                aria-label={`Remove prompt ${i + 1}`}
              >
                Remove
              </button>
            )}
          </div>
          <AutoGrowTextarea
            required
            rows={6}
            value={prompt}
            onChange={(e) => updatePrompt(i, e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition font-mono text-sm"
            placeholder="Paste the full AI prompt used for this video"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addPrompt}
        className="rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-sm font-medium px-4 py-1.5"
      >
        + Add Prompt
      </button>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(prompts.map((p) => p.trim()).filter(Boolean))}
      />
    </div>
  );
}
