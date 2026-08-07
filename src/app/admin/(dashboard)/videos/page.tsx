import Image from "next/image";
import Link from "next/link";
import { getVideos } from "@/lib/videos-store";
import { deleteVideoAction } from "@/lib/video-actions";
import { getCommentCounts, getPendingCommentCounts } from "@/lib/comments-store";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const [videos, commentCounts, pendingCounts] = await Promise.all([
    getVideos(),
    getCommentCounts(),
    getPendingCommentCounts(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tutorials</h1>
          <p className="text-white/50">
            {videos.length} tutorial{videos.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition"
        >
          + Add New
        </Link>
      </div>

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
