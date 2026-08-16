import Link from "next/link";
import { RuleDraw } from "./reveal";

/** Primary action — solid jade. Used sparingly; hierarchy matters. */
export function ButtonPrimary({
  children,
  href,
  type,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const cls = `btn-rise btn-rise-solid disabled:cursor-not-allowed disabled:opacity-55 ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

/** Secondary — outline only. */
export function ButtonGhost({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`btn-rise ${className}`}
    >
      {children}
    </Link>
  );
}

/** Text link with an arrow that steps out on hover. */
export function ArrowLink({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 border-b border-[var(--rule-strong)] pb-1.5 text-[0.95rem] text-umber transition-colors duration-[var(--hover)] hover:border-umber ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-[var(--hover)] ease-[var(--ease)] group-hover:translate-x-1"
      >
        ↗
      </span>
    </Link>
  );
}

/** Small metadata chip. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--rule)] px-4 py-1.5 text-[0.78rem] font-normal text-taupe">
      {children}
    </span>
  );
}

/** Section header: numbered, ruled, with an optional aside. */
export function SectionHead({
  title,
  aside,
}: {
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <RuleDraw />
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 className="t-section">{title}</h2>
        {aside ? <span className="t-micro text-silt">{aside}</span> : null}
      </div>
    </div>
  );
}
