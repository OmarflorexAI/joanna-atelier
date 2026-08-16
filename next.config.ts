import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev indicator ("N" badge) in the bottom-left.
  // Dev-only UI — it never shipped to production, but it obscures the
  // layout while reviewing.
  devIndicators: false,

  images: {
    // Next 16 requires every `quality` value used in the app to be declared
    // here. These are the high-quality tiers used for piece photography.
    qualities: [75, 88, 90],
  },

  // Don't advertise the framework and version to scanners.
  poweredByHeader: false,

  /**
   * Security headers.
   *
   * The site is static and has one POST route, so the surface is small — but
   * these are free and prevent whole classes of problem:
   *
   * - CSP stops an injected <script> from executing at all. `'unsafe-inline'`
   *   is required for scripts because the layout inlines a one-line snippet to
   *   set the `.js` class before first paint, and Next injects inline bootstrap
   *   scripts of its own; it is required for styles because Tailwind and
   *   several components emit inline `style` attributes.
   * - frame-ancestors 'none' blocks clickjacking (the modern X-Frame-Options).
   * - Referrer-Policy keeps the full URL off outbound requests to Instagram.
   * - Permissions-Policy switches off APIs the site never uses, so a
   *   compromised script cannot reach a visitor's camera or location.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      // next/font self-hosts its files, so no external font origin is needed.
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
