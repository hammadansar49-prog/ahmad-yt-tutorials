import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVideoBySlug } from "@/lib/videos-store";
import { getApprovedCommentsForVideo } from "@/lib/comments-store";
import CopyPromptBox from "@/components/CopyPromptBox";
import FaqSection from "@/components/FaqSection";
import VideoEmbed from "@/components/VideoEmbed";
import BackToTutorials from "@/components/BackToTutorials";
import LiveVideoMeta from "@/components/LiveVideoMeta";
import LiveComments from "@/components/LiveComments";
import CommentForm from "@/components/CommentForm";
import PageViewTracker from "@/components/PageViewTracker";
import TranslatedText from "@/components/TranslatedText";

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
    alternates: { canonical: `/tutorial/${video.slug}` },
    openGraph: {
      title: video.title,
      description: video.description,
      type: "article",
      images: [video.thumbnail],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [video.thumbnail],
    },
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
      <PageViewTracker slug={slug} trackKey={`video_${slug}`} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <BackToTutorials />

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            priority
            quality={92}
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
          <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
            {video.category}
          </span>
        </div>

        <TranslatedText
          as="h1"
          className="text-2xl sm:text-3xl font-extrabold text-white mt-6"
          original={video.title}
          translations={video.translations}
          field="title"
        />
        <TranslatedText
          as="p"
          className="mt-2 text-white/60"
          original={video.description}
          translations={video.translations}
          field="description"
        />

        <LiveVideoMeta
          slug={video.slug}
          initialVideo={video}
          commentCount={comments.length}
        />

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
          Watch on YouTube
        </a>

        <div className="mt-10">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3">
            Watch The Full Video
          </h2>
          <VideoEmbed
            youtubeUrl={video.youtubeUrl}
            thumbnail={video.thumbnail}
            title={video.title}
          />
        </div>

        <FaqSection faqs={video.faqs ?? []} sidePictures={video.sidePictures} />

        <div id="comments" className="mt-12 scroll-mt-20">
          <div className="mb-8">
            <CommentForm slug={slug} />
          </div>

          <LiveComments slug={slug} initialComments={comments} />
        </div>
      </section>
    </main>
  );
}
