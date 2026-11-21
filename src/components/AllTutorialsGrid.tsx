"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { where } from "firebase/firestore";
import VideoCard from "./VideoCard";
import CategoryTabs from "./CategoryTabs";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import type { Video } from "@/lib/videos-store";
import type { Comment } from "@/lib/comments-store";

// Dedicated "All Posts" page — sourced only from the `videos` (tutorials)
// collection via getVideos(). Keep it that way even after an "articles"
// feature is added later: this page must only ever list tutorials, never
// articles, so don't merge in another content source here.
export default function AllTutorialsGrid({
  initialVideos,
  initialCategories,
  query,
  category: initialCategory,
}: {
  initialVideos: Video[];
  initialCategories: string[];
  query: string;
  category: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);

  const videos = useFirestoreCollection<Video>("videos", initialVideos);
  const approvedComments = useFirestoreCollection<Comment>(
    "comments",
    [],
    [where("approved", "==", true)]
  );

  const commentCounts: Record<string, number> = {};
  for (const c of approvedComments) {
    commentCounts[c.videoSlug] = (commentCounts[c.videoSlug] ?? 0) + 1;
  }

  function selectCategory(next: string) {
    setCategory(next);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (next) params.set("category", next);
    const qs = params.toString();
    router.replace(qs ? `/tutorials?${qs}` : "/tutorials", { scroll: false });
  }

  const filteredVideos = videos.filter((video) => {
    const matchesQuery = query
      ? video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query)
      : true;
    const matchesCategory = category ? video.category === category : true;
    return matchesQuery && matchesCategory;
  });

  const categoriesWithCounts = initialCategories
    .map((name) => ({
      name,
      count: videos.filter((v) => v.category === name).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20">
      <div className="fade-up mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Library
        </p>
        <h1 data-no-scrub className="font-serif font-normal text-5xl sm:text-7xl leading-none tracking-tight">
          All Posts
        </h1>
        <p className="mt-4 text-lg text-muted max-w-xl">
          Every tutorial we&apos;ve ever posted, in one place — each with its
          exact prompt.
        </p>
        {query && (
          <p className="mt-4 text-sm text-muted">
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
          onSelect={selectCategory}
        />
      )}

      {filteredVideos.length > 0 ? (
        <div
          className={
            filteredVideos.length === 1
              ? "flex justify-center"
              : "grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-7 sm:gap-y-12"
          }
        >
          {filteredVideos.map((video) => (
            <div
              key={video.slug}
              className={
                filteredVideos.length === 1 ? "w-full sm:w-[340px]" : "h-full"
              }
            >
              <VideoCard
                video={video}
                commentCount={commentCounts[video.slug] ?? 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted py-16 border border-dashed border-line rounded-2xl">No tutorials yet.</p>
      )}
    </section>
  );
}
