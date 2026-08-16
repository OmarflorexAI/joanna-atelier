"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types its text out character by character when it first scrolls into view.
 *
 * Progressive enhancement, same contract as <Reveal>: the full string is in
 * the server HTML and is what a crawler and a no-JS visitor get. Only after
 * mount does this take over and replay it. It never gates content.
 *
 * Accessibility: the animating copy is aria-hidden and a complete, static
 * copy sits in the accessibility tree, so a screen reader announces the
 * sentence once rather than on every keystroke. Reduced-motion skips
 * straight to the finished string.
 */
export function Typewriter({
  text,
  className = "",
  /** ms per character. */
  speed = 26,
  /** ms to wait after entering view before the first character. */
  delay = 0,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  // Start "complete": if JS runs but the observer never fires, the text is
  // still whole. The effect below is what opts into animating.
  const [typed, setTyped] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: never opt in. `typed` stays null, so the component
    // keeps rendering the plain finished string it server-rendered.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();

        // One state transition, not two: the clock starts now and `delay` is
        // absorbed into it, so the text goes straight from whole to typing
        // with no blank frame in between.
        const started = performance.now();
        const total = text.length * speed;

        const tick = (now: number) => {
          const elapsed = now - started - delay;
          if (elapsed < 0) {
            setTyped("");
            raf = requestAnimationFrame(tick);
            return;
          }
          const p = Math.min(1, elapsed / total);
          setTyped(text.slice(0, Math.round(p * text.length)));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, speed, delay]);

  // Before mount (and in the server HTML) typed is null → render the full
  // string plainly, no wrapper spans, nothing to hydrate around.
  if (typed === null || done) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={`tw-typing ${className}`}>
      {/* Static full copy for assistive tech — announced once, not per key. */}
      <span className="sr-only">{text}</span>
      {/* The full string, invisible, holds the final height so nothing below
          shifts as characters land. The typed copy overlays it. */}
      <span aria-hidden="true" className="tw-ghost">
        {text}
      </span>
      <span aria-hidden="true" className="tw-live">
        {typed}
        <span className="tw-caret" />
      </span>
    </Tag>
  );
}
