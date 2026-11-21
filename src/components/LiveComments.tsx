"use client";

import { where } from "firebase/firestore";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import type { Comment } from "@/lib/comments-store";

export default function LiveComments({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: Comment[];
}) {
  const comments = useFirestoreCollection<Comment>(
    "comments",
    initialComments,
    [where("videoSlug", "==", slug), where("approved", "==", true)]
  ).slice()
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <>
      <h2 className="text-xl font-bold text-ink mb-4">
        Comments ({comments.length})
      </h2>
      <div id="comments-list">
        {comments.length === 0 ? (
          <p className="text-sm text-muted">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-line bg-white p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-ink text-sm">
                    {c.name}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#2a2a33] whitespace-pre-wrap">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
