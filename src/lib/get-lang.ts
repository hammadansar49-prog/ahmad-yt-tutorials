import { cookies } from "next/headers";

/** Server-side read of the visitor's translation language (see proxy.ts / layout.tsx). */
export async function getLang(): Promise<string | null> {
  const cookieStore = await cookies();
  const cached = cookieStore.get("site_lang")?.value;
  return cached && cached !== "en" ? cached : null;
}

export function pickTranslation(
  original: string,
  translations: Record<string, Record<string, string>> | undefined,
  field: string,
  lang: string | null
): string {
  return (lang && translations?.[lang]?.[field]) || original;
}
