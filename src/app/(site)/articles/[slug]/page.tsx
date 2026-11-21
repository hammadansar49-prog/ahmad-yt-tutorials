import { SITE_URL, SITE_NAME, SAME_AS, pageTitle, jsonLdString } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/lib/articles-data";
import PageViewTracker from "@/components/PageViewTracker";

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: pageTitle(article.title),
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    articleSection: article.category,
    url: `${SITE_URL}/articles/${article.slug}`,
    mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
    image: `${SITE_URL}/icon.png`,
    inLanguage: "en",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
      sameAs: SAME_AS,
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/articles/${article.slug}` },
    ],
  };

  return (
    <main className="flex-1">
      <PageViewTracker trackKey={`article_${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition mb-6"
        >
          ← Back to all articles
        </Link>

        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 uppercase tracking-wide mb-4">
          {article.category}
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>
        <p className="mt-4 text-white/60 text-base sm:text-lg leading-relaxed">
          {article.description}
        </p>

        <div className="mt-8 space-y-5">
          {article.blocks.map((block, i) =>
            "h2" in block ? (
              <h2
                key={i}
                className="text-xl sm:text-2xl font-bold text-white pt-4"
              >
                {block.h2}
              </h2>
            ) : (
              <p key={i} className="text-white/75 leading-relaxed">
                {block.p}
              </p>
            )
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 mb-4">
            Want the exact prompts behind our AI videos too?
          </p>
          <Link
            href="/tutorials"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold text-sm px-8 py-3 hover:brightness-110 transition"
          >
            Browse All Tutorials
          </Link>
        </div>
      </article>
    </main>
  );
}
