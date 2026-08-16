"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/content/i18n";
import { useLocale } from "./locale-provider";

/**
 * Floating language switch — a small pill that opens a two-item popover.
 *
 * Sits bottom-right, above the footer CTA but out of the reading column. It
 * is deliberately quiet: this is a utility, not a call to action, so it uses
 * the neutral surface and only picks up jade on the active row.
 */
export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape — a popover that traps the page is
  // worse than no popover.
  useEffect(() => {
    if (!open) return;

    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (l: Locale) => {
    setLocale(l);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-5 right-5 z-[60] print:hidden md:bottom-7 md:right-7"
    >
      {/* Menu */}
      <div
        id="lang-menu"
        role="menu"
        aria-label={t("lang.label")}
        hidden={!open}
        className="absolute bottom-[calc(100%+0.5rem)] right-0 min-w-[9.5rem] overflow-hidden rounded-md border border-[var(--rule)] bg-bone shadow-[0_8px_30px_rgba(36,31,27,0.10)]"
      >
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => choose(l)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[0.88rem] transition-colors duration-[var(--hover)] ${
                active
                  ? "bg-[var(--oat)] text-umber"
                  : "text-taupe hover:bg-[var(--oat)] hover:text-umber"
              }`}
            >
              {LOCALE_LABEL[l]}
              {active ? (
                <span aria-hidden className="text-jade">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="lang-menu"
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-[var(--rule-strong)] bg-bone px-4 py-2.5 text-[0.78rem] uppercase tracking-[0.14em] text-umber shadow-[0_4px_16px_rgba(36,31,27,0.08)] transition-colors duration-[var(--hover)] hover:border-umber"
      >
        <span className="sr-only">{t("lang.switch")}</span>
        <GlobeIcon />
        <span aria-hidden>{locale.toUpperCase()}</span>
      </button>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M2.8 12h18.4" />
      <path d="M12 2.8c2.5 2.6 3.8 5.8 3.8 9.2s-1.3 6.6-3.8 9.2c-2.5-2.6-3.8-5.8-3.8-9.2S9.5 5.4 12 2.8z" />
    </svg>
  );
}
