import Image from "next/image";
import { featuredPieces, pieces } from "@/content/pieces";
import { studio, credits } from "@/content/studio";
import type { MessageKey } from "@/content/i18n";
import { Reveal, RuleDraw } from "@/components/reveal";
import { WorkCarousel } from "@/components/work-carousel";
import { ButtonGhost, ButtonPrimary } from "@/components/ui";
import { T, SectionHeadT } from "@/components/t";

const totalHours = pieces.reduce((sum, p) => sum + (p.hours ?? 0), 0);

export default function Home() {
  const [lead] = featuredPieces;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────
          Asymmetric: name and positioning on the left, the lead
          garment immediately visible on the right. The work is
          on screen before a single scroll. */}
      {/* Top padding clears the fixed nav, which is taller now that it carries
          the signature (84px) rather than the small monogram. */}
      <section className="mx-auto max-w-[104rem] px-6 pb-[clamp(2rem,4vw,3.5rem)] pt-[clamp(7rem,11vw,9rem)] md:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div className="flex flex-col lg:pt-2">
            {/* The statement opens the page directly — no eyebrow above it, so
                the h1 carries no top margin and the delays start from zero. */}
            <Reveal>
              <h1 className="t-display-xl">
                <T k="home.h1a" />
                <br />
                <span className="t-serif" style={{ fontStyle: "italic" }}>
                  <T k="home.h1b" />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={90}>
              <p className="t-body mt-9 max-w-[48ch]">{studio.intro}</p>
            </Reveal>

            <Reveal delay={170}>
              <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonPrimary href="/contact">
                  <T k="home.getInTouch" />
                </ButtonPrimary>
                <ButtonGhost href="/work">
                  <T k="home.seeWork" />
                </ButtonGhost>
              </div>
            </Reveal>
          </div>

          {/* Lead garment — capped so a 3:4 portrait cannot dominate the fold */}
          {lead ? (
            <Reveal delay={120} className="lg:pb-2">
              <a
                href={`/work/${lead.slug}`}
                className="group mx-auto block w-full max-w-[26rem] lg:ml-auto lg:mr-0"
              >
                <div className="plate relative aspect-[4/5] overflow-hidden bg-oat">
                  <Image
                    src={lead.images[0].src}
                    alt={lead.images[0].alt}
                    width={lead.images[0].width}
                    height={lead.images[0].height}
                    priority
                    quality={90}
                    sizes="(max-width: 1024px) 100vw, 26rem"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="t-label">{lead.title}</span>
                  <span className="t-micro text-silt">
                    {lead.category} — {lead.year}
                  </span>
                </div>
              </a>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ── Statement ─────────────────────────────────────────
          The craft values, set at display scale as content. */}
      <section className="mx-auto max-w-[104rem] px-6 py-[clamp(2.5rem,6vw,4.5rem)] md:px-10 lg:px-14">
        <RuleDraw />
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <ul className="flex flex-col gap-3 border-l border-umber pl-8">
              {studio.values.map((v, i) => (
                <li
                  key={v}
                  className="t-display-lg"
                  style={{ opacity: 1 - i * 0.22 }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-end gap-8">
            <p className="t-body max-w-[52ch]">
              <T k="home.statement" />
            </p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--rule)] pt-8 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <dt className="t-micro text-silt">
                  <T k="home.since" />
                </dt>
                <dd className="t-display-md">{studio.since}</dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="t-micro text-silt">
                  <T k="home.hoursShown" />
                </dt>
                <dd className="t-display-md">{totalHours.toLocaleString()}</dd>
              </div>
              <div className="flex flex-col gap-2">
                <dt className="t-micro text-silt">
                  <T k="home.pieces" />
                </dt>
                <dd className="t-display-md">
                  <T k="home.oneOfOne" />
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Selected work — coverflow gallery ─────────────── */}
      <WorkCarousel pieces={pieces} />

      {/* ── Standing ──────────────────────────────────────── */}
      <section className="mx-auto max-w-[104rem] px-6 py-[clamp(2.5rem,5vw,4rem)] md:px-10 lg:px-14">
        <SectionHeadT titleKey="home.standing" />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {credits.map((c, i) => (
            <Reveal key={c} delay={i * 80}>
              <div className="flex flex-col gap-4 border-t border-[var(--rule)] pt-5">
                <p className="text-[1.02rem] font-normal leading-relaxed text-umber">
                  <T k={`credit.${i}` as MessageKey} />
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="t-body mt-12 max-w-[54ch]">
            <T k="home.creditsNote" />
          </p>
        </Reveal>
      </section>
    </>
  );
}
