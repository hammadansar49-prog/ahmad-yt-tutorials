"use client";

import { createContext, useContext } from "react";

const LanguageContext = createContext<string | null>(null);

export function useLang(): string | null {
  return useContext(LanguageContext);
}

/**
 * Makes the visitor's language (resolved server-side in the root layout —
 * see resolveLang() in src/app/layout.tsx — from a proxy-set cookie that's
 * itself backed by a geo IP lookup) available through context.
 *
 * Resolving this server-side, before any HTML is sent, is what makes it
 * safe to translate headings too: the server-rendered HTML already has
 * the right language baked in, so there's never a client-side swap from
 * English to translated after mount — which is what would otherwise let
 * the scroll-scrub letter-reveal effect (which splits headings into many
 * <span> children right after mount) end up fighting a later React
 * re-render of that same text, the exact class of bug that crashed
 * production when translation was done via live DOM mutation instead.
 */
export default function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: string | null;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={initialLang}>
      {children}
    </LanguageContext.Provider>
  );
}
