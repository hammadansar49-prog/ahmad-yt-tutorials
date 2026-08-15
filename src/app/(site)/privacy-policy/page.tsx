import type { Metadata } from "next";
import { getLegalContent } from "@/lib/legal-content-store";
import PageViewTracker from "@/components/PageViewTracker";
import LegalContentBlock from "@/components/LegalContentBlock";
import { getLang, pickTranslation } from "@/lib/get-lang";

export const metadata: Metadata = {
  title: "Privacy Policy - Ahmad YT Tutorial",
  description: "Privacy Policy for Ahmad YT Tutorial.",
  alternates: { canonical: "/privacy-policy" },
};

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const content = await getLegalContent();
  const lang = await getLang();
  const heading = pickTranslation(
    content.privacyHeading,
    content.translations,
    "privacyHeading",
    lang
  );
  const body = pickTranslation(
    content.privacyBody,
    content.translations,
    "privacyBody",
    lang
  );

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="privacy-policy" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
          {heading}
        </h1>
        <LegalContentBlock body={body} />
      </section>
    </main>
  );
}
