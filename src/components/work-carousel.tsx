"use client";

import Link from "next/link";
import { Carousel_003 } from "@/components/ui/skiper-ui/skiper49";
import type { Piece } from "@/content/pieces";
import { useLocale } from "./locale-provider";

/**
 * Home-page gallery. Wraps the Skiper 49 coverflow carousel (Swiper) with
 * Johanna's pieces and the site's own surface, and adds a caption + link for
 * the centred slide — the carousel itself renders bare images.
 */
export function WorkCarousel({ pieces }: { pieces: Piece[] }) {
  const { t } = useLocale();
  const images = pieces.map((p) => ({
    src: p.images[0].src,
    alt: p.images[0].alt,
    href: `/work/${p.slug}`,
    title: p.title,
  }));

  return (
    <section
      aria-label={t("home.selectedWork")}
      className="overflow-hidden bg-oat py-[clamp(2.5rem,6vw,4.5rem)]"
    >
      <div className="mx-auto mb-8 flex max-w-[104rem] items-baseline justify-between gap-6 px-6 md:px-10 lg:px-14">
        <h2 className="t-section">{t("home.selectedWork")}</h2>
        <span className="t-micro text-silt">{t("home.tapToView")}</span>
      </div>

      <div className="flex w-full justify-center">
        {/* The images are the control: click a side image and it slides to
            the centre; click the centred one and it opens that piece. Swipe
            stays on for phones, where it is the expected gesture. */}
        <Carousel_003
          images={images}
          showPagination
          loop
          selectLabel={t("home.show")}
        />
      </div>

      <div className="mx-auto mt-6 flex max-w-[104rem] justify-center px-6">
        <Link href="/work" className="btn-raised">
          {t("home.seeAllPieces")}
        </Link>
      </div>
    </section>
  );
}
