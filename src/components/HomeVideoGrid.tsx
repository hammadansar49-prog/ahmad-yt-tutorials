"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { where } from "firebase/firestore";
import Hero from "./Hero";
import WhyOurPrompts from "./WhyOurPrompts";
import VideoCard from "./VideoCard";
import CategoryTabs from "./CategoryTabs";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import type { Video } from "@/lib/videos-store";
import type { Comment } from "@/lib/comments-store";

export default function HomeVideoGrid({
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
    // Update local state immediately so the grid re-filters instantly,
    // without waiting on a server round-trip. Sync the URL in the
    // background (fire-and-forget) purely so the filter is shareable/
    // bookmarkable and survives a refresh.
    setCategory(next);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (next) params.set("category", next);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }

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

  const categoriesWithCounts = initialCategories
    .map((name) => ({
      name,
      count: videos.filter((v) => v.category === name).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      {!hasFilter && <Hero />}
      {!hasFilter && <WhyOurPrompts />}

      <section id="tutorials" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Selected work
            </p>
            <h1 className="font-serif font-normal text-5xl sm:text-6xl leading-none tracking-tight">
              Latest Tutorials &amp; Prompts
            </h1>
            <p className="mt-4 text-muted max-w-xl">
              Every video comes with its full AI prompt — just hit{" "}
              <span className="text-brand font-semibold">Copy Code</span>{" "}
              and the whole prompt is copied instantly.
            </p>
          </div>
          <Link href="/tutorials" className="text-[15px] font-medium hover:text-brand">
            View all posts <span className="arrow-move">→</span>
          </Link>
          {query && (
            <p className="w-full text-sm text-muted">
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
        ) : !query ? (
          <p className="text-center text-muted py-16 border border-dashed border-line rounded-2xl">
            {hasFilter
              ? "No tutorials in this category yet."
              : "No tutorials in this category yet."}
          </p>
        ) : null}
      </section>
    </>
  );
}
