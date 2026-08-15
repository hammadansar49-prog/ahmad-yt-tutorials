"use client";

import { useEffect, useRef } from "react";

/**
 * A textarea that grows to fit its content as the admin types, instead of
 * staying a fixed height with an inner scrollbar — so the full
 * description/prompt is visible at a glance while editing.
 */
export default function AutoGrowTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (ref.current) resize(ref.current);
  }, []);

  return (
    <textarea
      ref={ref}
      onInput={(e) => resize(e.currentTarget)}
      className={`${className ?? ""} overflow-hidden resize-none`}
      {...props}
    />
  );
}
