import VideoForm from "../VideoForm";
import { createVideoAction } from "@/lib/video-actions";
import { getCategories } from "@/lib/categories-store";

export const dynamic = "force-dynamic";

export default async function NewVideoPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Add New Tutorial</h1>
      <p className="text-white/50 mb-8">
        Upload the thumbnail and prompt for a new YouTube tutorial.
      </p>
      <VideoForm action={createVideoAction} categories={categories} />
    </div>
  );
}
