import Hero from "@/components/Hero";
import HomeVideoGrid from "@/components/HomeVideoGrid";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import PageViewTracker from "@/components/PageViewTracker";
import { getVideos } from "@/lib/videos-store";
import { getCategories } from "@/lib/categories-store";
import { getSiteContent } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";

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

  const hasFilter = Boolean(query || category);

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="home" />
      {!hasFilter && <Hero />}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <HomeVideoGrid
          initialVideos={videos}
          initialCategories={allCategories}
          query={query}
          category={category}
        />
      </section>

      <AboutSection content={siteContent} />
      <ContactSection content={siteContent} />
    </main>
  );
}
