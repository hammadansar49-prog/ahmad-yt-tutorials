"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import { deleteVideoAction, bulkDeleteVideosAction } from "@/lib/video-actions";
import type { Video } from "@/lib/videos-store";
import DeleteButton from "./DeleteButton";

export default function VideosList({
  videos,
  commentCounts,
  pendingCounts,
}: {
  videos: Video[];
  commentCounts: Record<string, number>;
  pendingCounts: Record<string, number>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const allSelected = videos.length > 0 && selected.size === videos.length;

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(videos.map((v) => v.slug)));
  }

  function confirmBulkDelete() {
    startTransition(async () => {
      await bulkDeleteVideosAction(Array.from(selected));
      setSelected(new Set());
      setConfirmOpen(false);
    });
  }

  return (
    <div>
      {videos.length > 0 && (
        <div className="flex items-center justify-between mb-4 rounded-xl border border-white/10 bg-[#0d1330]/60 px-4 py-3">
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-[#ff6a3d]"
            />
            {selected.size > 0
              ? `${selected.size} selected`
              : "Select all"}
          </label>

          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
            >
              Delete Selected ({selected.size})
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={`Delete ${selected.size} tutorial${selected.size !== 1 ? "s" : ""}?`}
        description="These tutorials will be permanently removed. This cannot be undone."
        confirmLabel="Delete"
        danger
        pending={pending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmBulkDelete}
      />

      {videos.length === 0 ? (
        <p className="text-white/50">
          No tutorials yet. Click &quot;Add New&quot; to create one.
        </p>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video.slug}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1330]/80 p-4"
            >
              <input
                type="checkbox"
                checked={selected.has(video.slug)}
                onChange={() => toggle(video.slug)}
                className="w-4 h-4 rounded accent-[#ff6a3d] shrink-0 sm:mt-0"
                aria-label={`Select ${video.title}`}
              />

              <div className="relative w-full sm:w-32 aspect-video rounded-lg overflow-hidden shrink-0">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                  {video.category}
                </p>
                <h3 className="font-semibold text-white truncate">
                  {video.title}
                </h3>
                <p className="text-sm text-white/50 truncate">
                  {video.description}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {video.views ?? 0} views
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-6.7-4.35-9.3-8.2C1 10 1.8 6.6 4.6 5.2c2.3-1.2 4.9-.3 6.4 1.7 1.5-2 4.1-2.9 6.4-1.7 2.8 1.4 3.6 4.8 1.9 7.6C18.7 16.65 12 21 12 21Z" />
                    </svg>
                    {video.likes ?? 0} likes
                  </span>
                  <Link
                    href="/admin/comments"
                    className="inline-flex items-center gap-1 hover:text-white transition"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.2A7.96 7.96 0 0 1 21 12Z" />
                    </svg>
                    {commentCounts[video.slug] ?? 0} comments
                    {(pendingCounts[video.slug] ?? 0) > 0 && (
                      <span className="ml-1 rounded-full bg-[#ff2d55]/20 text-[#ff6a8a] px-1.5 py-0.5 text-[10px] font-semibold">
                        +{pendingCounts[video.slug]} waiting for approval
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/tutorial/${video.slug}`}
                  target="_blank"
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
                >
                  View
                </Link>
                <Link
                  href={`/admin/videos/${video.slug}/edit`}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
                >
                  Edit
                </Link>
                <form action={deleteVideoAction}>
                  <input type="hidden" name="slug" value={video.slug} />
                  <DeleteButton title={video.title} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
