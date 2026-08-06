import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content-store";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact - Ahmad YT Tutorial",
  description:
    "Get in touch with Ahmad YT Tutorial - follow us on YouTube, Instagram, Telegram, and Facebook.",
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <main className="flex-1">
      <ContactSection content={content} />
    </main>
  );
}
