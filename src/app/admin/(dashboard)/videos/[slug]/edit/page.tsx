import { notFound } from "next/navigation";
import VideoForm from "../../VideoForm";
import { getVideoBySlug } from "@/lib/videos-store";
import { updateVideoAction } from "@/lib/video-actions";
import { getCategories } from "@/lib/categories-store";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({
  params,
}: PageProps<"/admin/videos/[slug]/edit">) {
  const { slug } = await params;
  const [video, categories] = await Promise.all([
    getVideoBySlug(slug),
    getCategories(),
  ]);

  if (!video) notFound();

  const boundAction = updateVideoAction.bind(null, slug);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Edit Tutorial</h1>
      <p className="text-white/50 mb-8">{video.title}</p>
      <VideoForm action={boundAction} video={video} categories={categories} />
    </div>
  );
}
