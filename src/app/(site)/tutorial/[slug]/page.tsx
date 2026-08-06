import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVideoBySlug, getVideos } from "@/lib/videos-store";
import CopyPromptBox from "@/components/CopyPromptBox";
import BackToTutorials from "@/components/BackToTutorials";

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((video) => ({ slug: video.slug }));
}

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

  return (
    <main className="flex-1">
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
      </section>
    </main>
  );
}
