"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "site_lang";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${
    60 * 60 * 24 * 30
  }`;
}

function languageName(code: string): string {
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Asks the visitor's explicit permission before translating the site,
 * instead of silently switching language based on geo-IP. Shown once —
 * the answer (their chosen language, or "en" to stay in English) is
 * remembered in the `site_lang` cookie that the server reads in
 * src/app/layout.tsx, so this popup never appears again after they answer.
 */
export default function TranslatePrompt() {
  const [suggestedLang, setSuggestedLang] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return;

    fetch("/api/geo")
      .then((r) => r.json())
      .then((data: { lang: string | null }) => {
        if (data.lang) {
          setSuggestedLang(data.lang);
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  function acceptTranslation() {
    if (!suggestedLang) return;
    setCookie(COOKIE_NAME, suggestedLang);
    setVisible(false);
    window.location.reload();
  }

  function declineTranslation() {
    setCookie(COOKIE_NAME, "en");
    setVisible(false);
  }

  if (!visible || !suggestedLang) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-4 sm:justify-end sm:pr-6">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0a1030] shadow-2xl shadow-black/50 p-4">
        <p className="text-sm text-white">
          This website is available in{" "}
          <span className="font-semibold">{languageName(suggestedLang)}</span>
          . Translate now?
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={acceptTranslation}
            className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] hover:brightness-110 active:scale-95 transition"
          >
            Translate to {languageName(suggestedLang)}
          </button>
          <button
            onClick={declineTranslation}
            className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 border border-white/10 hover:bg-white/10 hover:text-white active:scale-95 transition"
          >
            Keep English
          </button>
        </div>
      </div>
    </div>
  );
}
