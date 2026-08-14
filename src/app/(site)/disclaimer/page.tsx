import type { Metadata } from "next";
import { getLegalContent } from "@/lib/legal-content-store";
import PageViewTracker from "@/components/PageViewTracker";
import LegalContentBlock from "@/components/LegalContentBlock";

export const metadata: Metadata = {
  title: "Disclaimer - Ahmad YT Tutorial",
  description: "Disclaimer for Ahmad YT Tutorial.",
  alternates: { canonical: "/disclaimer" },
};

export default async function DisclaimerPage() {
  const content = await getLegalContent();

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="disclaimer" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
          {content.disclaimerHeading}
        </h1>
        <LegalContentBlock body={content.disclaimerBody} />
      </section>
    </main>
  );
}
