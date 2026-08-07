"use client";

import { useTransition } from "react";
import {
  approveCommentAction,
  deleteCommentAction,
} from "@/lib/comment-actions";
import type { Comment } from "@/lib/comments-store";

export default function CommentRow({
  comment,
  videoTitle,
}: {
  comment: Comment;
  videoTitle: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1330]/80 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="font-semibold text-white text-sm">
            {comment.name}
          </span>
          <span className="ml-2 text-xs text-white/40">
            on <span className="text-white/60">{videoTitle}</span>
          </span>
        </div>
        <span className="text-xs text-white/40 shrink-0">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-sm text-white/70 whitespace-pre-wrap mb-3">
        {comment.text}
      </p>

      <div className="flex items-center gap-2">
        {!comment.approved && (
          <form
            action={(formData) =>
              startTransition(() => approveCommentAction(formData))
            }
          >
            <input type="hidden" name="id" value={comment.id} />
            <input type="hidden" name="slug" value={comment.videoSlug} />
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition disabled:opacity-60"
            >
              Approve
            </button>
          </form>
        )}
        {comment.approved && (
          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            Approved
          </span>
        )}
        <form
          action={(formData) =>
            startTransition(() => deleteCommentAction(formData))
          }
        >
          <input type="hidden" name="id" value={comment.id} />
          <input type="hidden" name="slug" value={comment.videoSlug} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition disabled:opacity-60"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
