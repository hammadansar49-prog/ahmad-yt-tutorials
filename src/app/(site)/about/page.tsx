import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content-store";
import AboutSection from "@/components/AboutSection";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "About - Ahmad YT Tutorial",
  description:
    "Learn about Ahmad YT Tutorial - how we share the AI prompt behind every YouTube video on this website.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <main className="flex-1">
      <PageViewTracker trackKey="about" />
      <AboutSection content={content} />
    </main>
  );
}
