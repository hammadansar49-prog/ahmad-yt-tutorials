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
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition mb-6"
        >
          ← Back to all articles
        </Link>

        <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand uppercase tracking-wide mb-6">
          {article.category}
        </span>

        <h1 data-no-scrub className="fade-up font-serif font-normal text-5xl sm:text-7xl leading-[1.02] tracking-tight text-ink">
          {article.title}
        </h1>
        <p className="mt-6 text-muted text-xl leading-relaxed pb-8 border-b border-line">
          {article.description}
        </p>

        <div className="mt-8 space-y-5">
          {article.blocks.map((block, i) =>
            "h2" in block ? (
              <h2
                key={i}
                className="font-serif font-normal text-3xl sm:text-4xl leading-tight tracking-tight text-ink pt-8"
              >
                {block.h2}
              </h2>
            ) : (
              <p key={i} className="text-[#2a2a33] text-[17px] sm:text-lg leading-[1.8]">
                {block.p}
              </p>
            )
          )}
        </div>

        <div className="mt-16 rounded-2xl bg-soft p-8 sm:p-10 text-center">
          <p className="text-muted mb-4">
            Want the exact prompts behind our AI videos too?
          </p>
          <Link
            href="/tutorials"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-white font-medium text-sm px-8 py-3.5 hover:bg-brand-dark hover:-translate-y-0.5"
          >
            Browse All Tutorials
          </Link>
        </div>
      </article>
    </main>
  );
}
