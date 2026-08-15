import type { Metadata } from "next";
import HomeVideoGrid from "@/components/HomeVideoGrid";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import PageViewTracker from "@/components/PageViewTracker";
import { getVideos } from "@/lib/videos-store";
import { getCategories } from "@/lib/categories-store";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ahmad YT Tutorial - Free AI Video Prompts to Start Your YouTube Channel",
  description:
    "Learn why AI prompts matter and get the exact, tested prompts behind every Ahmad YT Tutorial video — free to copy. Start your YouTube journey with AI video editing, Shorts, and channel growth tips, no budget or editing experience needed.",
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

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="home" />

      <HomeVideoGrid
        initialVideos={videos}
        initialCategories={allCategories}
        query={query}
        category={category}
      />

      <AboutSection content={siteContent} headingLevel="h2" />
      <ContactSection content={siteContent} headingLevel="h2" />
    </main>
  );
}
