"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue,
} from "framer-motion";

/**
 * CollectionSurfer — scroll-driven 3D collection viewer.
 *
 * Cards ride a perspective track; scrolling advances the scene and the
 * track loops via a modulo on the scroll position. `magnetic` scales the
 * card nearest the pointer, `uplift` raises it, `simple` disables both.
 *
 * Occupies the viewport: it renders a tall scroll runway plus a fixed
 * full-screen scene, so it needs a route of its own. Dropping it inside an
 * existing page buries the nav, footer, and anything below it.
 *
 * Default items point at local files under public/pieces so images are
 * served from this origin rather than hotlinked.
 */

export interface CollectionItem {
  id: number;
  image: string;
  title: string;
}

export type CollectionSurferVariant = "magnetic" | "uplift" | "simple";

const ITEMS: CollectionItem[] = [
  { id: 1, image: "/pieces/azabache-1.jpg", title: "AZABACHE" },
  { id: 2, image: "/pieces/ceiba-1.jpg", title: "CEIBA" },
  { id: 3, image: "/pieces/malecon-1.jpg", title: "MALECÓN" },
  { id: 4, image: "/pieces/vega-real-1.jpg", title: "VEGA REAL" },
  { id: 5, image: "/pieces/amber-room-1.jpg", title: "AMBER ROOM" },
  { id: 6, image: "/pieces/saona-1.jpg", title: "SAONA" },
  { id: 7, image: "/pieces/seda-1.jpg", title: "SEDA" },
  { id: 8, image: "/pieces/higuey-1.jpg", title: "HIGÜEY" },
];

interface CollectionSurferProps {
  items?: CollectionItem[];
  variant?: CollectionSurferVariant;
  /** Small label above the display title. */
  eyebrow?: string;
  /** Display title, set across two lines. */
  title?: [string, string];
}

export function CollectionSurfer({
  items = ITEMS,
  variant = "magnetic",
  eyebrow = "JOANNA — CUSTOM ATELIER",
  title = ["THE", "COLLECTION"],
}: CollectionSurferProps) {
  // Render the set twice so scrolling past the first wraps seamlessly.
  const duplicatedItems = [...items, ...items];

  const scrollPerItem = 600;
  const loopDistance = items.length * scrollPerItem;

  const { scrollY } = useScroll();

  const smoothScroll = useSpring(scrollY, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
  });

  // Modulo the scroll so the track cycles instead of running out.
  const loopedProgress = useTransform(
    smoothScroll,
    (value) => value % loopDistance,
  );

  const stepX = 240;
  const stepY = -84;
  const stepZ = -288;

  const x = useTransform(
    loopedProgress,
    [0, loopDistance],
    [0, -items.length * stepX],
  );
  const y = useTransform(
    loopedProgress,
    [0, loopDistance],
    [0, -items.length * stepY],
  );
  const z = useTransform(
    loopedProgress,
    [0, loopDistance],
    [0, -items.length * stepZ],
  );

  // Off-screen until the pointer enters, so nothing is scaled by default.
  const mouseX = useMotionValue(-10000);
  const mouseY = useMotionValue(-10000);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (variant === "simple") return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    if (variant === "simple") return;
    mouseX.set(-10000);
    mouseY.set(-10000);
  };

  return (
    <div className="relative min-h-screen w-full bg-umber text-bone">
      {/* Scroll runway — the fixed scene below reads its position. */}
      <div style={{ height: "50000px" }} className="w-full" />

      <div
        className="fixed inset-0 flex h-screen w-full items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Title block — offset below the exit link in the route layout. */}
        <div className="pointer-events-none absolute left-[3vw] top-[max(7rem,9vw)] z-50">
          <p className="t-micro mb-4 ml-[4vw] opacity-70">{eyebrow}</p>
          <h1
            className="ml-[4vw] text-[clamp(2rem,6vw,5rem)] leading-[0.9]"
            style={{ fontFamily: "var(--font-display), serif", fontWeight: 300 }}
          >
            {title[0]}
          </h1>
          <h1
            className="text-[clamp(2rem,6vw,5rem)] leading-[0.9]"
            style={{ fontFamily: "var(--font-display), serif", fontWeight: 300 }}
          >
            {title[1]}
            <span className="t-micro relative top-[-1.4em] ml-3 align-top tabular-nums opacity-60">
              ({items.length})
            </span>
          </h1>
        </div>

        <div className="t-micro absolute bottom-[3vw] right-[3vw] z-50 opacity-70">
          scroll to surf
        </div>

        {/* 3D scene */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "2000px", perspectiveOrigin: "10% 10%" }}
        >
          <motion.div
            className="relative h-0 w-0"
            style={{ x, y, z, transformStyle: "preserve-3d" }}
          >
            {duplicatedItems.map((item, i) => (
              <Card
                key={`${item.id}-${i}`}
                item={item}
                i={i}
                total={items.length}
                stepX={stepX}
                stepY={stepY}
                stepZ={stepZ}
                mouseX={mouseX}
                mouseY={mouseY}
                scrollSpring={smoothScroll}
                variant={variant}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Card({
  item,
  i,
  total,
  stepX,
  stepY,
  stepZ,
  mouseX,
  mouseY,
  scrollSpring,
  variant,
}: {
  item: CollectionItem;
  i: number;
  total: number;
  stepX: number;
  stepY: number;
  stepZ: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollSpring: MotionValue<number>;
  variant: CollectionSurferVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Distance from pointer to this card's centre. Depends on the scroll
  // spring too, so the effect tracks a card that is moving under the cursor.
  const distance = useTransform([mouseX, mouseY, scrollSpring], ([x, y]) => {
    if (!ref.current || variant === "simple") return 200;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.hypot(Number(x) - centerX, Number(y) - centerY);
  });

  const targetScale = useTransform(distance, [0, 400], [1.5, 1]);
  const springScale = useSpring(targetScale, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  });

  const targetUplift = useTransform(distance, [0, 400], [-100, 0]);
  const springUplift = useSpring(targetUplift, {
    mass: 0.5,
    stiffness: 300,
    damping: 20,
  });

  const transform = useTransform([springScale, springUplift], ([s, u]) => {
    const scaleValue = variant === "magnetic" ? Number(s) : 1;
    const upliftValue = variant === "uplift" ? Number(u) : 0;

    return `translate3d(${i * stepX}px, ${i * stepY + upliftValue}px, ${
      i * stepZ
    }px) rotateY(-50deg) scale(${scaleValue})`;
  });

  return (
    <motion.div
      ref={ref}
      className="group absolute h-[400px] w-[300px] overflow-hidden bg-[#1a1613] shadow-2xl"
      style={{ transform, transformStyle: "preserve-3d" }}
    >
      {/* Index — modulo the real count so duplicates repeat 01..n */}
      <div className="t-micro absolute -left-4 -top-6 opacity-50 transition-opacity group-hover:opacity-100">
        {String((i % total) + 1).padStart(2, "0")}
      </div>

      <div className="relative h-full w-full brightness-75 transition-all duration-300 group-hover:brightness-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />

      <div className="t-micro pointer-events-none absolute bottom-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {item.title}
      </div>
    </motion.div>
  );
}

export default CollectionSurfer;
