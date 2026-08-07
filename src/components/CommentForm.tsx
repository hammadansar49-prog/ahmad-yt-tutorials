"use client";

import { useActionState } from "react";
import { submitCommentAction, type CommentFormState } from "@/lib/comment-actions";

const initialState: CommentFormState = {};

export default function CommentForm({ slug }: { slug: string }) {
  const boundAction = submitCommentAction.bind(null, slug);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
        Thanks! Your comment has been submitted and will appear once it&apos;s
        approved.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3b82f6]/60 transition"
      />
      <textarea
        name="text"
        required
        rows={3}
        placeholder="Write a comment..."
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#3b82f6]/60 transition resize-none"
      />
      {state.error && <p className="text-xs text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold text-sm px-5 py-2.5 hover:brightness-110 transition disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
