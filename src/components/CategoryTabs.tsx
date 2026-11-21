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
  // Prevent the mouse click from focusing the button at all. A tab
  // re-renders with a slightly different size/weight once it becomes
  // active, and if the browser had just given it focus, it tries to keep
  // that now-shifted focused element in view — which was the "page jumps
  // around on click" bug. Keyboard (Tab-key) focus/activation is
  // untouched since this only intercepts mousedown.
  function preventFocus(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-line mb-10">
      <button
        type="button"
        onMouseDown={preventFocus}
        onClick={() => onSelect("")}
        className={
          !active
            ? "cat-tab -mb-px border-b-2 border-ink px-4 py-3 text-sm font-semibold text-ink"
            : "cat-tab -mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted hover:text-ink"
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
            onMouseDown={preventFocus}
            onClick={() => onSelect(c.name)}
            className={
              isActive
                ? "cat-tab -mb-px border-b-2 border-ink px-4 py-3 text-sm font-semibold text-ink"
                : "cat-tab -mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted hover:text-ink"
            }
          >
            {c.name}
            <span className="ml-1.5 text-xs text-muted">{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
