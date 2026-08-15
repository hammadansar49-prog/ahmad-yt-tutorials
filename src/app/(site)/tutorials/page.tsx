import type { Metadata } from "next";
import AllTutorialsGrid from "@/components/AllTutorialsGrid";
import PageViewTracker from "@/components/PageViewTracker";
import { getVideos } from "@/lib/videos-store";
import { getCategories } from "@/lib/categories-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Tutorials - Ahmad YT Tutorial",
  description:
    "Every AI video editing tutorial from Ahmad YT Tutorial, with its full prompt, in one place.",
  alternates: { canonical: "/tutorials" },
};

export default async function AllTutorialsPage({
  searchParams,
}: PageProps<"/tutorials">) {
  const [params, videos, allCategories] = await Promise.all([
    searchParams,
    getVideos(),
    getCategories(),
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
      <PageViewTracker trackKey="tutorials" />
      <AllTutorialsGrid
        initialVideos={videos}
        initialCategories={allCategories}
        query={query}
        category={category}
      />
    </main>
  );
}
