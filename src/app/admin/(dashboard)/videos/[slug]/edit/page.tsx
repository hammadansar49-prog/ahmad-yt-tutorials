import { notFound } from "next/navigation";
import VideoForm from "../../VideoForm";
import { getVideoBySlug, thumbnailSrc, sidePictureSrc } from "@/lib/videos-store";
import { updateVideoAction } from "@/lib/video-actions";
import { getCategories } from "@/lib/categories-store";

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

  // Swap the full base64 image data for short image URLs before this
  // reaches the client-side form — otherwise the thumbnail and every side
  // picture's raw bytes get embedded directly into this page's payload.
  const displayVideo = {
    ...video,
    thumbnail: thumbnailSrc(video),
    sidePictures: video.sidePictures?.map((_, i) => sidePictureSrc(video, i)),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Edit Tutorial</h1>
      <p className="text-white/50 mb-8">{video.title}</p>
      <VideoForm action={boundAction} video={displayVideo} categories={categories} />
    </div>
  );
}
