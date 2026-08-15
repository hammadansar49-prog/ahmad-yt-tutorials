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
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
          {heading}
        </h1>
        <LegalContentBlock body={body} />
      </section>
    </main>
  );
}
