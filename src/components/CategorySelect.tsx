"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { addCategoryAction } from "@/lib/category-actions";

export default function CategorySelect({
  name,
  categories: initialCategories,
  defaultValue,
}: {
  name: string;
  categories: string[];
  defaultValue?: string;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [selected, setSelected] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setAdding(false);
        setError("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectCategory(value: string) {
    setSelected(value);
    setOpen(false);
    setAdding(false);
  }

  function handleAddCategory() {
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      selectCategory(trimmed);
      setNewName("");
      return;
    }

    const formData = new FormData();
    formData.set("name", trimmed);

    startTransition(async () => {
      const result = await addCategoryAction({}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) => [...prev, trimmed]);
      selectCategory(trimmed);
      setNewName("");
      setError("");
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={selected} />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left text-white focus:outline-none focus:border-[#ff6a3d]/60 transition"
      >
        <span className={selected ? "text-white" : "text-white/40"}>
          {selected || "Select a category"}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-lg border border-white/10 bg-[#0d1330] shadow-xl shadow-black/50 max-h-64 overflow-y-auto">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => selectCategory(c)}
              className={`w-full text-left px-3 py-2.5 text-sm transition ${
                selected === c
                  ? "bg-[#ff6a3d]/15 text-white"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {c}
            </button>
          ))}

          <div className="border-t border-white/10">
            {adding ? (
              <div className="p-2.5 space-y-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="New category name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={pending}
                    className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition disabled:opacity-60"
                  >
                    {pending ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(false);
                      setNewName("");
                      setError("");
                    }}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-[#ff8a1c] hover:bg-white/5 transition"
              >
                + Add New Category
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
