import Link from "next/link";
import { Monogram } from "@/components/brand";

/**
 * The surfer is a fixed, full-viewport experience, so this route hides the
 * site chrome: a nav bar would sit behind the scene, and the footer would be
 * unreachable behind the scroll runway.
 *
 * The single fixed exit link keeps the visitor from being trapped — without
 * it the only way back is the browser's back button.
 */
export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <style>{`
        /* Hide the global chrome for this route only. */
        body > header, body > footer { display: none !important; }
      `}</style>

      <Link
        href="/work"
        className="fixed left-6 top-6 z-[60] inline-flex items-center gap-2.5 rounded-full border border-bone/25 bg-umber/60 px-5 py-2.5 text-bone backdrop-blur-sm transition-colors duration-[var(--hover)] hover:border-bone/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
      >
        <Monogram size={18} />
        <span className="t-micro">Exit to catalog</span>
      </Link>

      {children}
    </div>
  );
}
