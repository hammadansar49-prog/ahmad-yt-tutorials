import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles-data";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Articles - Ahmad YT Tutorial",
  description:
    "In-depth guides on AI video prompts, faceless YouTube channels, and growing a channel with AI-generated content.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  return (
    <main className="flex-1">
      <PageViewTracker trackKey="articles" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
        <div className="fade-up mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Guides</p>
          <h1 data-no-scrub className="font-serif font-normal text-5xl sm:text-7xl leading-none tracking-tight">
            Articles
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            In-depth guides on AI video prompts, faceless YouTube channels,
            and growing a channel with AI-generated content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group lift rounded-2xl border border-line bg-white p-6 sm:p-8 flex flex-col hover:border-ink/25"
            >
              <span className="self-start rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand uppercase tracking-wide mb-6">
                {article.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-brand transition">
                {article.title}
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
                {article.description}
              </p>
              <span className="mt-6 pt-5 border-t border-line text-sm font-medium group-hover:text-brand">
                Read article <span className="arrow-move">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
