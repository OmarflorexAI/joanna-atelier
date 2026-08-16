"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { studio } from "@/content/studio";
import { Signature } from "./signature";
import { HomeLink } from "./home-link";
import { useLocale } from "./locale-provider";
import type { MessageKey } from "@/content/i18n";

/**
 * Index is deliberately absent: the signature on the left is the home link,
 * so a separate "Index" tab was a second control for the same destination.
 */
const ROUTES: { href: string; key: MessageKey }[] = [
  { href: "/work", key: "nav.work" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  // Track which route the panel was opened on. Navigating away derives it
  // shut during render, rather than syncing it closed in an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (v: boolean) => setOpenedAt(v ? pathname : null);

  const [lifted, setLifted] = useState(false);

  /**
   * The underline marks a tab the visitor *chose*, not merely the page they
   * happen to be on — so it is driven by clicks, not by `pathname`. Arriving
   * at /work from a card, a footer link or a shared URL leaves every tab
   * quiet; clicking "Work" in the nav lights it, and it clears as soon as
   * they land anywhere else.
   *
   * Storing the href means the comparison below derives the answer during
   * render: the mark survives only while the visitor is still on the page
   * they picked. No effect, no extra paint, no stale highlight.
   */
  const [chosen, setChosen] = useState<string | null>(null);
  const activeChoice =
    chosen && pathname.startsWith(chosen) ? chosen : null;

  /**
   * Condense with hysteresis, sampled once per frame.
   *
   * A bare `scrollY > 24` flipped the state seven times during a few pixels of
   * scroll wobble around the threshold — a trackpad, a phone's momentum, or a
   * hand resting on a wheel all jitter across a single boundary, and each flip
   * restarted a 620ms transition. Two separate edges (condense at 72,
   * expand at 16) mean the state cannot oscillate: leaving one state does not
   * immediately re-enter the other.
   *
   * Reading scroll inside rAF also keeps this off the scroll event's critical
   * path, so the listener never delays a frame.
   */
  useEffect(() => {
    const CONDENSE_AT = 72;
    const EXPAND_AT = 16;
    let raf = 0;
    let queued = false;

    const sample = () => {
      queued = false;
      const y = window.scrollY;
      setLifted((was) => (was ? y > EXPAND_AT : y > CONDENSE_AT));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lock scroll while the panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Condensed once scrolled: the bar contracts into a floating pill.
  const pill = lifted && !open;

  return (
    <header
      className="nav-shell fixed inset-x-0 top-0 z-50 px-3 md:px-6"
    >
      <div
        data-pill={pill}
        data-open={open}
        /* Padding and max-width are STATIC — the pill is produced by the skin
           layer behind this row, so nothing here re-lays-out during scroll. */
        className="nav-bar mx-auto flex w-full max-w-[64rem] items-center justify-between px-5 py-3 md:px-7"
      >
        {/* One painted surface for both states — see globals.css. It never
            disappears between them, and the header never changes size. */}
        <span aria-hidden className="nav-skin" />

        <HomeLink
          className="relative -my-2 flex items-center py-2 transition-opacity duration-[var(--hover)] hover:opacity-60"
          ariaLabel={`${studio.name} — ${t("nav.home")}`}
          onNavigate={() => setChosen(null)}
        >
          <span className="nav-mark block">
            <Signature width={112} tight />
          </span>
        </HomeLink>

        {/* Desktop */}
        <nav
          aria-label="Primary"
          className={`nav-tabs relative hidden items-center md:flex ${pill ? "gap-2" : "gap-10"}`}
        >
          {ROUTES.map((r) => {
            const onPage = pathname.startsWith(r.href);
            const marked = activeChoice === r.href;
            return (
              <Link
                key={r.href}
                href={r.href}
                aria-current={onPage ? "page" : undefined}
                onClick={() => setChosen(r.href)}
                className={`group relative flex items-baseline transition-[padding] duration-[var(--hover)] ${
                  pill ? "px-3 py-1.5" : ""
                }`}
              >
                <span
                  className={`text-[0.95rem] font-bold transition-[color,opacity] duration-[var(--hover)] ${
                    marked
                      ? "text-umber opacity-100"
                      : "text-taupe opacity-70 group-hover:text-umber group-hover:opacity-100"
                  }`}
                >
                  {t(r.key)}
                </span>
                <span
                  className={`absolute left-0 h-px w-full origin-left bg-umber transition-transform duration-[var(--hover)] ease-[var(--ease)] ${
                    pill ? "-bottom-0.5" : "-bottom-1.5"
                  } ${marked ? "scale-x-100" : "scale-x-0"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
        >
          <span className="sr-only">
            {open ? t("nav.closeMenu") : t("nav.openMenu")}
          </span>
          <span
            className={`block h-px w-6 bg-umber transition-transform duration-[var(--hover)] ease-[var(--ease)] ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-umber transition-transform duration-[var(--hover)] ease-[var(--ease)] ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-[var(--rule)] bg-bone md:hidden"
      >
        <nav aria-label="Primary" className="flex flex-col px-6 pb-8 pt-2">
          {ROUTES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setChosen(r.href)}
              className="flex items-baseline border-b border-[var(--rule)] py-5 last:border-0"
            >
              <span className="text-[1.6rem] font-bold tracking-[-0.02em] text-umber">
                {t(r.key)}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
