import Image from "next/image";
import Link from "next/link";
import { getVideos } from "@/lib/videos-store";
import { deleteVideoAction } from "@/lib/video-actions";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const videos = await getVideos();

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
