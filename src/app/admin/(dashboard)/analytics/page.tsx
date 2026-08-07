import { getTotalVisits } from "@/lib/site-stats-store";
import { getVideos } from "@/lib/videos-store";
import OnlineNowCard from "./OnlineNowCard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [totalVisits, videos] = await Promise.all([
    getTotalVisits(),
    getVideos(),
  ]);

  const totalViews = videos.reduce((sum, v) => sum + (v.views ?? 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes ?? 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Analytics</h1>
      <p className="text-white/50 mb-8">
        Live visitor count and overall site stats.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <OnlineNowCard />
        <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6">
          <p className="text-white/50 text-sm mb-1">Total Site Visits</p>
          <p className="text-3xl font-extrabold">{totalVisits}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6">
          <p className="text-white/50 text-sm mb-1">Total Tutorial Views</p>
          <p className="text-3xl font-extrabold">{totalViews}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6">
          <p className="text-white/50 text-sm mb-1">Total Likes</p>
          <p className="text-3xl font-extrabold">{totalLikes}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/50 leading-relaxed">
        <strong className="text-white/70">Note:</strong> &quot;Online Right
        Now&quot; is tracked in the server&apos;s memory and updates every
        few seconds. It works reliably when the site runs on a normal
        persistent server (e.g. Hostinger, or your own computer). On
        serverless platforms like Vercel, this number may be inaccurate since
        each request can be handled by a different server instance.
      </div>
    </div>
  );
}
