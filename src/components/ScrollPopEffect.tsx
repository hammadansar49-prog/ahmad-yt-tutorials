"use client";

import { useEffect } from "react";

type Entry = {
  el: HTMLElement;
  isDeck: boolean;
  deckX: number;
  deckY: number;
  deckRot: number;
  target: number;
  current: number;
  hoverTarget: number;
  hoverCurrent: number;
};

/**
 * Scroll-scrubbed card reveal: every "pop-card" continuously tracks scroll
 * position (like the heading text-scrub effect) instead of firing once
 * when it enters view — opacity/position/rotation are a direct function
 * of how far the card has scrolled through the viewport, so the motion
 * is tied to the scroll gesture rather than a canned one-shot animation.
 *
 * The displayed value chases the scroll-computed target with a lerp on
 * every animation frame (same trick as the cursor ring) instead of
 * snapping straight to it, which is what makes the motion read as
 * buttery-smooth "effort" rather than a stepped, mechanical follow.
 *
 * "pop-deck" cards additionally start fanned out like a stacked hand of
 * cards (via data-deck-x/y/rot) and splay into their grid position as
 * they scrub in, and lift outward on hover — since this script owns the
 * element's whole inline "transform" (overwritten every scroll frame), a
 * plain CSS :hover transform would just get clobbered, so the hover lift
 * is folded into the same per-frame calculation instead.
 */
export default function ScrollPopEffect() {
  useEffect(() => {
    const registered = new Map<HTMLElement, Entry>();

    const scan = () => {
      document.querySelectorAll<HTMLElement>(".pop-card").forEach((el) => {
        if (registered.has(el)) return;
        const entry: Entry = {
          el,
          isDeck: el.classList.contains("pop-deck"),
          deckX: Number(el.dataset.deckX ?? 0),
          deckY: Number(el.dataset.deckY ?? 30),
          deckRot: Number(el.dataset.deckRot ?? 0),
          target: 0,
          current: 0,
          hoverTarget: 0,
          hoverCurrent: 0,
        };
        registered.set(el, entry);

        if (entry.isDeck) {
          el.addEventListener("mouseenter", () => {
            entry.hoverTarget = 1;
            kick();
          });
          el.addEventListener("mouseleave", () => {
            entry.hoverTarget = 0;
            kick();
          });
        }
      });
    };

    scan();
    // Newly-inserted cards (e.g. a category filter swapping which
    // tutorial cards are in the DOM) default to target/current = 0
    // (invisible) until their real scroll position is computed — call
    // kick() after every scan so they get their correct state right
    // away instead of sitting hidden until the next scroll/resize event.
    const mutationObserver = new MutationObserver(() => {
      scan();
      kick();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const computeTargets = () => {
      const vh = window.innerHeight;
      const startY = vh * 0.98; // just entering at the bottom
      const endY = vh * 0.72; // settled soon after — a short scroll distance
      for (const entry of registered.values()) {
        const rect = entry.el.getBoundingClientRect();
        const raw = (startY - rect.top) / (startY - endY);
        entry.target = Math.min(1, Math.max(0, raw));
      }
    };

    let raf = 0;
    const LERP = 0.22;
    const HOVER_LERP = 0.25;
    const render = () => {
      let anyMoving = false;
      for (const entry of registered.values()) {
        const diff = entry.target - entry.current;
        if (Math.abs(diff) < 0.0008) {
          if (entry.current !== entry.target) entry.current = entry.target;
        } else {
          entry.current += diff * LERP;
          anyMoving = true;
        }

        const hoverDiff = entry.hoverTarget - entry.hoverCurrent;
        if (Math.abs(hoverDiff) < 0.0008) {
          if (entry.hoverCurrent !== entry.hoverTarget) entry.hoverCurrent = entry.hoverTarget;
        } else {
          entry.hoverCurrent += hoverDiff * HOVER_LERP;
          anyMoving = true;
        }

        // Back-out easing: overshoots slightly past 1 then settles, so
        // the card/button gives a small playful "jump" as it lands
        // instead of a flat, purely-decelerating glide in.
        const t = entry.current;
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const eased = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        const remaining = 1 - t; // position/rotation still settle smoothly (no overshoot)
        const hoverLift = entry.hoverCurrent * -10; // pops outward/up on hover

        entry.el.style.opacity = String(eased);
        if (entry.isDeck) {
          const x = remaining * entry.deckX;
          const y = remaining * entry.deckY + hoverLift;
          const rot = remaining * entry.deckRot;
          const scale = 0.9 + 0.1 * eased + entry.hoverCurrent * 0.03;
          entry.el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
        } else {
          const y = remaining * 32;
          const scale = 0.92 + 0.08 * eased;
          entry.el.style.transform = `translateY(${y}px) scale(${scale})`;
        }
      }
      // Keep the render loop alive as long as anything is still chasing
      // its target so the lerp can settle smoothly.
      if (anyMoving) raf = requestAnimationFrame(render);
      else raf = 0;
    };

    const kick = () => {
      computeTargets();
      if (!raf) raf = requestAnimationFrame(render);
    };

    // computeTargets() is cheap (just getBoundingClientRect reads), so it
    // can run straight off the scroll event; the render loop then keeps
    // re-scheduling itself every frame on its own (see "anyMoving" above)
    // until the lerp has fully settled, well past the last scroll event.
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
