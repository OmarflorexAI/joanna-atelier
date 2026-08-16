import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/content/pieces";
import { TCategory } from "./t";

/**
 * A garment, not a website — so no browser chrome, no card container,
 * no drop shadow. The photograph sits directly on the page and the
 * metadata hangs beneath it like a gallery label.
 */
export function PieceCard({
  piece,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
}: {
  piece: Piece;
  priority?: boolean;
  sizes?: string;
}) {
  const cover = piece.images[0];

  return (
    <Link href={`/work/${piece.slug}`} className="group block">
      <div className="plate relative aspect-[4/5] overflow-hidden bg-oat">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          sizes={sizes}
          priority={priority}
          quality={88}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.035]"
        />
        {/* Year, revealed on hover — quiet, not a badge */}
        <span className="t-micro pointer-events-none absolute bottom-4 right-4 text-bone opacity-0 mix-blend-difference transition-opacity duration-[var(--hover)] group-hover:opacity-100">
          {piece.year}
        </span>
      </div>

      {/* Fixed-height label so every card in a row ends on the same line,
          whether the summary wraps to one line or two. */}
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--rule)] pt-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="t-display-md" style={{ fontSize: "1.42rem" }}>
            {piece.title}
          </h3>
          <p className="line-clamp-2 min-h-[2.8em] max-w-[42ch] text-[0.82rem] font-normal leading-relaxed text-taupe">
            {piece.summary}
          </p>
        </div>
        <span className="t-micro shrink-0 text-silt">
          <TCategory value={piece.category} />
        </span>
      </div>
    </Link>
  );
}
