"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // Starts false (nothing rendered) so mobile/touch visitors never see a
  // stray circle sitting at the top-left corner before this check runs —
  // it only flips to true once we've confirmed an actual desktop/laptop
  // with a fine pointer.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Restrict to actual desktop/laptop devices: a fine pointer alone
    // isn't enough — some phones/tablets (and mobile browser emulation)
    // still report "fine", so also require a desktop-sized viewport.
    if (
      window.matchMedia("(pointer: fine)").matches &&
      window.innerWidth >= 768
    ) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const show = () => {
      dotRef.current?.classList.remove("cursor-hidden");
      ringRef.current?.classList.remove("cursor-hidden");
    };
    const hide = () => {
      dotRef.current?.classList.add("cursor-hidden");
      ringRef.current?.classList.add("cursor-hidden");
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onDown = () => ringRef.current?.classList.add("cursor-ring-active");
    const onUp = () => ringRef.current?.classList.remove("cursor-ring-active");

    // Leaving via document (not window) fires reliably only when the
    // pointer actually crosses the viewport edge, not for every element
    // boundary — checking relatedTarget/toElement being null confirms it.
    const onDocLeave = (e: MouseEvent) => {
      const to = (e.relatedTarget ?? (e as unknown as { toElement?: Node | null }).toElement) as Node | null;
      if (!to) hide();
    };
    const onDocEnter = () => show();

    // Iframes (the embedded YouTube player) are a separate document, so
    // mousemove events fired while the pointer is inside one never reach
    // this window — the ring/dot would otherwise freeze in place at the
    // iframe's edge instead of disappearing. mouseover/mouseout on the
    // iframe element itself still bubble to this document normally, so
    // use those to hide/show around it.
    const onOverIframe = (e: MouseEvent) => {
      if (e.target instanceof HTMLIFrameElement) hide();
    };
    const onOutIframe = (e: MouseEvent) => {
      if (e.target instanceof HTMLIFrameElement) show();
    };
    // Backup for when the click itself moves keyboard focus into the
    // iframe (e.g. clicking the player) without a clean mouseout.
    const onWindowBlur = () => {
      if (document.activeElement instanceof HTMLIFrameElement) hide();
    };
    const onWindowFocus = () => show();

    let rafId: number;
    const animateRing = () => {
      // Snappier follow (was 0.15) so the ring reads as responsive
      // instead of visibly lagging behind the pointer.
      ringX += (mouseX - ringX) * 0.35;
      ringY += (mouseY - ringY) * 0.35;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onDocLeave);
    document.documentElement.addEventListener("mouseenter", onDocEnter);
    document.addEventListener("mouseover", onOverIframe);
    document.addEventListener("mouseout", onOutIframe);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onDocLeave);
      document.documentElement.removeEventListener("mouseenter", onDocEnter);
      document.removeEventListener("mouseover", onOverIframe);
      document.removeEventListener("mouseout", onOutIframe);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
