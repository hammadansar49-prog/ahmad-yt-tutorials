"use client";

import { useEffect } from "react";

/**
 * Pops card-like blocks (anything with a "pop-card" class) into view with
 * a fade + scale + slide-up as they scroll into the viewport. Siblings
 * that appear together (e.g. a grid row) are staggered slightly for a
 * nicer cascading effect. Runs once per element (doesn't reverse on
 * scroll-out) — cheap and avoids re-triggering as the user scrolls back
 * and forth.
 *
 * Elements are (re-)registered with the observer on every scan, keyed by
 * a WeakSet rather than a DOM dataset flag — React StrictMode's dev-mode
 * mount -> cleanup -> remount would otherwise leave the *live* effect
 * instance's observer watching nothing (since a dataset flag set by the
 * first, since-cleaned-up instance would make the second instance skip
 * registration entirely, permanently freezing every card at opacity: 0).
 */
export default function ScrollPopEffect() {
  useEffect(() => {
    const groups = new Map<Element | null, HTMLElement[]>();
    const observedByThisInstance = new WeakSet<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const siblings = groups.get(el.parentElement) ?? [el];
          const index = siblings.indexOf(el);
          el.style.transitionDelay = `${Math.max(0, index) * 70}ms`;
          el.classList.add("pop-in");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(".pop-card").forEach((el) => {
        const key = el.parentElement;
        const list = groups.get(key) ?? [];
        if (!list.includes(el)) {
          list.push(el);
          groups.set(key, list);
        }
        if (!observedByThisInstance.has(el) && !el.classList.contains("pop-in")) {
          observedByThisInstance.add(el);
          observer.observe(el);
        }
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Safety net: if the observer never fires for some reason (older
    // browser quirk, etc.), don't leave content permanently invisible —
    // periodically reveal anything that's already on/near screen but
    // still hidden. Cards well below the fold are left for the real
    // observer so the scroll-triggered feel is preserved for them.
    const fallback = setInterval(() => {
      document.querySelectorAll<HTMLElement>(".pop-card:not(.pop-in)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
          el.classList.add("pop-in");
        }
      });
    }, 1500);

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      clearInterval(fallback);
    };
  }, []);

  return null;
}
