import { ArrowLink } from "@/components/ui";
import { T } from "@/components/t";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[104rem] flex-col justify-center px-6 py-32 md:px-10 lg:px-14">
      <span className="t-micro text-silt">
        <T k="err.404" />
      </span>
      <h1 className="t-display-xl mt-6 max-w-[14ch]">
        <T k="err.h1a" /> <span className="t-serif"><T k="err.h1b" /></span>{" "}
        <T k="err.h1c" />
      </h1>
      <p className="t-body mt-8 max-w-[42ch]">
        <T k="err.body" />
      </p>
      <div className="mt-10 flex flex-wrap gap-8">
        <ArrowLink href="/work">
          <T k="err.seeWork" />
        </ArrowLink>
        <ArrowLink href="/contact">
          <T k="err.begin" />
        </ArrowLink>
      </div>
    </section>
  );
}
