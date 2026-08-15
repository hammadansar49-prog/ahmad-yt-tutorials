"use client";

import { useState } from "react";
import Image from "next/image";

export default function FaqSection({
  faqs,
  sidePictures,
}: {
  faqs: { question: string; answer: string }[];
  sidePictures?: string[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const hasFaqs = faqs && faqs.length > 0;
  const hasPictures = sidePictures && sidePictures.length > 0;

  if (!hasFaqs && !hasPictures) return null;

  return (
    <div className="mt-10">
      {hasFaqs && (
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3">
          Frequently Asked Questions
        </h2>
      )}
      <div
        className={
          hasFaqs && hasPictures
            ? "grid sm:grid-cols-2 gap-6 items-start"
            : ""
        }
      >
        {hasFaqs && (
          <div className="rounded-lg border border-white/10 divide-y divide-white/10 overflow-hidden">
            {faqs.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div key={i} className="bg-white/5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-medium text-white">
                      {faq.question}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`h-4 w-4 shrink-0 text-white/50 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 text-sm text-white/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {hasPictures && (
          <div className={`grid grid-cols-2 gap-3 ${hasFaqs ? "" : "mt-3"}`}>
            {sidePictures!.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square rounded-lg overflow-hidden border border-white/10"
              >
                <Image
                  src={src}
                  alt={`Result example ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
