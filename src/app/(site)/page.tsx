import Hero from "@/components/Hero";
import VideoCard from "@/components/VideoCard";
import CategoryTabs from "@/components/CategoryTabs";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
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

  const filteredVideos = videos.filter((video) => {
    const matchesQuery = query
      ? video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query)
      : true;
    const matchesCategory = category ? video.category === category : true;
    return matchesQuery && matchesCategory;
  });

  const categoriesWithCounts = allCategories
    .map((name) => ({
      name,
      count: videos.filter((v) => v.category === name).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <main className="flex-1">
      {!hasFilter && <Hero />}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Latest Tutorials &amp; Prompts
          </h1>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto">
            Every video comes with its full AI prompt — just hit{" "}
            <span className="text-[#ff6a3d] font-semibold">Copy Code</span>{" "}
            and the whole prompt is copied instantly.
          </p>
          {query && (
            <p className="mt-4 text-sm text-white/50">
              {filteredVideos.length > 0
                ? `Showing results for "${query}"`
                : `No tutorials found for "${query}"`}
            </p>
          )}
        </div>

        {categoriesWithCounts.length > 0 && (
          <CategoryTabs
            categories={categoriesWithCounts}
            active={category}
            query={query}
          />
        )}

        {filteredVideos.length > 0 ? (
          <div
            className={
              filteredVideos.length < 3
                ? "flex flex-wrap justify-center gap-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {filteredVideos.map((video) => (
              <div
                key={video.slug}
                className={
                  filteredVideos.length < 3
                    ? "w-full sm:w-[340px]"
                    : undefined
                }
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : !query ? (
          <p className="text-center text-white/50">
            No tutorials in this category yet.
          </p>
        ) : null}
      </section>

      <AboutSection content={siteContent} />
      <ContactSection content={siteContent} />
    </main>
  );
}
