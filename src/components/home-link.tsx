"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The signature, wherever it appears, is the way home.
 *
 * Two behaviours in one control:
 *   - on any other page, it navigates to "/" like a normal link;
 *   - already on "/", it scrolls back to the top instead of re-requesting a
 *     page the visitor is already looking at.
 *
 * It stays a real <Link href="/"> in both cases, so middle-click, ⌘-click and
 * "open in new tab" keep working and a crawler still sees a link to the home
 * page — a <button> would have thrown all of that away for the sake of one
 * scroll.
 */
export function HomeLink({
  children,
  className = "",
  ariaLabel,
  onNavigate,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const atHome = pathname === "/";

  return (
    <Link
      href="/"
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (!atHome) return;

        // Let modified clicks (new tab, new window, download) behave natively.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }

        e.preventDefault();

        // `scroll-behavior: smooth` on <html> covers this, but a visitor who
        // asked for reduced motion should get an instant jump instead.
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

        // Move focus somewhere sensible for keyboard and screen-reader users;
        // scrolling alone leaves focus stranded at the bottom of the page.
        const main = document.getElementById("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
          main.removeAttribute("tabindex");
        }
      }}
    >
      {children}
    </Link>
  );
}
