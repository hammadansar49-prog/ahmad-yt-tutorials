import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content-store";
import ContactSection from "@/components/ContactSection";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Contact - Ahmad YT Tutorial",
  description:
    "Get in touch with Ahmad YT Tutorial - follow us on YouTube, Instagram, Telegram, and Facebook.",
  alternates: { canonical: "/contact" },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="contact" />
      <ContactSection content={content} />
    </main>
  );
}
