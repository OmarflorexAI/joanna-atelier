import type { Metadata } from "next";
import {
  DM_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Schibsted_Grotesk,
} from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LocaleProvider } from "@/components/locale-provider";
import { LanguageSwitch } from "@/components/language-switch";
import { SkipLink } from "@/components/skip-link";
import { studio } from "@/content/studio";

/**
 * Display face — Instrument Serif.
 *
 * Ships in a single 400 weight with a true italic, which suits this site:
 * the display sizes are large enough that weight is carried by scale, not by
 * stroke, and a one-weight family removes the temptation to fake hierarchy
 * with bolds. Its high contrast and tight, modern serifs hold up at the
 * 9.5rem statement size without the fragility Cormorant had at that scale.
 */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Body / UI face — DM Sans, carried at 700.
 *
 * Optical sizing is automatic, so the same family stays comfortable from an
 * 11px micro-label up to a button. Bold is the requested voice: it gives the
 * UI a firm, contemporary counterweight to the serif rather than competing
 * with it. Note the pairing rule this sets up — the serif states, the sans
 * instructs. See globals.css, where body copy stays at 400 for readability
 * and only labels, buttons and nav take the bold.
 */
const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Header face — Schibsted Grotesk.
 *
 * Commissioned by Schibsted (Scandinavia's largest media group) for editorial
 * publishing, so news-and-magazine hierarchy is its actual design brief rather
 * than a repurposing. Neo-grotesque with open apertures and a variable weight
 * axis to 900: neutral enough that it does not fight Instrument Serif, with
 * enough character that a header does not read as a default.
 *
 * Headers only. DM Sans stays on body, buttons, nav and labels — it is better
 * at small sizes, and the change of face between header and body is itself a
 * layer of hierarchy.
 */
const heading = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: {
    default: `${studio.name} — ${studio.discipline}`,
    template: `%s — ${studio.name}`,
  },
  description: studio.metaDescription,
  openGraph: {
    title: `${studio.name} — ${studio.discipline}`,
    description: studio.metaDescription,
    type: "website",
    locale: "en_US",
    siteName: studio.name,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${heading.variable} ${mono.variable}`}
    >
      <head>
        {/* Marks JS as available before first paint, so scroll reveals can
            hide content only when they are able to bring it back. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <LocaleProvider>
          <SkipLink />
          <SmoothScroll />
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
          <LanguageSwitch />
        </LocaleProvider>
      </body>
    </html>
  );
}
