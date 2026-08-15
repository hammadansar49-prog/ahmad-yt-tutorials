"use client";

import { useLang } from "./LanguageProvider";

/**
 * Renders `original`, or the pre-translated version for the visitor's
 * detected language if one was stored (see src/lib/translate.ts). Only
 * ever used on non-heading text (paragraphs, descriptions) — headings are
 * deliberately left untranslated because they're also targeted by the
 * scroll-scrub letter-reveal effect, which splits their text into many
 * <span> children; if this component's output changed language *after*
 * that split already happened, React would be reconciling against DOM it
 * no longer recognizes (the same class of bug that made the old Google
 * Translate widget crash the site).
 */
export default function TranslatedText({
  as: Tag = "span",
  original,
  translations,
  field,
  className,
}: {
  as?: "p" | "span" | "div";
  original: string;
  translations?: Record<string, Record<string, string>>;
  field: string;
  className?: string;
}) {
  const lang = useLang();
  const text = (lang && translations?.[lang]?.[field]) || original;
  return <Tag className={className}>{text}</Tag>;
}
