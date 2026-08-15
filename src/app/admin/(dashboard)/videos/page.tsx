import Link from "next/link";
import { getVideos } from "@/lib/videos-store";
import { getCommentCounts, getPendingCommentCounts } from "@/lib/comments-store";
import VideosList from "./VideosList";

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

      <VideosList
        videos={videos}
        commentCounts={commentCounts}
        pendingCounts={pendingCounts}
      />
    </div>
  );
}
