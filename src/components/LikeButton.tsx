"use client";

import { useEffect, useState, useTransition } from "react";
import { likeVideoAction } from "@/lib/like-action";

export default function LikeButton({
  slug,
  initialLikes,
  size = "md",
}: {
  slug: string;
  initialLikes: number;
  size?: "sm" | "md";
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // One-time sync from localStorage (an external, non-reactive browser
    // API) on mount; this is not derivable during render since it's only
    // available client-side.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiked(localStorage.getItem(`ayt_liked_${slug}`) === "1");
  }, [slug]);

  function handleClick() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    localStorage.setItem(`ayt_liked_${slug}`, nextLiked ? "1" : "0");

    startTransition(async () => {
      const updated = await likeVideoAction(slug, nextLiked);
      setLikes(updated);
    });
  }

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 ${textSize} font-medium transition ${
        liked ? "text-[#ff2d55]" : "text-white/60 hover:text-white"
      }`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg
        viewBox="0 0 24 24"
        className={iconSize}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M12 21s-6.7-4.35-9.3-8.2C1 10 1.8 6.6 4.6 5.2c2.3-1.2 4.9-.3 6.4 1.7 1.5-2 4.1-2.9 6.4-1.7 2.8 1.4 3.6 4.8 1.9 7.6C18.7 16.65 12 21 12 21Z"
          strokeLinejoin="round"
        />
      </svg>
      {likes}
    </button>
  );
}
