import { getCategories } from "@/lib/categories-store";
import { getVideos } from "@/lib/videos-store";
import AddCategoryForm from "./AddCategoryForm";
import CategoryRow from "./CategoryRow";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [categories, videos] = await Promise.all([
    getCategories(),
    getVideos(),
  ]);

  const counts = new Map<string, number>();
  for (const video of videos) {
    counts.set(video.category, (counts.get(video.category) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Categories</h1>
      <p className="text-white/50 mb-8">
        Manage the categories tutorials can be tagged with.
      </p>

      <AddCategoryForm />

      {categories.length === 0 ? (
        <p className="text-white/50">No categories yet.</p>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {categories.map((name) => (
            <CategoryRow
              key={name}
              name={name}
              videoCount={counts.get(name) ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
