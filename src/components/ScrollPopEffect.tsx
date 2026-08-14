"use client";

import { useEffect } from "react";

/**
 * Pops card-like blocks (anything with a "pop-card" class) into view with
 * a fade + scale + slide-up as they scroll into the viewport. Siblings
 * that appear together (e.g. a grid row) are staggered slightly for a
 * nicer cascading effect. Runs once per element (doesn't reverse on
 * scroll-out) — cheap and avoids re-triggering as the user scrolls back
 * and forth.
 */
export default function ScrollPopEffect() {
  useEffect(() => {
    const groups = new Map<Element | null, HTMLElement[]>();

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
        if (el.dataset.popRegistered) return;
        el.dataset.popRegistered = "true";
        const key = el.parentElement;
        const list = groups.get(key) ?? [];
        list.push(el);
        groups.set(key, list);
        observer.observe(el);
      });
    };

    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
