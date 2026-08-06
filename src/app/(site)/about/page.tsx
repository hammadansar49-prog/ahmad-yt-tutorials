import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content-store";

export const metadata: Metadata = {
  title: "About - Ahmad YT Tutorial",
  description:
    "Learn about Ahmad YT Tutorial - how we share the AI prompt behind every YouTube video on this website.",
};

const steps = [
  {
    number: "01",
    title: "Video Gets Uploaded",
    text: "We first upload the tutorial video to our YouTube channel.",
  },
  {
    number: "02",
    title: "Prompt Goes Up On The Site",
    text: "The video's thumbnail and its full AI prompt are added to this website.",
  },
  {
    number: "03",
    title: "You Copy It",
    text: "Hit the Copy Code button and the entire prompt is copied instantly, ready to use.",
  },
];

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1440] via-[#06102b] to-[#2a0a3d]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#ff8a1c] uppercase mb-4">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5">
            {content.aboutHeading}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {content.aboutDescription}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-white/10 bg-[#0d1330]/80 p-6 hover:border-[#ff6a3d]/50 transition"
            >
              <span className="text-4xl font-extrabold bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] bg-clip-text text-transparent">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-white mt-3 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0d1330] to-[#1a0f3d] p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Never Miss A New Tutorial
          </h2>
          <p className="text-white/60 mb-6 max-w-xl mx-auto">
            Subscribe to the YouTube channel and be the first to get every
            new video&apos;s AI prompt.
          </p>
          <a
            href={content.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold px-6 py-3 hover:brightness-110 transition"
          >
            Subscribe on YouTube
          </a>
        </div>
      </section>
    </main>
  );
}
