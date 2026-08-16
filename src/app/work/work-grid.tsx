"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, type Category, type Piece } from "@/content/pieces";
import { PieceCard } from "@/components/piece-card";
import { useLocale } from "@/components/locale-provider";
import type { MessageKey } from "@/content/i18n";

type Filter = Category | "All";

export function WorkGrid({ pieces }: { pieces: Piece[] }) {
  const { t } = useLocale();
  const [filter, setFilter] = useState<Filter>("All");

  // "All" has its own key; every other filter is a category label.
  const labelFor = (f: Filter) =>
    f === "All" ? t("work.all") : t(`cat.${f}` as MessageKey);

  const counts = useMemo(() => {
    const m = new Map<Filter, number>([["All", pieces.length]]);
    for (const c of CATEGORIES) {
      m.set(c, pieces.filter((p) => p.category === c).length);
    }
    return m;
  }, [pieces]);

  // Only offer filters that actually have work behind them.
  const available = useMemo(
    () => (["All", ...CATEGORIES] as Filter[]).filter((f) => (counts.get(f) ?? 0) > 0),
    [counts],
  );

  const shown = useMemo(
    () => (filter === "All" ? pieces : pieces.filter((p) => p.category === filter)),
    [filter, pieces],
  );

  return (
    <>
      <div
        role="group"
        aria-label={t("work.filterLabel")}
        className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-[var(--rule)] pt-8"
      >
        {available.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`group inline-flex items-baseline gap-2 rounded-full border px-5 py-2.5 text-[0.85rem] font-bold transition-colors duration-[var(--hover)] ease-[var(--ease)] ${
                active
                  ? "border-umber bg-umber text-bone"
                  : "border-[var(--rule)] text-taupe hover:border-umber hover:text-umber"
              }`}
            >
              {labelFor(f)}
              <span
                className={`text-[0.68rem] tabular-nums ${
                  active ? "text-bone/60" : "text-silt"
                }`}
              >
                {counts.get(f)}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {t("work.showing")} {shown.length}{" "}
        {shown.length === 1 ? t("work.piece") : t("work.pieces")}
        {filter === "All" ? "" : ` ${t("work.in")} ${labelFor(filter)}`}.
      </p>

      {/* Strict grid: every card starts on the same baseline. All covers
          share a 4:5 ratio, so rows line up exactly. */}
      <div className="mt-16 grid grid-cols-1 items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <PieceCard key={p.slug} piece={p} priority={i < 3} />
        ))}
      </div>
    </>
  );
}
