"use client";

import { useLang } from "./LanguageProvider";

/**
 * Renders `original`, or the pre-translated version for the visitor's
 * detected language if one was stored (see src/lib/translate.ts).
 *
 * Safe to use on headings too (unlike an earlier version of this
 * component) because the language is now resolved server-side, before
 * any HTML is sent — see LanguageProvider — so there's never a
 * client-side language swap after mount for the scroll-scrub letter-
 * reveal effect's DOM-splitting to conflict with.
 */
export default function TranslatedText({
  as: Tag = "span",
  original,
  translations,
  field,
  className,
}: {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3";
  original: string;
  translations?: Record<string, Record<string, string>>;
  field: string;
  className?: string;
}) {
  const lang = useLang();
  const text = (lang && translations?.[lang]?.[field]) || original;
  return <Tag className={className}>{text}</Tag>;
}
