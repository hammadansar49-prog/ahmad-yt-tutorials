/** Auto-translation was removed — the site now always renders its original content. */
export async function getLang(): Promise<string | null> {
  return null;
}

export function pickTranslation(
  original: string,
  translations: Record<string, Record<string, string>> | undefined,
  field: string,
  lang: string | null
): string {
  return (lang && translations?.[lang]?.[field]) || original;
}
