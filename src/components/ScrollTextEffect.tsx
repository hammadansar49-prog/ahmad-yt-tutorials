"use client";

import { useEffect } from "react";

/**
 * Scroll-linked character reveal ("text scrub"): each heading's letters
 * are individually dimmed, then progressively turn full white as the
 * heading scrolls through the viewport — the fraction of letters lit up
 * tracks scroll position exactly, like Apple-style marketing pages.
 */
export default function ScrollTextEffect() {
  useEffect(() => {
    const registered: HTMLElement[] = [];

    function splitIntoChars(el: HTMLElement) {
      const words = el.textContent?.split(/(\s+)/) ?? [];
      el.textContent = "";
      for (const word of words) {
        if (/^\s+$/.test(word)) {
          el.appendChild(document.createTextNode(word));
          continue;
        }
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        for (const ch of word) {
          const charSpan = document.createElement("span");
          charSpan.className = "stc";
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
        }
        el.appendChild(wordSpan);
      }
    }

    const scan = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        "main h1, main h2, main h3, footer h3"
      );
      targets.forEach((el) => {
        if (el.dataset.scrollScrub) return;
        el.dataset.scrollScrub = "true";
        splitIntoChars(el);
        registered.push(el);
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const el of registered) {
        const rect = el.getBoundingClientRect();
        // Reveal starts once the heading is 85% down the viewport (just
        // entering) and finishes once it's 30% down (comfortably in view).
        const startY = vh * 0.85;
        const endY = vh * 0.3;
        const raw = (startY - rect.top) / (startY - endY);
        const progress = Math.min(1, Math.max(0, raw));

        const chars = el.querySelectorAll<HTMLElement>(".stc");
        const revealCount = Math.round(progress * chars.length);
        chars.forEach((c, i) => {
          c.classList.toggle("stc-lit", i < revealCount);
        });
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
