import type { Metadata } from "next";
import HomeVideoGrid from "@/components/HomeVideoGrid";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import PageViewTracker from "@/components/PageViewTracker";
import { getVideos } from "@/lib/videos-store";
import { toListVideo } from "@/lib/video-images";
import { SITE_URL, SITE_NAME, SAME_AS, jsonLdString } from "@/lib/site";
import { getCategories } from "@/lib/categories-store";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ahmad YT Tutorial - Free AI Video Prompts to Start Your YouTube Channel",
  description:
    "Free, tested AI video prompts behind every Ahmad YT Tutorial video. Copy them in one click and start making AI videos and Shorts for YouTube.",
  alternates: { canonical: "/" },
};

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const [params, videos, allCategories, siteContent] = await Promise.all([
    searchParams,
    getVideos(),
    getCategories(),
    getSiteContent(),
  ]);

  const rawQuery = params?.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? "")
    .trim()
    .toLowerCase();

  const rawCategory = params?.category;
  const category = (
    Array.isArray(rawCategory) ? rawCategory[0] : rawCategory ?? ""
  ).trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/tutorials?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        sameAs: SAME_AS,
      },
      {
        "@type": "ItemList",
        name: "Latest AI video tutorials",
        itemListElement: videos.slice(0, 30).map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/tutorial/${v.slug}`,
          name: v.title,
        })),
      },
    ],
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <PageViewTracker trackKey="home" />

      <HomeVideoGrid
        initialVideos={videos.map(toListVideo)}
        initialCategories={allCategories}
        query={query}
        category={category}
      />

      <AboutSection content={siteContent} headingLevel="h2" />
      <ContactSection content={siteContent} headingLevel="h2" />
    </main>
  );
}
