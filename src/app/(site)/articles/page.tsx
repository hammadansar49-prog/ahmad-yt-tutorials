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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Articles
          </h1>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto">
            In-depth guides on AI video prompts, faceless YouTube channels,
            and growing a channel with AI-generated content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group rounded-xl sm:rounded-2xl border border-white/10 bg-[#0d1330]/95 p-5 sm:p-6 hover:border-[#3b82f6]/40 hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.5)] transition"
            >
              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/70 uppercase tracking-wide mb-3">
                {article.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-[#ff8a1c] transition">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
