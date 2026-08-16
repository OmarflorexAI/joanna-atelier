"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "./locale-provider";

/**
 * The oversized closing CTA.
 *
 * Hidden on /contact — the footer renders on every route, and inviting
 * someone to "begin a piece" while they are already looking at the
 * enquiry form reads as a dead link, because it is one.
 */
export function FooterCta() {
  const pathname = usePathname();
  const { t } = useLocale();
  if (pathname === "/contact") return null;

  return (
    <div className="mx-auto max-w-[104rem] px-6 py-[clamp(2.5rem,5vw,4.5rem)] md:px-10 lg:px-14">
      <Link
        href="/contact"
        className="group inline-flex flex-col no-underline"
      >
        <span className="t-micro text-silt">{t("footer.enquiries")}</span>
        <span className="t-display-cta mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="transition-opacity duration-[var(--hover)] group-hover:opacity-70">
            {t("footer.ctaTitle")}
          </span>
          <span
            aria-hidden
            className="inline-block text-[0.42em] transition-transform duration-[var(--hover)] ease-[var(--ease)] group-hover:translate-x-4"
          >
            ↗
          </span>
        </span>
      </Link>
      <p className="t-body mt-8 max-w-[46ch]">
        {t("footer.ctaBody")}
      </p>
    </div>
  );
}
