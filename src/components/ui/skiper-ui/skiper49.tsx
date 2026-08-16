"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

const Skiper49 = () => {
  const images = [
    {
      src: "/images/x.com/13.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/32.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/20.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/21.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/19.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/1.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/2.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/3.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/4.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/5.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/6.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <Carousel_003 className="" images={images} showPagination loop />
    </div>
  );
};

export { Skiper49 };

/** Slide travel time. Long enough to read as motion, short enough to feel
 *  responsive when a visitor clicks through several pieces in a row. */
const SLIDE_MS = 620;

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
  allowTouchMove = true,
  nextLabel = "Next",
  prevLabel = "Previous",
  selectLabel = "Show",
}: {
  images: { src: string; alt: string; href?: string; title?: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  /** Added: lets the caller turn off drag/swipe and drive by arrows only. */
  allowTouchMove?: boolean;
  /** Added: accessible names for the arrows, so they can be translated. */
  nextLabel?: string;
  prevLabel?: string;
  /** Added: prefix for an off-centre slide's accessible name. */
  selectLabel?: string;
}) => {
  // Added: the images themselves drive the carousel, so the component needs
  // to know which slide is centred and hold the Swiper instance to move it.
  const [swiper, setSwiper] = React.useState<SwiperClass | null>(null);
  const [active, setActive] = React.useState(0);
  // Slides are 4:5 to match the piece covers, and scale down on phones so
  // the carousel never overflows a 390px viewport.
  const css = `
  .Carousal_003 {
    width: 100%;
    height: clamp(340px, 62vw, 460px);
    padding-bottom: 48px !important;
  }

  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    /* Narrow enough that BOTH neighbours keep a tappable strip on screen at
       360px — the slides are the only control now, so an off-screen
       neighbour would mean no way to advance except swiping. */
    width: clamp(150px, 43vw, 290px);
    border-radius: 2px;
    overflow: hidden;
  }

  /* Off-centre slides are selectable; the centred one opens its piece.
     Both are pointers, but the centred slide gets a subtle lift so the
     difference in meaning is visible, not just felt. */
  .Carousal_003 .swiper-slide-active {
    cursor: pointer;
  }

  .Carousal_003 .swiper-pagination-bullet {
    background-color: var(--umber) !important;
    opacity: .25;
  }

  .Carousal_003 .swiper-pagination-bullet-active {
    background-color: var(--jade) !important;
    opacity: 1;
  }

  /* Arrows: our palette, real tap targets, visible focus ring. */
  .Carousal_003 .nav-arrow {
    width: 44px;
    height: 44px;
    border-radius: 999px;
    color: var(--umber);
    background: var(--bone);
    border: 1px solid var(--rule-strong);
    transition:
      background-color var(--hover) var(--ease),
      color var(--hover) var(--ease),
      border-color var(--hover) var(--ease),
      opacity var(--hover) var(--ease);
  }

  .Carousal_003 .nav-arrow:hover {
    background: var(--jade);
    border-color: var(--jade);
    color: var(--bone);
  }

  .Carousal_003 .nav-arrow:focus-visible {
    outline: 2px solid var(--jade);
    outline-offset: 3px;
  }

  .Carousal_003 .swiper-button-disabled {
    opacity: 0.35;
    pointer-events: none;
  }

  /* Push the arrows to the outer edge so they sit beside the reel rather
     than on top of the neighbouring slides. */
  .Carousal_003 .swiper-button-prev { left: 0; }
  .Carousal_003 .swiper-button-next { right: 0; }

  @media (max-width: 640px) {
    .Carousal_003 .nav-arrow { width: 40px; height: 40px; }
    .Carousal_003 .swiper-button-prev { left: -2px; }
    .Carousal_003 .swiper-button-next { right: -2px; }
  }
`;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-5xl px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 1500,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="coverflow"
          speed={SLIDE_MS}
          allowTouchMove={allowTouchMove}
          grabCursor={allowTouchMove}
          /* Drag feel: a short threshold so a small flick still commits, and
             a low resistance ratio so the reel does not feel rubber-banded.
             `followFinger` keeps the slides under the cursor while dragging
             rather than easing behind it. */
          threshold={4}
          touchRatio={1.15}
          touchAngle={35}
          followFinger
          resistanceRatio={0.72}
          longSwipesRatio={0.28}
          shortSwipes
          watchSlidesProgress
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          /* Without extra buffered clones the loop runs out of prepended
             slides going backwards: slidePrev stops moving after one step
             while slideNext keeps working. Buffering a couple either side
             keeps travel symmetric in both directions. */
          loopAdditionalSlides={2}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          onSwiper={setSwiper}
          onSlideChange={(sw) => setActive(sw.realIndex)}
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="">
              {/* Each slide links to its piece when `href` is given, so the
                  carousel is a real way into the catalog and not just a
                  decorative reel. Swiper's own drag handling stays intact —
                  a drag ends on the slide, not as a click. */}
              <SlideMedia
                image={image}
                isActive={index === active}
                activateLabel={`${selectLabel} ${image.title ?? image.alt}`}
                onActivate={() => {
                  if (!swiper) return;
                  if (!loop) {
                    swiper.slideTo(index);
                    return;
                  }
                  /* Move by the SHORTEST path, not to an absolute index.
                     slideToLoop(index) sent a click on the visually-adjacent
                     previous slide from 0 all the way to 7 — technically the
                     right piece, but the reel spun the long way round and the
                     next click then appeared to do nothing. Clicking a
                     neighbour should step exactly one place. */
                  const total = images.length;
                  let delta = index - swiper.realIndex;
                  if (delta > total / 2) delta -= total;
                  if (delta < -total / 2) delta += total;
                  if (delta === 0) return;
                  /* Step in the direction the visitor pointed. slideNext /
                     slidePrev always travel one place the short way; there is
                     no direction argument on slideToLoop, and passing an
                     absolute index is what sent 0 -> 7 the long way round.
                     Only neighbours are clickable, so one step is the whole
                     journey; a farther slide simply steps toward itself. */
                  if (delta > 0) swiper.slideNext(SLIDE_MS);
                  else swiper.slidePrev(SLIDE_MS);
                }}
              />
            </SwiperSlide>
          ))}
          {showNavigation && (
            /* Changed from the shipped <div>s: these are real <button>s, so
               they are keyboard-reachable and announced. Retoned to our
               palette too — the originals were white-on-white here. */
            <div>
              <button
                type="button"
                aria-label={nextLabel}
                className="swiper-button-next nav-arrow after:hidden"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={prevLabel}
                className="swiper-button-prev nav-arrow after:hidden"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden />
              </button>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

/**
 * A slide's media.
 *
 * Two-stage click, so the images themselves drive the carousel:
 *   - a slide that is NOT centred is a button — clicking it brings it to
 *     the centre rather than navigating away;
 *   - the centred slide is a real <Link> to its piece.
 *
 * That keeps one obvious meaning per click and leaves the centred slide
 * crawlable and middle-clickable, which a button would have destroyed.
 *
 * `draggable={false}` stops the browser's native image-drag from competing
 * with Swiper's touch handling.
 */
function SlideMedia({
  image,
  isActive = true,
  onActivate,
  activateLabel,
}: {
  image: { src: string; alt: string; href?: string; title?: string };
  isActive?: boolean;
  onActivate?: () => void;
  activateLabel?: string;
}) {
  const media = (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        className="object-cover"
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 78vw, 300px"
        quality={90}
        draggable={false}
      />
      {image.title ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
          <span className="t-micro text-white">{image.title}</span>
        </span>
      ) : null}
    </div>
  );

  const ring =
    "block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade";

  // Off-centre: clicking selects rather than navigates.
  if (!isActive && onActivate) {
    return (
      <button
        type="button"
        onClick={onActivate}
        aria-label={activateLabel}
        className={`${ring} cursor-pointer`}
      >
        {media}
      </button>
    );
  }

  if (!image.href) return media;

  return (
    <Link href={image.href} draggable={false} className={ring}>
      {media}
    </Link>
  );
}

export { Carousel_003 };

/**
 * Skiper 49 Carousel_003 — React + Swiper
 * Built with Swiper.js - Read docs to learn more https://swiperjs.com/
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
