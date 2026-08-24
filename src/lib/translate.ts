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

// Hashtag/URL-heavy captions (e.g. "#aivideo #aitutorial ...") confuse
// MyMemory's crowd-sourced matching and are a common cause of it returning
// garbled or transliterated (e.g. Franco-Arabic "Roman Arabic") results
// instead of a real translation. Stripping them before translating and
// re-appending afterward keeps the translation quality high without
// losing the hashtags from the stored text.
function splitHashtagsAndUrls(text: string): { body: string; tail: string } {
  const match = text.match(/\s*((?:[#@]\S+|https?:\/\/\S+)(?:\s+(?:[#@]\S+|https?:\/\/\S+))*)\s*$/);
  if (!match) return { body: text, tail: "" };
  return { body: text.slice(0, match.index).trim(), tail: match[1] };
}

async function translateOne(text: string, lang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const { body, tail } = splitHashtagsAndUrls(trimmed);
  if (!body) return text;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        body.slice(0, 480)
      )}&langpair=en|${lang}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (typeof translated !== "string" || !translated.trim()) return text;
    return tail ? `${translated} ${tail}` : translated;
  } catch {
    return text; // never fail the caller's save over a translation hiccup
  }
}

/**
 * Translates a set of named fields into every supported language.
 * Returns e.g. { fr: { title: "...", description: "..." }, ar: { ... } }.
 */
// Each translateOne() call is bounded by its own 8s AbortSignal timeout, so
// running every language x field combination fully in parallel keeps the
// *total* wall-clock time for this function at ~8s worst case. Serializing
// or batching these (as a previous version of this file did) multiplies
// that worst case by the number of batches — easily pushing the whole save
// request past the hosting platform's request timeout, which kills the
// connection after the Firestore write already succeeded (the save "works"
// but the browser never sees a response). These are lightweight HTTP
// requests, not CPU/memory heavy like image processing, so full parallelism
// here is safe.
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
