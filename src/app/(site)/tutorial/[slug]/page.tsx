import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVideoBySlug, thumbnailSrc, sidePictureSrc } from "@/lib/videos-store";
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
import { getYouTubeId } from "@/lib/youtube";
import {
  SITE_URL,
  SITE_NAME,
  YOUTUBE_CHANNEL_URL,
  absoluteUrl,
  metaDescription,
  pageTitle,
  jsonLdString,
} from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/tutorial/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return {};
  const description = metaDescription(video.description || video.title);
  return {
    title: pageTitle(video.title),
    description,
    keywords: [video.category, ...(video.tools ?? []), "AI video prompt", "free AI prompt"],
    alternates: { canonical: `/tutorial/${video.slug}` },
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      url: `/tutorial/${video.slug}`,
      images: [{ url: thumbnailSrc(video), alt: video.title }],
      ...(video.youtubeUrl ? { videos: [{ url: video.youtubeUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description,
      images: [thumbnailSrc(video)],
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

  const pageUrl = `${SITE_URL}/tutorial/${video.slug}`;
  const ytId = video.youtubeUrl ? getYouTubeId(video.youtubeUrl) : null;
  const faqs = (video.faqs ?? []).filter((f) => f.question && f.answer);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...(ytId
        ? [
            {
              "@type": "VideoObject",
              name: video.title,
              description: video.description || video.title,
              thumbnailUrl: [
                absoluteUrl(thumbnailSrc(video)),
                `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
              ],
              ...(video.createdAt ? { uploadDate: video.createdAt } : {}),
              embedUrl: `https://www.youtube.com/embed/${ytId}`,
              contentUrl: `https://www.youtube.com/watch?v=${ytId}`,
              url: pageUrl,
              genre: video.category,
              author: { "@type": "Person", name: "Ahmad", url: YOUTUBE_CHANNEL_URL },
              publisher: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME, url: SITE_URL },
              interactionStatistic: [
                { "@type": "InteractionCounter", interactionType: { "@type": "WatchAction" }, userInteractionCount: video.views ?? 0 },
                { "@type": "InteractionCounter", interactionType: { "@type": "LikeAction" }, userInteractionCount: video.likes ?? 0 },
              ],
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tutorials", item: `${SITE_URL}/tutorials` },
          { "@type": "ListItem", position: 3, name: video.title, item: pageUrl },
        ],
      },
      ...(faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <PageViewTracker slug={slug} trackKey={`video_${slug}`} />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        <BackToTutorials />

        <div className="fade-up relative w-full aspect-video rounded-2xl overflow-hidden bg-soft2 shadow-[0_30px_60px_-30px_rgba(11,11,15,0.4)]">
          <Image
            src={thumbnailSrc(video)}
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
          className="font-serif font-normal text-4xl sm:text-6xl leading-[1.02] tracking-tight text-ink mt-10"
          original={video.title}
          translations={video.translations}
          field="title"
        />
        <TranslatedText
          as="p"
          className="mt-4 text-lg leading-relaxed text-muted"
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
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Tools Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {video.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink hover:border-ink/30"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {video.prompts.map((prompt, i) => (
            <CopyPromptBox
              key={i}
              prompt={prompt}
              label={
                video.prompts.length > 1
                  ? `Master Prompt ${i + 1}`
                  : "Master Prompt"
              }
            />
          ))}
        </div>

        {video.youtubeUrl && (
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand text-white font-medium text-sm px-8 py-3.5 hover:bg-brand-dark hover:-translate-y-0.5"
          >
            Watch on YouTube
          </a>
        )}

        <div className="mt-10">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            Watch The Full Video
          </h2>
          <VideoEmbed
            youtubeUrl={video.youtubeUrl}
            thumbnail={thumbnailSrc(video)}
            title={video.title}
          />
        </div>

        <FaqSection
          faqs={video.faqs ?? []}
          sidePictures={video.sidePictures?.map((_, i) => sidePictureSrc(video, i))}
        />

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
