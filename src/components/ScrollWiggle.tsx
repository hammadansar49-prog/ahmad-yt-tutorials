"use client";

import { useEffect } from "react";

/**
 * Elements with the "scroll-wiggle" class react to scroll velocity with a
 * small spring-like tilt/sway — the faster the page is scrolling, the more
 * they lean, and they settle back to upright once scrolling slows/stops.
 * A lightweight damped-spring simulation (position + velocity), not just
 * a lerp, so it has a bit of natural overshoot instead of a flat ease.
 */
export default function ScrollWiggle() {
  useEffect(() => {
    const elements = new Set<HTMLElement>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>(".scroll-wiggle").forEach((el) => {
        elements.add(el);
      });
    };
    scan();
    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let lastScrollY = window.scrollY;
    let angle = 0; // current tilt, degrees
    let angleVel = 0; // spring velocity
    let scrollVel = 0; // smoothed scroll speed (px/frame)

    const STIFFNESS = 0.09;
    const DAMPING = 0.78;
    const MAX_TILT = 6; // degrees

    let raf = 0;
    const render = () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Smooth the raw per-frame scroll delta so fast wheel ticks don't
      // spike it instantly.
      scrollVel += (dy - scrollVel) * 0.3;

      const target = Math.max(-MAX_TILT, Math.min(MAX_TILT, scrollVel * 1.4));
      const force = (target - angle) * STIFFNESS;
      angleVel = (angleVel + force) * DAMPING;
      angle += angleVel;

      for (const el of elements) {
        el.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      const settled = Math.abs(angle) < 0.02 && Math.abs(angleVel) < 0.02 && Math.abs(scrollVel) < 0.05;
      if (!settled) {
        raf = requestAnimationFrame(render);
      } else {
        for (const el of elements) el.style.transform = "";
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", kick, { passive: true });

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
