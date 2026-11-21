export const SITE_URL = "https://ahmadyttutorial.com";
export const SITE_NAME = "Ahmad YT Tutorial";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@ahmadyttutorial";
export const SAME_AS = [
  YOUTUBE_CHANNEL_URL,
  "https://instagram.com/ahmadyttutorial",
  "https://t.me/ahmadyttutorial",
  "https://facebook.com/ahmadyttutorial",
];

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Trim to Google's ~155 char snippet length on a word boundary. */
export function metaDescription(text: string, max = 155): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length) + "…";
}

/** Add the brand suffix only when the title stays under ~60 chars. */
export function pageTitle(title: string): string {
  const clean = title.replace(/\s+/g, " ").trim();
  const withBrand = `${clean} - ${SITE_NAME}`;
  return withBrand.length <= 60 ? withBrand : clean;
}

export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
