"use client";

import { useEffect } from "react";

/**
 * Fades the site's headings from a dim, low-contrast tone up to full white
 * as they scroll into view, and back down when they leave — re-runs its
 * DOM scan on every route change since this lives above the page content.
 */
export default function ScrollTextEffect() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("scroll-reveal-in", entry.isIntersecting);
        }
      },
      { threshold: 0.35 }
    );

    const scan = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        "main h1, main h2, main h3"
      );
      targets.forEach((el) => {
        if (!el.classList.contains("scroll-reveal")) {
          el.classList.add("scroll-reveal");
          observer.observe(el);
        }
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
