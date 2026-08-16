"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./locale-provider";
import type { MessageKey } from "@/content/i18n";

/**
 * FAQ accordion.
 *
 * Height animates via `grid-template-rows: 0fr → 1fr`, which transitions
 * smoothly without needing a measured pixel height — so an answer can be
 * any length and still open cleanly.
 *
 * Progressive enhancement: every answer stays in the DOM, so the content is
 * crawlable and findable with ctrl-F, and deep links like /contact#pricing
 * open the matching row on load. Under `prefers-reduced-motion` the panel
 * snaps instead of sliding.
 */

/** Only the id travels; the question and answer are looked up per locale. */
export type FaqItem = { id: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const { t } = useLocale();
  const q = (id: string) => t(`faq.${id}.q` as MessageKey);
  const a = (id: string) => t(`faq.${id}.a` as MessageKey);
  // Allow several rows open at once — visitors compare lead time against
  // pricing, and forcing one closed to read another is a small cruelty.
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  // Open the row named by the URL hash, on load and on later hash changes.
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      if (items.some((f) => f.id === id)) {
        setOpen((prev) => new Set(prev).add(id));
        // Let the panel expand before scrolling to it.
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ block: "center" });
        });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // Clipboard can be blocked; fall back to just setting the hash.
      window.location.hash = id;
    }
  };

  return (
    <div className="mt-14 max-w-[68rem] border-t border-[var(--rule)]">
      {items.map((f, i) => {
        const isOpen = open.has(f.id);
        return (
          <div
            key={f.id}
            id={f.id}
            className="scroll-mt-28 border-b border-[var(--rule)]"
          >
            <h3>
              <button
                type="button"
                onClick={() => toggle(f.id)}
                aria-expanded={isOpen}
                aria-controls={`${f.id}-panel`}
                className="group flex w-full items-center gap-6 py-7 text-left"
              >
                <span className="t-micro w-8 shrink-0 tabular-nums text-silt transition-colors duration-[var(--hover)] group-hover:text-jade">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="t-section flex-1 transition-colors duration-[var(--hover)] group-hover:text-jade"
                  style={{ fontSize: "clamp(1.15rem,2.2vw,1.5rem)" }}
                >
                  {q(f.id)}
                </span>

                {/* Plus → minus: one stroke rotates and fades out. */}
                <span
                  aria-hidden
                  className="relative ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--rule-strong)] transition-colors duration-[var(--hover)] group-hover:border-jade"
                >
                  <span
                    className={`absolute h-px w-3.5 bg-umber transition-colors duration-[var(--hover)] group-hover:bg-jade`}
                  />
                  <span
                    className={`absolute h-px w-3.5 bg-umber transition-all duration-[var(--hover)] ease-[var(--ease)] group-hover:bg-jade ${
                      isOpen ? "rotate-0 opacity-0" : "rotate-90 opacity-100"
                    }`}
                  />
                </span>
              </button>
            </h3>

            {/* 0fr → 1fr animates height without measuring it. */}
            <div
              id={`${f.id}-panel`}
              role="region"
              aria-labelledby={f.id}
              className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease)] motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div
                  className={`pb-8 pl-14 pr-4 transition-opacity duration-500 ease-[var(--ease)] motion-reduce:transition-none ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="t-body max-w-[62ch]">{a(f.id)}</p>

                  <button
                    type="button"
                    onClick={() => copyLink(f.id)}
                    className="t-micro mt-5 inline-flex items-center gap-2 text-silt transition-colors duration-[var(--hover)] hover:text-umber"
                  >
                    {copied === f.id ? "Link copied" : "Copy link to this answer"}
                    <span
                      aria-hidden
                      className={`transition-transform duration-[var(--hover)] ${
                        copied === f.id ? "scale-110" : ""
                      }`}
                    >
                      {copied === f.id ? "✓" : "↗"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
