"use client";

import { where } from "firebase/firestore";
import VideoCard from "./VideoCard";
import CategoryTabs from "./CategoryTabs";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import type { Video } from "@/lib/videos-store";
import type { Comment } from "@/lib/comments-store";

export default function HomeVideoGrid({
  initialVideos,
  initialCategories,
  query,
  category,
}: {
  initialVideos: Video[];
  initialCategories: string[];
  query: string;
  category: string;
}) {
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
            filteredVideos.length === 1
              ? "flex justify-center"
              : "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
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
        <p className="text-center text-white/50">
          {hasFilter
            ? "No tutorials in this category yet."
            : "No tutorials in this category yet."}
        </p>
      ) : null}
    </>
  );
}
