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
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700">
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
        className="w-full rounded-lg border border-line bg-soft px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-brand transition"
      />
      <textarea
        name="text"
        required
        rows={3}
        placeholder="Write a comment..."
        className="w-full rounded-lg border border-line bg-soft px-3 py-2.5 text-sm text-ink placeholder-muted focus:outline-none focus:border-brand transition resize-none"
      />
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand text-white font-semibold text-sm px-5 py-2.5 hover:opacity-90 transition disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
