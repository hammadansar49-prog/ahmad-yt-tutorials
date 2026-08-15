"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import type { VideoFormState } from "@/lib/video-actions";
import type { Video } from "@/lib/videos-store";
import TagInput from "@/components/TagInput";
import FaqInput from "@/components/FaqInput";
import CategorySelect from "@/components/CategorySelect";

const initialState: VideoFormState = {};

export default function VideoForm({
  action,
  video,
  categories,
}: {
  action: (
    state: VideoFormState,
    formData: FormData
  ) => Promise<VideoFormState>;
  video?: Video;
  categories: string[];
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sidePicturePreviews, setSidePicturePreviews] = useState<string[]>([]);
  const [sidePictureError, setSidePictureError] = useState<string | null>(
    null
  );

  const MAX_SIDE_PICTURES = 5;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Title *
        </label>
        <input
          name="title"
          required
          defaultValue={video?.title}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
          placeholder="e.g. How to Design a Thumbnail With AI"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Description *
        </label>
        <textarea
          name="description"
          required
          rows={2}
          defaultValue={video?.description}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition resize-none"
          placeholder="Short summary of the tutorial"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            Category *
          </label>
          <CategorySelect
            name="category"
            categories={
              video?.category && !categories.includes(video.category)
                ? [...categories, video.category]
                : categories
            }
            defaultValue={video?.category}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">
            YouTube Video URL *
          </label>
          <input
            name="youtubeUrl"
            type="url"
            required
            defaultValue={video?.youtubeUrl}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Tools Used
        </label>
        <TagInput
          name="tools"
          defaultValue={video?.tools}
          placeholder="Type a tool and press Enter (e.g. ChatGPT)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Thumbnail Image {video ? "(leave empty to keep current)" : "*"}
        </label>
        {(previewUrl || video?.thumbnail) && (
          <div className="relative w-40 aspect-video rounded-lg overflow-hidden mb-2 border border-white/10">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob: preview URL, next/image can't optimize it
              <img
                src={previewUrl}
                alt="New thumbnail preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={video!.thumbnail}
                alt="Current thumbnail"
                fill
                className="object-cover"
              />
            )}
          </div>
        )}
        <input
          name="thumbnail"
          type="file"
          accept="image/*"
          required={!video}
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreviewUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return file ? URL.createObjectURL(file) : null;
            });
          }}
          className="w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/20 file:transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          AI Prompt *
        </label>
        <textarea
          name="prompt"
          required
          rows={6}
          defaultValue={video?.prompt}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition font-mono text-sm"
          placeholder="Paste the full AI prompt used for this video"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          FAQs
        </label>
        <FaqInput name="faqs" defaultValue={video?.faqs} />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Side Pictures (1–5 images, shown alongside the FAQs)
        </label>
        {(sidePicturePreviews.length > 0 ||
          (video?.sidePictures?.length ?? 0) > 0) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {(sidePicturePreviews.length > 0
              ? sidePicturePreviews
              : video!.sidePictures!
            ).map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10"
              >
                {sidePicturePreviews.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element -- blob: preview URL, next/image can't optimize it
                  <img
                    src={src}
                    alt={`Side picture preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={`Side picture ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <input
          name="sidePictures"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > MAX_SIDE_PICTURES) {
              setSidePictureError(
                `You can upload up to ${MAX_SIDE_PICTURES} images only.`
              );
              e.target.value = "";
              setSidePicturePreviews([]);
              return;
            }
            setSidePictureError(null);
            sidePicturePreviews.forEach((url) => URL.revokeObjectURL(url));
            setSidePicturePreviews(files.map((f) => URL.createObjectURL(f)));
          }}
          className="w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/20 file:transition"
        />
        {sidePictureError && (
          <p className="mt-1.5 text-sm text-red-400">{sidePictureError}</p>
        )}
        {video && (
          <p className="mt-1.5 text-xs text-white/40">
            Leave empty to keep the current side pictures.
          </p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold px-6 py-2.5 hover:brightness-110 transition disabled:opacity-60"
      >
        {pending ? "Saving..." : video ? "Save Changes" : "Publish Tutorial"}
      </button>
    </form>
  );
}
