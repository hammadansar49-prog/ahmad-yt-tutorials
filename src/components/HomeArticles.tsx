import Link from "next/link";
import { ARTICLES } from "@/lib/articles-data";

export default function HomeArticles() {
  const items = ARTICLES.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="reveal max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Guides
          </p>
          <h2 className="font-serif font-normal text-5xl sm:text-6xl leading-none tracking-tight">
            Articles
          </h2>
        </div>
        <Link href="/articles" className="text-[15px] font-medium hover:text-brand">
          All articles <span className="arrow-move">→</span>
        </Link>
      </div>
      <div className="border-t border-ink">
        {items.map((a, i) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="group flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-line py-6 sm:py-7"
          >
            <span className="w-10 font-serif text-2xl text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-[1_1_380px] text-lg sm:text-[22px] font-semibold tracking-tight group-hover:text-brand">
              {a.title}
            </span>
            <span className="text-sm text-muted">{a.category}</span>
            <span className="arrow-move text-muted group-hover:text-brand" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
