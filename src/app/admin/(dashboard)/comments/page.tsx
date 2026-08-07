import { getComments } from "@/lib/comments-store";
import { getVideos } from "@/lib/videos-store";
import CommentRow from "./CommentRow";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const [comments, videos] = await Promise.all([getComments(), getVideos()]);
  const titleBySlug = new Map(videos.map((v) => [v.slug, v.title]));

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Comments</h1>
      <p className="text-white/50 mb-8">
        Review and approve comments before they appear on the site.
      </p>

      <h2 className="text-lg font-bold text-white mb-3">
        Pending Approval ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="text-sm text-white/50 mb-8">Nothing to review.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              videoTitle={titleBySlug.get(c.videoSlug) ?? c.videoSlug}
            />
          ))}
        </div>
      )}

      <h2 className="text-lg font-bold text-white mb-3">
        Approved ({approved.length})
      </h2>
      {approved.length === 0 ? (
        <p className="text-sm text-white/50">No approved comments yet.</p>
      ) : (
        <div className="space-y-3">
          {approved.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              videoTitle={titleBySlug.get(c.videoSlug) ?? c.videoSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
