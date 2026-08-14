"use client";

import { useEffect } from "react";

/**
 * Scroll-linked character reveal ("text scrub"): each heading's letters
 * are individually dimmed, then progressively turn full white as the
 * heading scrolls through the viewport — the fraction of letters lit up
 * tracks scroll position exactly, like Apple-style marketing pages.
 *
 * Performance: character spans are cached per element (queried once, not
 * every scroll frame) and the DOM is only touched when the revealed count
 * actually changes, so scrolling doesn't thrash layout/paint.
 */
export default function ScrollTextEffect() {
  useEffect(() => {
    const registered = new Map<
      HTMLElement,
      { chars: HTMLElement[]; lastCount: number }
    >();

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
      // Footer headings are excluded: the footer sits at the very bottom
      // of the page, so there's often no scroll room left for the scrub
      // to ever reach full progress — they'd get stuck half-dim forever.
      // Card titles (inside .pop-card, e.g. tutorial card h3s) are also
      // excluded: letter-by-letter scrubbing many repeated card titles at
      // once added a lot of extra DOM/work and wasn't the intent — only
      // the page's own section headings should scrub.
      const targets = document.querySelectorAll<HTMLElement>(
        "main h1, main h2, main h3"
      );
      targets.forEach((el) => {
        if (el.closest(".pop-card")) return;
        if (!el.dataset.scrollScrub) {
          el.dataset.scrollScrub = "true";
          splitIntoChars(el);
        }
        if (!registered.has(el)) {
          const chars = Array.from(el.querySelectorAll<HTMLElement>(".stc"));
          registered.set(el, { chars, lastCount: -1 });
        }
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const update = () => {
      const vh = window.innerHeight;
      const startY = vh * 0.85;
      const endY = vh * 0.3;

      for (const [el, entry] of registered) {
        const rect = el.getBoundingClientRect();
        const raw = (startY - rect.top) / (startY - endY);
        const progress = Math.min(1, Math.max(0, raw));
        const revealCount = Math.round(progress * entry.chars.length);

        if (revealCount === entry.lastCount) continue; // nothing changed, skip DOM writes

        const prev = entry.lastCount;
        if (revealCount > prev) {
          for (let i = Math.max(prev, 0); i < revealCount; i++) {
            entry.chars[i].classList.add("stc-lit");
          }
        } else {
          for (let i = revealCount; i < prev; i++) {
            entry.chars[i]?.classList.remove("stc-lit");
          }
        }
        entry.lastCount = revealCount;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
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
