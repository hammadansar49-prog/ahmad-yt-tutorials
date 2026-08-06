import Link from "next/link";

export default function CategoryTabs({
  categories,
  active,
  query,
}: {
  categories: { name: string; count: number }[];
  active: string;
  query: string;
}) {
  function hrefFor(category: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      <Link
        href={hrefFor("")}
        className={
          !active
            ? "rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white transition"
            : "rounded-full px-4 py-2 text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition"
        }
      >
        All
      </Link>
      {categories.map((c) => {
        const isActive = active === c.name;
        return (
          <Link
            key={c.name}
            href={hrefFor(c.name)}
            className={
              isActive
                ? "rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white transition"
                : "rounded-full px-4 py-2 text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition"
            }
          >
            {c.name}
            <span className="ml-1.5 text-xs opacity-70">{c.count}</span>
          </Link>
        );
      })}
    </div>
  );
}
