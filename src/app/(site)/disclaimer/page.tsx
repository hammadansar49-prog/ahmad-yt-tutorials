import type { Metadata } from "next";
import { getLegalContent } from "@/lib/legal-content-store";
import PageViewTracker from "@/components/PageViewTracker";
import LegalContentBlock from "@/components/LegalContentBlock";
import { getLang, pickTranslation } from "@/lib/get-lang";

export const metadata: Metadata = {
  title: "Disclaimer - Ahmad YT Tutorial",
  description: "Disclaimer for Ahmad YT Tutorial.",
  alternates: { canonical: "/disclaimer" },
};

export const dynamic = "force-dynamic";

export default async function DisclaimerPage() {
  const content = await getLegalContent();
  const lang = await getLang();
  const heading = pickTranslation(
    content.disclaimerHeading,
    content.translations,
    "disclaimerHeading",
    lang
  );
  const body = pickTranslation(
    content.disclaimerBody,
    content.translations,
    "disclaimerBody",
    lang
  );

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="disclaimer" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Legal</p>
        <h1 data-no-scrub className="fade-up font-serif font-normal text-5xl sm:text-6xl leading-none tracking-tight text-ink mb-10 pb-8 border-b border-line">
          {heading}
        </h1>
        <LegalContentBlock body={body} />
      </section>
    </main>
  );
}
