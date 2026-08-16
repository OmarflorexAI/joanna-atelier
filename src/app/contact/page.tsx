import type { Metadata } from "next";
import { studio } from "@/content/studio";
import { ContactForm } from "@/components/contact-form";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal, RuleDraw } from "@/components/reveal";
import { T, SectionHeadT } from "@/components/t";

export const metadata: Metadata = {
  title: "Enquire",
  description:
    "Begin a piece, or read the answers to the questions I am asked most: lead times, fittings, pricing and shipping.",
};

/**
 * The FAQ exists to end repeat DMs. Every entry has a stable id so Johanna can
 * paste a link to a single answer — e.g. /contact#lead-time
 * TODO(johanna): replace every answer with her real terms.
 */
/* Five, not eight. The cut three (shipping, alterations, care) all answer
   questions that arise AFTER someone has commissioned a piece; the page's job
   is to get them to write in the first place. Shipping is covered inside the
   "remote" answer. Their strings stay in i18n.ts so nothing breaks and they
   can be restored without retranslating. */
const FAQ = [
  { id: "lead-time" },
  { id: "pricing" },
  { id: "fittings" },
  { id: "remote" },
  { id: "names" },
];

export default function ContactPage() {
  return (
    <>
      {/* Header — tightened: the display size steps down a rank and the
          intro sits directly under it rather than in the far column. */}
      <section className="mx-auto max-w-[76rem] px-6 pt-[clamp(7rem,11vw,9rem)] md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-14">
          <Reveal>
            <h1 className="t-display-lg">
              <T k="contact.h1a" /> <span className="t-serif"><T k="contact.h1b" /></span>
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="t-body max-w-[46ch] lg:pb-2">
              <T k="contact.intro" />
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form — narrower measure, less vertical air */}
      <section className="mx-auto max-w-[76rem] px-6 py-[clamp(2.5rem,5vw,4rem)] md:px-10">
        <RuleDraw />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120}>
            <aside className="flex flex-col gap-10 lg:border-l lg:border-[var(--rule)] lg:pl-12">
              <div className="flex flex-col gap-3">
                <span className="t-micro text-silt">
                  <T k="footer.atelier" />
                </span>
                <p className="text-[0.98rem] leading-relaxed text-taupe">
                  {studio.location}
                  <br />
                  <T k="contact.byAppointmentOnly" />
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="t-micro text-silt">
                  <T k="footer.direct" />
                </span>
                <a
                  href={`mailto:${studio.email}`}
                  className="text-[0.98rem] text-taupe underline-offset-4 transition-colors duration-[var(--hover)] hover:text-umber hover:underline"
                >
                  {studio.email}
                </a>
                <a
                  href={studio.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[0.98rem] text-taupe underline-offset-4 transition-colors duration-[var(--hover)] hover:text-umber hover:underline"
                >
                  <T k="footer.instagram" /> {studio.instagramHandle}
                </a>
              </div>
              <div className="flex flex-col gap-3 border-t border-[var(--rule)] pt-8">
                <span className="t-micro text-silt">
                  <T k="contact.beforeYouWrite" />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-taupe">
                  <T k="contact.beforeBody" />
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* FAQ — each answer is individually linkable */}
      <section
        id="questions"
        className="mx-auto max-w-[76rem] px-6 pb-[clamp(2rem,4vw,3rem)] pt-[clamp(1.5rem,3vw,2.5rem)] md:px-10"
      >
        <SectionHeadT titleKey="contact.askedOften" asideKey="contact.tapAny" />
        <FaqAccordion items={FAQ} />
      </section>
    </>
  );
}
