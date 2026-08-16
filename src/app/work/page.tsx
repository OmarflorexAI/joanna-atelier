import type { Metadata } from "next";
import { pieces } from "@/content/pieces";
import { WorkGrid } from "./work-grid";
import { Reveal } from "@/components/reveal";
import { ArrowLink } from "@/components/ui";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The full catalog of custom, hand-made pieces — evening, bridal, editorial and performance.",
};

export default function WorkPage() {
  return (
    <section className="mx-auto max-w-[104rem] px-6 pb-8 pt-[clamp(7rem,11vw,9rem)] md:px-10 lg:px-14">
      <Reveal>
        <span className="t-micro text-silt">
          <T k="work.catalog" />
        </span>
        <h1 className="t-display-xl mt-6">
          <T k="work.h1" />
        </h1>
        <p className="t-body mt-8 max-w-[52ch]">
          <T k="work.intro" />
        </p>
        <div className="mt-8">
          <ArrowLink href="/collection">
            <T k="work.viewCollection" />
          </ArrowLink>
        </div>
      </Reveal>

      <WorkGrid pieces={pieces} />
    </section>
  );
}
