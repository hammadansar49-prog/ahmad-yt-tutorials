import Link from "next/link";
import { getVideos, thumbnailSrc } from "@/lib/videos-store";
import { getCommentCounts, getPendingCommentCounts } from "@/lib/comments-store";
import VideosList from "./VideosList";

export default async function AdminVideosPage() {
  const [allVideos, commentCounts, pendingCounts] = await Promise.all([
    getVideos(),
    getCommentCounts(),
    getPendingCommentCounts(),
  ]);

  // Swap the full base64 thumbnail for a short image URL before this ever
  // reaches the client component below — otherwise every video's full
  // image data gets embedded into this page's payload, which is heavy
  // enough (with several videos at once) to blow past the hosting
  // platform's response time.
  const videos = allVideos.map((v) => ({ ...v, thumbnail: thumbnailSrc(v) }));

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
