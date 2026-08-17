"use client";

import { useEffect, useRef, useState } from "react";

const TILTS = [-4, 2, -2, 3, -3];
// Smooth, no-bounce "water flow" easing — glides to a stop instead of
// overshooting and springing back.
const FLOW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * A horizontal deck of overlapping cards (like a fanned hand of tickets).
 *
 * Two motions layer on top of each other, and both are local to this
 * component only — they don't touch the site-wide scroll-reveal effect
 * used elsewhere on the page:
 *  - Entrance: each card has its OWN scroll-position trigger point,
 *    spread out across a full viewport height of scroll distance, so as
 *    the user scrolls the deck into view the 4 cards visibly pop in one
 *    after another instead of all at once.
 *  - Hover: hovering a card pulls it fully upright (rotation reset to 0)
 *    and lifts it above the rest of the stack so it reads clearly.
 *
 * The exact same fanned/tilted/overlapping design renders at every screen
 * size — only the card width and overlap amount scale down on narrow
 * screens (via responsive Tailwind classes) so the deck still fits and
 * scrolls smoothly instead of needing a different mobile layout.
 */
export default function CardFanDeck({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    items.map(() => false)
  );
  const deckRef = useRef<HTMLDivElement>(null);

  // The lifted/scaled hover state can push a card's top edge off-screen
  // (behind the sticky navbar) if the deck sits near the top of the
  // viewport when the user hovers. Nudge the page down just enough to
  // keep the whole card visible instead of letting it get clipped.
  function handleHover(e: React.MouseEvent<HTMLDivElement>, i: number) {
    setHovered(i);
    const rect = e.currentTarget.getBoundingClientRect();
    const navbarHeight = 64;
    const liftClearance = 110; // translateY(-52px) + scale growth + margin
    const minTop = navbarHeight + liftClearance;
    if (rect.top < minTop) {
      window.scrollBy({ top: rect.top - minTop, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;

    let raf = 0;
    const computeAndSet = () => {
      raf = 0;
      const vh = window.innerHeight;
      // A full viewport height of scroll distance for the whole deck to
      // reveal in — spread wide on purpose so each card's own trigger
      // point falls at a clearly different scroll position, instead of
      // all 4 crossing their thresholds within the same wheel tick.
      const startY = vh * 1.05;
      const endY = vh * 0.05;
      const rect = el.getBoundingClientRect();
      const raw = (startY - rect.top) / (startY - endY);
      const progress = Math.min(1, Math.max(0, raw));

      setRevealed((prev) => {
        let changed = false;
        const next = prev.map((was, i) => {
          const threshold = i / items.length;
          const now = progress >= threshold;
          if (now !== was) changed = true;
          return now;
        });
        return changed ? next : prev;
      });
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(computeAndSet);
    };

    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  return (
    <div
      ref={deckRef}
      className="flex justify-start sm:justify-center py-8 overflow-x-auto sm:overflow-visible px-4 sm:px-0 -mx-4 sm:mx-0"
    >
      {items.map((item, i) => {
        const isHovered = hovered === i;
        const isRevealed = revealed[i];
        const tilt = TILTS[i % TILTS.length];

        let transform: string;
        if (isHovered) {
          transform = "translateY(-52px) rotate(0deg) scale(1.12)";
        } else if (isRevealed) {
          transform = `translateY(0) rotate(${tilt}deg) scale(1)`;
        } else {
          transform = "translateY(56px) rotate(0deg) scale(0.94)";
        }

        return (
          <div
            key={item.title}
            onMouseEnter={(e) => handleHover(e, i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              transform,
              opacity: isRevealed || isHovered ? 1 : 0,
              zIndex: isHovered ? 50 : i,
              transition: `transform 550ms ${FLOW_EASE}, opacity 500ms ${FLOW_EASE}, box-shadow 550ms ${FLOW_EASE}, border-color 550ms ${FLOW_EASE}`,
            }}
            className={`relative w-36 sm:w-56 lg:w-64 shrink-0 rounded-2xl border bg-[#0d1330] p-3.5 sm:p-5 lg:p-6 shadow-[0_22px_35px_-12px_rgba(0,0,0,0.65)] ${
              i === 0 ? "" : "-ml-7 sm:-ml-14"
            } ${
              isHovered
                ? "border-[#ff6a3d]/60 shadow-2xl shadow-black/70"
                : "border-white/10"
            }`}
          >
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-2">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {item.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
