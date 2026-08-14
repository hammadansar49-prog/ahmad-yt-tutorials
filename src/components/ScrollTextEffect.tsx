"use client";

import { useEffect } from "react";

/**
 * Scroll-linked character reveal ("text scrub"): each heading's letters
 * are individually dimmed, then progressively turn full white as the
 * heading scrolls through the viewport.
 *
 * The revealed-letter count is driven by a lerped progress value (chases
 * the raw scroll-computed target a little each frame, same technique as
 * the card reveal) rather than jumping straight to it — a single mouse
 * wheel tick moves the page by a chunk of pixels, which would otherwise
 * light up several letters at once in one instant frame. Lerping spreads
 * that same jump across a few frames so letters light up in a flowing
 * sequence instead of clumping together.
 *
 * Performance: character spans are cached per element (queried once, not
 * every scroll frame) and the DOM is only touched when the revealed count
 * actually changes.
 */
export default function ScrollTextEffect() {
  useEffect(() => {
    const registered = new Map<
      HTMLElement,
      { chars: HTMLElement[]; lastCount: number; target: number; current: number }
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
          registered.set(el, { chars, lastCount: -1, target: 0, current: 0 });
        }
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const computeTargets = () => {
      const vh = window.innerHeight;
      const startY = vh * 0.85;
      const endY = vh * 0.3;
      for (const [el, entry] of registered) {
        const rect = el.getBoundingClientRect();
        const raw = (startY - rect.top) / (startY - endY);
        entry.target = Math.min(1, Math.max(0, raw));
      }
    };

    let raf = 0;
    const LERP = 0.11;
    const render = () => {
      let anyMoving = false;
      for (const entry of registered.values()) {
        const diff = entry.target - entry.current;
        if (Math.abs(diff) < 0.0006) {
          entry.current = entry.target;
        } else {
          entry.current += diff * LERP;
          anyMoving = true;
        }

        // Continuous position within the letters, not just a whole
        // count — the letter right at the boundary gets a fractional
        // glow (its own in-between color) instead of snapping straight
        // from dim to lit, so the "wave" reads as one continuous flow
        // across the word rather than discrete steps.
        const pos = entry.current * entry.chars.length;
        const revealCount = Math.floor(pos);
        const frac = pos - revealCount;

        if (revealCount !== entry.lastCount) {
          const prev = entry.lastCount;
          if (revealCount > prev) {
            for (let i = Math.max(prev, 0); i < revealCount; i++) {
              entry.chars[i].classList.add("stc-lit");
              entry.chars[i].style.color = "";
            }
          } else {
            for (let i = revealCount; i < prev; i++) {
              entry.chars[i]?.classList.remove("stc-lit");
            }
          }
          // Clear whatever previously held the fractional boundary glow.
          if (prev >= 0 && prev < entry.chars.length && prev !== revealCount) {
            entry.chars[prev].style.color = "";
          }
          entry.lastCount = revealCount;
        }

        const boundaryChar = entry.chars[revealCount];
        if (boundaryChar) {
          boundaryChar.style.color =
            frac > 0 ? `rgba(255,255,255,${0.22 + 0.78 * frac})` : "";
        }
      }
      if (anyMoving) raf = requestAnimationFrame(render);
      else raf = 0;
    };

    const kick = () => {
      computeTargets();
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
