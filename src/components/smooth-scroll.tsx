"use client";

import { useEffect } from "react";

/**
 * In-page anchor scrolling on the site's own easing curve
 * (cubic-bezier(.22,1,.36,1)) rather than the browser's fixed one.
 *
 * Progressive enhancement: without JS, `scroll-behavior: smooth` in
 * globals.css still handles it. With `prefers-reduced-motion`, this
 * bails out entirely and lets the browser jump instantly.
 */

const NAV_OFFSET = 96; // clears the fixed header
const DURATION = 900;

// cubic-bezier(.22, 1, .36, 1) solved for y at time t
function ease(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;

    function scrollTo(target: number) {
      cancelAnimationFrame(frame);
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 2) return;
      const t0 = performance.now();

      const step = (now: number) => {
        const elapsed = now - t0;
        const p = Math.min(elapsed / DURATION, 1);
        window.scrollTo(0, start + distance * ease(p));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }

    function onClick(e: MouseEvent) {
      // Respect modified clicks and non-primary buttons.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const el = document.getElementById(href.slice(1));
      if (!el) return;

      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      scrollTo(top);

      // Keep the URL and focus behaviour of a real anchor jump.
      history.pushState(null, "", href);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }

    // Cancel the animation if the user takes over.
    const cancel = () => cancelAnimationFrame(frame);

    document.addEventListener("click", onClick);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
