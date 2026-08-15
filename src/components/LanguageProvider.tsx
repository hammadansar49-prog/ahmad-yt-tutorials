"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext<string | null>(null);

export function useLang(): string | null {
  return useContext(LanguageContext);
}

const COOKIE = "site_lang";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Resolves the visitor's language once (geo-detected server-side via
 * /api/geo, cached in a cookie) and makes it available through context.
 * This never touches the DOM directly — it only ever drives normal React
 * state/props, so translated text renders exactly like any other React
 * content and stays fully compatible with re-renders (unlike the earlier
 * Google Translate widget, which mutated the DOM outside React's control
 * and crashed whenever a live Firestore update tried to re-render the
 * same subtree).
 */
export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<string | null>(null);

  useEffect(() => {
    const cached = readCookie(COOKIE);
    if (cached) {
      setLang(cached === "en" ? null : cached);
      return;
    }

    fetch("/api/geo")
      .then((r) => r.json())
      .then((data: { lang: string | null }) => {
        document.cookie = `${COOKIE}=${data.lang ?? "en"}; path=/; max-age=${60 * 60 * 24 * 30}`;
        setLang(data.lang);
      })
      .catch(() => {});
  }, []);

  return (
    <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>
  );
}
