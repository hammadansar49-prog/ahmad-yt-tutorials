"use client";

import { useRouter } from "next/navigation";

export default function CategoryTabs({
  categories,
  active,
  query,
}: {
  categories: { name: string; count: number }[];
  active: string;
  query: string;
}) {
  const router = useRouter();

  function hrefFor(category: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  function go(category: string, e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    // A quick outward "pop" on the tab that was just tapped.
    const el = e.currentTarget;
    el.classList.remove("cat-tab-pop");
    // Force a reflow so the animation restarts if the same tab is clicked twice.
    void el.offsetWidth;
    el.classList.add("cat-tab-pop");

    // router.push alone re-runs the (force-dynamic) route with the new
    // searchParams — a follow-up router.refresh() was firing a second,
    // redundant server round-trip that made switching feel slow.
    router.push(hrefFor(category), { scroll: false });
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      <a
        href={hrefFor("")}
        onClick={(e) => go("", e)}
        className={
          !active
            ? "cat-tab rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white transition"
            : "cat-tab rounded-full px-4 py-2 text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition"
        }
      >
        All
      </a>
      {categories.map((c) => {
        const isActive = active === c.name;
        return (
          <a
            key={c.name}
            href={hrefFor(c.name)}
            onClick={(e) => go(c.name, e)}
            className={
              isActive
                ? "cat-tab rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white transition"
                : "cat-tab rounded-full px-4 py-2 text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition"
            }
          >
            {c.name}
            <span className="ml-1.5 text-xs opacity-70">{c.count}</span>
          </a>
        );
      })}
    </div>
  );
}
