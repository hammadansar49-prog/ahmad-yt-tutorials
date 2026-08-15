"use client";

import { useState } from "react";

type Faq = { question: string; answer: string };

export default function FaqInput({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: Faq[];
}) {
  const [faqs, setFaqs] = useState<Faq[]>(defaultValue);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function addFaq() {
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) return;
    setFaqs((prev) => [...prev, { question: q, answer: a }]);
    setQuestion("");
    setAnswer("");
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{faq.question}</p>
            <p className="text-sm text-white/60 mt-0.5">{faq.answer}</p>
          </div>
          <button
            type="button"
            onClick={() => removeFaq(i)}
            className="text-white/50 hover:text-white transition leading-none shrink-0"
            aria-label={`Remove FAQ ${i + 1}`}
          >
            ×
          </button>
        </div>
      ))}

      <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question (e.g. Why is this prompt useful?)"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={2}
          placeholder="Answer"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition resize-none"
        />
        <button
          type="button"
          onClick={addFaq}
          className="rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-sm font-medium px-4 py-1.5"
        >
          + Add FAQ
        </button>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(faqs)} />
    </div>
  );
}
