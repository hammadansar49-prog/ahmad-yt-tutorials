"use client";

export default function CategoryTabs({
  categories,
  active,
  onSelect,
}: {
  categories: { name: string; count: number }[];
  active: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={
          !active
            ? "cat-tab rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white transition"
            : "cat-tab rounded-full px-4 py-2 text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition"
        }
      >
        All
      </button>
      {categories.map((c) => {
        const isActive = active === c.name;
        return (
          <button
            type="button"
            key={c.name}
            onClick={() => onSelect(c.name)}
            className={
              isActive
                ? "cat-tab rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white transition"
                : "cat-tab rounded-full px-4 py-2 text-sm font-semibold border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition"
            }
          >
            {c.name}
            <span className="ml-1.5 text-xs opacity-70">{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
