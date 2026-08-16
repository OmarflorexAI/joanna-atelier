"use client";

import { useLocale } from "./locale-provider";

/** Keyboard skip link. Client-side only because its label translates. */
export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:bg-jade focus:px-5 focus:py-3 focus:text-bone"
    >
      {t("nav.skip")}
    </a>
  );
}
