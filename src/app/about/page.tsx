import type { Metadata } from "next";
import Image from "next/image";
import { studio } from "@/content/studio";
import { Reveal } from "@/components/reveal";
import { ArrowLink } from "@/components/ui";
import { T, SectionHeadT } from "@/components/t";
import type { MessageKey } from "@/content/i18n";

export const metadata: Metadata = {
  title: "Atelier",
  description:
    "How a piece is made — the fitting, the drafting, the hand-work, and the final press.",
};

/** TODO(johanna): confirm this reflects how she actually works.
 *  Copy lives in src/content/i18n.ts under the `proc.*` keys. */
const PROCESS_COUNT = 5;

export default function AboutPage() {
  return (
    <>
      {/* Header: the statement leads, the paragraph sits under it as a
          left-aligned column rather than floating in the right margin. */}
      <section className="mx-auto max-w-[104rem] px-6 pt-[clamp(7rem,11vw,9rem)] md:px-10 lg:px-14">
        <Reveal>
          <h1 className="t-display-xl max-w-[13ch]">
            <T k="about.h1a" /> <span className="t-serif"><T k="about.h1b" /></span>
          </h1>
        </Reveal>
        <Reveal delay={110}>
          <p className="t-body mt-10 max-w-[54ch] text-[1.08rem] leading-[1.75]">
            {/* TODO(johanna): replace with her own words. */}
            <T k="about.intro1" /> {studio.since}. <T k="about.intro2" />
          </p>
        </Reveal>
      </section>

      {/* Portrait + statement */}
      <section className="mx-auto max-w-[104rem] px-6 py-[clamp(2.5rem,5vw,4rem)] md:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <Reveal>
            <div className="plate aspect-[4/5] w-full max-w-[22rem] overflow-hidden bg-oat">
              <Image
                src="/pieces/portrait.jpg"
                alt="Johanna in the atelier"
                width={1600}
                height={2000}
                quality={88}
                sizes="(max-width: 1024px) 100vw, 22rem"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-center gap-8">
            <p className="t-display-md max-w-[24ch] !leading-[1.25]">
              <T k="about.statement" />
            </p>
            <p className="t-body max-w-[56ch]">
              <T k="about.body1" />
            </p>
            <p className="t-body max-w-[56ch]">
              <T k="about.body2" />
            </p>
            <div className="pt-2">
              <ArrowLink href="/contact">
                <T k="about.enquire" />
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[104rem] px-6 py-[clamp(2rem,4vw,3rem)] md:px-10 lg:px-14">
        <SectionHeadT titleKey="about.processTitle" asideKey="about.processAside" />
        <ol className="mt-14 flex flex-col">
          {Array.from({ length: PROCESS_COUNT }, (_, i) => (
            <Reveal key={i} delay={i * 70}>
              <li className="grid gap-4 border-t border-[var(--rule)] py-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
                <h3 className="t-section">
                  <T k={`proc.${i}.t` as MessageKey} />
                </h3>
                <p className="t-body max-w-[58ch]">
                  <T k={`proc.${i}.b` as MessageKey} />
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
