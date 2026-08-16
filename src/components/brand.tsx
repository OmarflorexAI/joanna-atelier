/**
 * Johanna — brand marks. Original design for this project.
 *
 * Concept: a single confident "J" whose descender curve is crossed by one
 * fine diagonal — a needle passing through the hook of the letter, the
 * stitch that closes a hem. One letter, one thread, nothing decorative.
 *
 * Drawn on a 48×48 grid. Everything uses currentColor so the marks invert
 * cleanly on any surface without a second colour variant.
 */

type MarkProps = {
  /** Rendered size in px. */
  size?: number;
  className?: string;
  /** Provide when the mark stands alone with no adjacent "Johanna" text. */
  title?: string;
};

export function Monogram({ size = 40, className = "", title }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {title ? <title>{title}</title> : null}

      {/* The J: a tapered stem falling into an open hook.
          Drawn as a filled form so the weight can modulate like a
          real serif letter rather than a uniform stroke. */}
      <path
        d="M31.4 8.5
           h5.2
           v20.9
           c0 6.4-4.6 10.6-11.3 10.6
           c-5.6 0-9.7-2.9-11.1-7.6
           l4.7-1.9
           c1 3.1 3.3 4.8 6.4 4.8
           c3.7 0 6.1-2.4 6.1-6.3
           z"
        fill="currentColor"
      />

      {/* The stitch: a level thread running through the hook of the J,
          broken where it passes behind the letter. Horizontal, so it
          reads as a hem line rather than a strikethrough. */}
      <path
        d="M7.5 34.2 H13.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M37.8 34.2 H43.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/*
 * The Isologo (mark + typeset "Johanna" wordmark) was removed once the
 * signature took over the wordmark role. The nav now carries the bare
 * Monogram and the footer closes with <Signature />, so a third lockup
 * would only be a third way to say the same name.
 */
