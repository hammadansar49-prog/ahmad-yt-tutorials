import type { SiteContent } from "@/lib/site-content-store";
import Image from "next/image";
import TranslatedText from "./TranslatedText";

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

export default function AboutSection({
  content,
  showHeading = true,
  headingLevel = "h1",
}: {
  content: SiteContent;
  showHeading?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  return (
    <>
      {showHeading && (
        <section className="border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12 flex flex-wrap items-center gap-12">
            <div className="fade-up flex-[999_1_520px] min-w-0">
            <span className="block text-xs font-semibold tracking-[0.12em] text-muted uppercase mb-5">
              About Us
            </span>
            <TranslatedText
              as={headingLevel}
              className="font-serif font-normal text-5xl sm:text-7xl leading-[1] tracking-tight mb-6"
              original={content.aboutHeading}
              translations={content.translations}
              field="aboutHeading"
            />
            <TranslatedText
              as="p"
              className="text-muted max-w-2xl text-lg leading-relaxed"
              original={content.aboutDescription}
              translations={content.translations}
              field="aboutDescription"
            />
            </div>
            <div className="fade-up delay-2 flex-[1_1_260px] max-w-[340px] mx-auto">
              <Image
                src="/icon.png"
                alt="Ahmad YT Tutorial logo"
                width={340}
                height={340}
                className="w-full h-auto rounded-full shadow-[0_40px_80px_-30px_rgba(11,11,15,0.45)] float-y"
              />
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Process</p>
        <h2 className="font-serif font-normal text-5xl sm:text-6xl leading-none tracking-tight mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              data-deck-x={(i - (steps.length - 1) / 2) * -34}
              data-deck-y={70}
              data-deck-rot={(i - (steps.length - 1) / 2) * -10}
              className={`pop-card pop-deck pop-hover rounded-xl sm:rounded-2xl border border-line bg-white p-4 sm:p-8 hover:border-brand/40 hover:bg-soft transition-colors ${
                i === steps.length - 1 && steps.length % 2 !== 0
                  ? "col-span-2 sm:col-span-1"
                  : ""
              }`}
            >
              <span className="font-serif text-4xl sm:text-5xl text-brand">
                {step.number}
              </span>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight mt-6 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="pop-card rounded-2xl bg-ink text-white p-8 sm:p-14 flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-2xl">
          <h2 data-no-scrub className="font-serif font-normal text-4xl sm:text-6xl leading-[1.02] mb-3">
            Never miss a <em>new tutorial.</em>
          </h2>
          <p className="text-white/70">
            Subscribe to the YouTube channel and be the first to get every
            new video&apos;s AI prompt.
          </p>
          </div>
          <a
            href={`${content.youtubeUrl}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="scroll-wiggle inline-flex items-center gap-2 rounded-lg bg-white text-ink font-medium px-7 py-4 hover:bg-brand hover:text-white"
          >
            Subscribe on YouTube
          </a>
        </div>
      </section>
    </>
  );
}
