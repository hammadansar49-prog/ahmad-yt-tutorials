"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { VideoFormState } from "@/lib/video-actions";
import type { Video } from "@/lib/videos-store";
import TagInput from "@/components/TagInput";
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
        {video?.thumbnail && (
          <div className="relative w-40 aspect-video rounded-lg overflow-hidden mb-2 border border-white/10">
            <Image
              src={video.thumbnail}
              alt="Current thumbnail"
              fill
              className="object-cover"
            />
          </div>
        )}
        <input
          name="thumbnail"
          type="file"
          accept="image/*"
          required={!video}
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
