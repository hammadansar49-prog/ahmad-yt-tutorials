// Free machine translation (MyMemory API, no key required) used ONLY at
// admin-save time, never at page-render time. Translated text is stored
// directly on the Firestore document (a `translations` map keyed by
// language, then by field name) so that displaying it later is a pure
// data lookup — no live DOM mutation, no per-visitor API calls, and fully
// compatible with the site's real-time Firestore listeners (translated
// text arrives through the same snapshot as everything else).
const TARGET_LANGUAGES = [
  "ar", "fr", "es", "pt", "de", "it", "ru", "tr", "zh-CN", "ja", "ko", "id",
];

async function translateOne(text: string, lang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        trimmed.slice(0, 480)
      )}&langpair=en|${lang}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    return typeof translated === "string" && translated.trim() ? translated : text;
  } catch {
    return text; // never fail the caller's save over a translation hiccup
  }
}

/**
 * Translates a set of named fields into every supported language.
 * Returns e.g. { fr: { title: "...", description: "..." }, ar: { ... } }.
 */
export async function translateFields(
  fields: Record<string, string>
): Promise<Record<string, Record<string, string>>> {
  const entries = Object.entries(fields).filter(([, v]) => v && v.trim());
  if (entries.length === 0) return {};

  const result: Record<string, Record<string, string>> = {};
  await Promise.all(
    TARGET_LANGUAGES.map(async (lang) => {
      const translatedFields: Record<string, string> = {};
      await Promise.all(
        entries.map(async ([key, value]) => {
          translatedFields[key] = await translateOne(value, lang);
        })
      );
      result[lang] = translatedFields;
    })
  );
  return result;
}
