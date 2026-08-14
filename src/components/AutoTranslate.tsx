"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => unknown;
      };
    };
  }
}

const CHOICE_COOKIE = "auto_translate_lang";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

function applyGoogleTranslateLanguage(lang: string) {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) return false;
  combo.value = lang;
  combo.dispatchEvent(new Event("change"));
  return true;
}

/**
 * Detects the visitor's country server-side and, for anyone outside
 * Pakistan/India, auto-translates the site into their language using
 * Google's free Website Translator widget — loaded invisibly (no banner,
 * no manual language picker) and driven programmatically.
 */
export default function AutoTranslate() {
  useEffect(() => {
    const manualChoice = getCookie(CHOICE_COOKIE);
    // A visitor who has explicitly picked a language (or explicitly
    // opted out, stored as "en") in this session keeps that choice
    // instead of being re-geo-detected on every page load.
    const applyAndRemember = (lang: string | null) => {
      if (!lang || lang === "en") return;
      loadWidgetThenApply(lang);
    };

    if (manualChoice) {
      applyAndRemember(manualChoice === "en" ? null : manualChoice);
      return;
    }

    fetch("/api/geo")
      .then((r) => r.json())
      .then((data: { lang: string | null }) => {
        if (data.lang) {
          setCookie(CHOICE_COOKIE, data.lang);
          applyAndRemember(data.lang);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true" />
  );
}

function loadWidgetThenApply(lang: string) {
  const tryApply = () => {
    if (!applyGoogleTranslateLanguage(lang)) {
      setTimeout(tryApply, 300);
    }
  };

  if (window.google?.translate) {
    tryApply();
    return;
  }

  window.googleTranslateElementInit = () => {
    new window.google!.translate.TranslateElement(
      { pageLanguage: "en", autoDisplay: false },
      "google_translate_element"
    );
    tryApply();
  };

  if (!document.querySelector('script[src*="translate.google.com"]')) {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }
}
