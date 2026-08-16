"use client";

import { studio } from "@/content/studio";
import { FooterCta } from "./footer-cta";
import { Signature } from "./signature";
import { HomeLink } from "./home-link";
import { DrawOnView } from "./reveal";
import { useLocale } from "./locale-provider";

export function SiteFooter() {
  const { t } = useLocale();
  return (
    <footer className="mt-[clamp(3rem,6vw,5rem)] border-t border-[var(--rule)]">
      {/* Oversized closing CTA — the primary conversion surface */}
      <FooterCta />

      <div className="border-t border-[var(--rule)]">
        <div className="mx-auto flex max-w-[104rem] flex-col gap-8 px-6 pb-24 pt-10 md:flex-row md:items-start md:justify-between md:px-10 md:pb-14 lg:px-14">
          <div className="flex flex-col gap-2">
            <span className="t-micro text-silt">{t("footer.direct")}</span>
            <a
              href={`mailto:${studio.email}`}
              className="text-[0.95rem] text-taupe underline-offset-4 transition-colors duration-[var(--hover)] hover:text-umber hover:underline"
            >
              {studio.email}
            </a>
            <a
              href={studio.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[0.95rem] text-taupe underline-offset-4 transition-colors duration-[var(--hover)] hover:text-umber hover:underline"
            >
              {t("footer.instagram")} {studio.instagramHandle}
            </a>
          </div>

          {/* Same mark as the nav, larger here where it has room to breathe
              and reads as a sign-off. Links home like the nav one does. */}
          <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
            <HomeLink
              ariaLabel={`${studio.name} — ${t("nav.home")}`}
              className="transition-opacity duration-[var(--hover)] hover:opacity-60"
            >
              <DrawOnView className="text-umber">
                <Signature width={150} tight />
              </DrawOnView>
            </HomeLink>

            {/* Right padding on the last line keeps the copyright clear of
                the floating language pill, which is fixed bottom-right. */}
            <span className="text-[0.8rem] text-silt md:pr-24">
              © {new Date().getFullYear()} — {studio.discipline}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
