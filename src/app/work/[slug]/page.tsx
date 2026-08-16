import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPiece, pieces } from "@/content/pieces";
import { Reveal, RuleDraw } from "@/components/reveal";
import { Typewriter } from "@/components/typewriter";
import { ButtonGhost } from "@/components/ui";
import { T, TCategory } from "@/components/t";

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) return {};
  return {
    title: piece.title,
    description: piece.summary,
    openGraph: {
      title: piece.title,
      description: piece.summary,
      images: [{ url: piece.images[0].src }],
    },
  };
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getPiece(slug);
  if (!piece) notFound();

  const idx = pieces.findIndex((p) => p.slug === piece.slug);
  const next = pieces[(idx + 1) % pieces.length];
  const [cover, ...gallery] = piece.images;

  return (
    <article className="pt-[clamp(6.5rem,10vw,8rem)]">
      {/* Header */}
      <header className="mx-auto max-w-[104rem] px-6 md:px-10 lg:px-14">
        <Reveal>
          <Link
            href="/work"
            className="t-micro text-silt transition-colors duration-[var(--hover)] hover:text-umber"
          >
            ← <T k="piece.allWork" />
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal delay={80}>
            <h1 className="t-display-xl">{piece.title}</h1>
          </Reveal>
          <Reveal delay={160}>
            <Typewriter
              text={piece.summary}
              className="t-body max-w-[44ch] lg:pb-3"
              delay={420}
            />
          </Reveal>
        </div>
      </header>

      {/* Cover — capped height so a 3:4 portrait doesn't run off the fold */}
      <Reveal delay={120} className="mx-auto mt-14 max-w-[104rem] px-6 md:px-10 lg:px-14">
        <div className="plate mx-auto max-w-[46rem] overflow-hidden bg-oat">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, 46rem"
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>

      {/* Specification + story */}
      <section className="mx-auto max-w-[104rem] px-6 py-[clamp(2.5rem,5vw,4rem)] md:px-10 lg:px-14">
        <RuleDraw />
        {/* Facts column is narrower now that materials and hours are gone —
            two short rows should not reserve a third of the width. */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
          {/* Gallery label — the facts */}
          <Reveal>
            <dl className="flex flex-col gap-7">
              <div className="flex flex-col gap-2">
                <dt className="t-micro text-silt">
                  <T k="piece.year" />
                </dt>
                <dd className="t-label">{piece.year}</dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="t-micro text-silt">
                  <T k="piece.occasion" />
                </dt>
                <dd className="t-label">
                  <TCategory value={piece.category} />
                </dd>
              </div>
              {piece.client ? (
                <div className="flex flex-col gap-2">
                  <dt className="t-micro text-silt">
                    <T k="piece.madeFor" />
                  </dt>
                  <dd className="t-label">{piece.client}</dd>
                </div>
              ) : null}
            </dl>
          </Reveal>

          {/* The story */}
          <Reveal delay={120}>
            <div className="flex flex-col gap-7">
              {piece.description.map((p, i) =>
                // Only the opening line types. Typing every paragraph would
                // keep the reader waiting on the copy rather than reading it.
                i === 0 ? (
                  <Typewriter
                    key={i}
                    text={p}
                    className="t-display-md max-w-[30ch] !leading-[1.25] text-umber"
                    speed={18}
                  />
                ) : (
                  <p key={i} className="t-body max-w-[62ch]">
                    {p}
                  </p>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery — detail shots get full width, they carry the craft claim */}
      {gallery.length > 0 ? (
        <section className="mx-auto max-w-[104rem] px-6 pb-[clamp(2rem,4vw,3rem)] md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[72rem] items-start gap-8 sm:grid-cols-2">
            {gallery.map((im, i) => (
              <Reveal key={im.src} delay={i * 90}>
                <figure className="flex flex-col gap-3">
                  <div className="plate aspect-[4/5] overflow-hidden bg-oat">
                    <Image
                      src={im.src}
                      alt={im.alt}
                      width={im.width}
                      height={im.height}
                      quality={88}
                      sizes="(max-width: 640px) 100vw, 36rem"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {im.detail ? (
                    <figcaption className="t-micro text-silt">
                      <T k="piece.detail" />
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Contextual CTA + next piece */}
      <section className="mx-auto max-w-[104rem] px-6 md:px-10 lg:px-14">
        <div className="flex flex-col gap-10 border-t border-[var(--rule)] pt-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="t-section max-w-[22ch]">
              <T k="piece.ctaTitle" />
            </h2>
            <p className="t-body max-w-[42ch]">
              <T k="piece.ctaBody" />
            </p>
          </div>
          <ButtonGhost href="/contact">
            <T k="piece.getInTouch" />
          </ButtonGhost>
        </div>

        {/* Continue — a real preview of the next piece, not a stray label */}
        <Link
          href={`/work/${next.slug}`}
          className="group mt-16 flex items-center gap-5 border-t border-[var(--rule)] py-6 sm:gap-7"
        >
          <div className="h-20 w-16 shrink-0 overflow-hidden bg-oat sm:h-24 sm:w-20">
            <Image
              src={next.images[0].src}
              alt=""
              width={next.images[0].width}
              height={next.images[0].height}
              sizes="80px"
              className="h-full w-full object-cover transition-transform duration-[var(--hover)] ease-[var(--ease)] group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="t-micro text-silt">
              <T k="piece.next" />
            </span>
            <span className="t-display-md" style={{ fontSize: "1.6rem" }}>
              {next.title}
            </span>
          </div>
          <span
            aria-hidden
            className="ml-auto text-[1.4rem] text-taupe transition-transform duration-[var(--hover)] ease-[var(--ease)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </Link>
      </section>
    </article>
  );
}
