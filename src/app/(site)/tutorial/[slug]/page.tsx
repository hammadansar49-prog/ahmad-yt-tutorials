import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVideoBySlug } from "@/lib/videos-store";
import { getApprovedCommentsForVideo } from "@/lib/comments-store";
import CopyPromptBox from "@/components/CopyPromptBox";
import BackToTutorials from "@/components/BackToTutorials";
import LikeButton from "@/components/LikeButton";
import CommentForm from "@/components/CommentForm";
import PageViewTracker from "@/components/PageViewTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/tutorial/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return {};
  return {
    title: `${video.title} - Ahmad YT Tutorial`,
    description: video.description,
  };
}

export default async function TutorialPage({
  params,
}: PageProps<"/tutorial/[slug]">) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) notFound();

  const comments = await getApprovedCommentsForVideo(slug);

  return (
    <main className="flex-1">
      <PageViewTracker slug={slug} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <BackToTutorials />

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            priority
            className="object-cover"
          />
          <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
            {video.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-6">
          {video.title}
        </h1>
        <p className="mt-2 text-white/60">{video.description}</p>

        <div className="mt-4 flex items-center gap-5 text-white/60">
          <span className="inline-flex items-center gap-1.5 text-sm">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {video.views ?? 0} views
          </span>
          <LikeButton slug={video.slug} initialLikes={video.likes ?? 0} />
          <a
            href="#comments"
            className="inline-flex items-center gap-1.5 text-sm hover:text-white transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.2A7.96 7.96 0 0 1 21 12Z" />
            </svg>
            {comments.length} comments
          </a>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3">
            Tools Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {video.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <CopyPromptBox prompt={video.prompt} />
        </div>

        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] text-[#06102b] font-semibold text-sm px-8 py-3 hover:brightness-110 transition"
        >
          Watch Video
        </a>

        <div id="comments" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-bold text-white mb-4">
            Comments ({comments.length})
          </h2>

          <div className="mb-8">
            <CommentForm slug={slug} />
          </div>

          {comments.length === 0 ? (
            <p className="text-sm text-white/50">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-white/10 bg-[#0d1330]/80 p-4"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-white text-sm">
                      {c.name}
                    </span>
                    <span className="text-xs text-white/40">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 whitespace-pre-wrap">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
