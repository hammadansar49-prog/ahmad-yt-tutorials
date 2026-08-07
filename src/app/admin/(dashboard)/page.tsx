import Link from "next/link";
import { getVideos } from "@/lib/videos-store";
import { getComments } from "@/lib/comments-store";
import { getTotalVisits } from "@/lib/site-stats-store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [videos, comments, totalVisits] = await Promise.all([
    getVideos(),
    getComments(),
    getTotalVisits(),
  ]);

  const pendingComments = comments.filter((c) => !c.approved).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-white/50 mb-8">
        Manage your tutorials, prompts, and site content.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6">
          <p className="text-white/50 text-sm mb-1">Total Tutorials</p>
          <p className="text-3xl font-extrabold">{videos.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6">
          <p className="text-white/50 text-sm mb-1">Total Site Visits</p>
          <p className="text-3xl font-extrabold">{totalVisits}</p>
        </div>
        <Link
          href="/admin/comments"
          className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 hover:border-[#ff6a3d]/40 transition"
        >
          <p className="text-white/50 text-sm mb-1">Pending Comments</p>
          <p className="text-3xl font-extrabold">{pendingComments}</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 hover:border-[#3b82f6]/40 transition"
        >
          <p className="text-white/50 text-sm mb-1">Live Analytics</p>
          <p className="text-3xl font-extrabold text-[#3b82f6]">→</p>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 flex flex-wrap gap-3">
        <Link
          href="/admin/videos/new"
          className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition"
        >
          + Add New Tutorial
        </Link>
        <Link
          href="/admin/videos"
          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5 transition"
        >
          Manage Tutorials
        </Link>
        <Link
          href="/admin/settings"
          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5 transition"
        >
          Edit About &amp; Contact
        </Link>
      </div>
    </div>
  );
}
