# Progress Checkpoint

> Last updated: 2026-08-15 by context-checkpoint skill
> Context usage at time of checkpoint: ~80%

## Project Overview

Online catalog / portfolio for **Joanna**, a Dominican Republic designer of custom,
hand-made garments whose clients include artists and celebrities. Primary traffic
arrives from her Instagram bio link, on a phone. Repo: `C:\Users\admin\johanna_online_catalog`.
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, static-first, targeting Vercel.

Project rules live in [CLAUDE.md](CLAUDE.md); design context in [.impeccable.md](.impeccable.md);
scope and decision record in [PRD.md](PRD.md). **Do not duplicate those here — read them.**

## What Has Been Accomplished

### Foundation

- **1.** **Docs written first.** `PRD.md`, `CLAUDE.md`, `.impeccable.md` via the
   `teach-impeccable` skill.
- **2.** **Platform decision: web app, not native.** Rationale in `PRD.md` §4 — a download
   step between an IG bio link and the work would kill the funnel.
- **3.** **Scaffolded** Next.js 16.3.1 into the existing dir (temp dir + move, because the
   docs already existed). Installed `resend`.
- **4.** **Token layer** in `src/app/globals.css`: warm neutrals + one jade accent, exposed
   to Tailwind via `@theme inline`. Light mode only.
- **5.** **All 5 routes built**: `/`, `/work`, `/work/[slug]` (8 pieces), `/about`, `/contact`,
   plus `/collection`, `/icon`, `404`, and `POST /api/contact`.
- **6.** **Contact form + Resend route** with shared validation (`src/lib/contact-schema.ts`),
   honeypot, in-memory rate limit (5/hr), animated submit state. Verified end-to-end:
   422 field errors, 422 enum errors, honeypot silently accepts, 429 after 5 attempts,
   200 success with the enquiry logged when Resend is unconfigured.
- **7.** **Fixed: content was gated behind JS.** Scroll reveals hid 17 sections until JS ran.
   Inverted to progressive enhancement — visible by default, hidden only once a `.js`
   class confirms JS can restore it. Verified by screenshotting with JS disabled.
- **8.** **Fixed: hydration mismatch** from that `.js` class → `suppressHydrationWarning`.
- **9.** **19 stock photos** in `public/pieces/` at 1600×2000 q85. Attribution in
   `public/pieces/CREDITS.md`. **8 pieces** total in `src/content/pieces.ts`.

### Components installed from third parties (all adapted — see "Active Decisions")

- **10.** **Collection Surfer** at `src/components/ui/collection-surfer.tsx`, mounted at
  `/collection` with its own layout hiding global chrome.
- **11.** **Skiper49 coverflow carousel** via `npx shadcn add @skiper-ui/skiper49` (required
  creating `components.json`). Wrapped by `src/components/work-carousel.tsx`.
- **12.** **Signature wordmark** (`src/components/signature.tsx`) — "Joanna" as six static SVG
  outline paths, one per letter. Installed from `@componentry/signature` but
  **substantially replaced**: it loaded a commercial font (Lastoria) hotlinked from
  `componentry.fun` at runtime via `opentype.js`. Licence reasoning in
  [docs/SIGNATURE.md](docs/SIGNATURE.md).
- **13.** **Nav pill** adapted from watermelon `navigation-5`, which **would not install** (its
  `registryDependencies` point at a `navigation` primitive absent from the shadcn
  registry). Took the pill geometry; dropped its five Radix primitives and six mega-menu
  panels, which exist for dropdown content this four-page site does not have.
- **14.** **Raised button** (`.btn-raised`) from a supplied CSS snippet — mechanic kept exactly
  (lip inset, −2px hover, +2px active, `will-change`), palette retoned from its cool
  `#36395a`/`#d6d6e7` to bone/umber/linen, radius 4px → 2px to match cards.

### Typography (current state: 4 families)

- **15.** **Instrument Serif** (display) — hero, piece titles, closing CTA only. Ships one
  weight, so display weights are 400, not 300 (300 would be synthesised and ragged).
- **16.** **Schibsted Grotesk** (`.t-section`) — section headers. Commissioned by Schibsted for
  editorial publishing. Chosen over Bricolage Grotesque (too opinionated, competes with
  the serif) and over keeping DM Sans (reads as a default).
- **17.** **DM Sans 700** — body/UI: nav, buttons, chips, `.t-label`. Body copy stays 400.
- **18.** **JetBrains Mono** — micro-labels only.
- **19.** Pairing rule in CLAUDE.md: **the serif states, the sans instructs.**

### Interaction and layout

- **20.** **Readability pass.** `--taupe` → `#5A5149` (7.3:1, AAA); `--silt` → `#786E64` (4.7:1, AA).
- **21.** **FAQ accordion** — `grid-template-rows: 0fr→1fr`, multiple rows open, deep links
  auto-open, copy-link button. Verified deep link opens `#pricing`.
- **22.** **Typewriter** (`src/components/typewriter.tsx`) — types on scroll-into-view. Text is
  server-rendered and only blanked once JS confirms it can type it back; a hidden ghost
  copy holds final height so nothing shifts; animating copy is `aria-hidden` with a
  static `sr-only` copy. Honours `prefers-reduced-motion` — **this is why it looks inert
  in headless browsers, which default to `reduce`**. Use `Emulation.setEmulatedMedia`.
- **23.** **Copy: "commission" removed sitewide** → "piece" / "enquiry" / "work" per context.
- **24.** **Work pages**: "Materials" and "Hours by hand" removed; facts column → `0.5fr`.
  CTA is `ButtonGhost` "Get in touch". Home keeps its "Hours shown" stat.
- **25.** **Signature in nav (112px) and footer (150px)**, both linking home, both tight-cropped.
  Quality: dropped `Math.round` on SVG height (shifted aspect ratio ~0.5px at nav size);
  added `shapeRendering="geometricPrecision"` for the hairline script joins.
- **26.** **"Index" tab removed** — the signature already links home.
- **27.** **Nav underline is click-driven, not route-driven.** `chosen` state stores the clicked
  href; arriving any other way (card, footer, shared URL) leaves every tab dimmed at 0.7
  with hover intact.
- **28.** **`<HomeLink>`** — stays a real `<Link href="/">` (middle-click, crawling); on "/" it
  preventDefaults, smooth-scrolls to top, moves focus to `#main`. Reduced-motion jumps.
- **29.** **Home gallery is image-driven** (arrows removed at user request). Off-centre slide is
  a `<button>` that centres itself; the centred slide is a `<Link>` to its piece.

### Internationalisation

- **30.** **Spanish translation** — `src/content/i18n.ts`, flat EN/ES dictionary (152 keys) typed
  so a missing ES key is a compile error. `LocaleProvider` uses `useSyncExternalStore`
  (server snapshot always "en" to avoid hydration mismatch), persists to localStorage,
  falls back to `navigator.language`. Floating `<LanguageSwitch />`. Validation and API
  errors travel as message KEYS resolved client-side, so the server never picks a
  language. **All ES copy is a developer draft — Joanna must review it.**
- **31.** **Translation review workflow** — `scripts/export-translations.mjs` exports all 152
  strings to CSV she can edit in Excel/Sheets, and imports her edits back, rewriting only
  the Spanish half. Round-trip verified. See [docs/TRANSLATION.md](docs/TRANSLATION.md).

### Bugs found by measuring (each was invisible in markup)

- **32.** **Carousel slides weren't links** → each slide is a real `<Link>`, `draggable={false}`
  so native image-drag doesn't fight Swiper.
- **33.** **Slides untappable on mobile** — at the old width both neighbours' centres fell
  *outside* a 390px viewport (next at x=409, prev at x=−19). Narrowed to
  `clamp(150px,43vw,290px)`. Since images are the only control, this was a total
  blocker on the primary device.
- **34.** **Gallery prev-click only worked once.** Swiper ran out of prepended loop clones —
  `slidePrev` stopped after one step while `slideNext` kept working. Fix:
  `loopAdditionalSlides={2}`. Also replaced `slideToLoop(index)` (absolute jump, spun
  the long way) with shortest-path delta + `slideNext`/`slidePrev`. Verified
  0→7→6→5→4→3 backwards, 3→4→5→6→7→0 forwards, at 1280 and 390.
- **35.** **Nav glitched on scroll — fixed in two rounds.**
  *Round 1:* the header animated padding, so its HEIGHT moved through 27–28 distinct
  values while content scrolled beneath it. Shell became a constant `--nav-h`.
  **distinctHeights 27 → 1, heightJumps 2 → 0.**
  *Round 2 (the user still saw glitching):* three further defects, each measured —
  (a) `scrollY > 24` with no hysteresis flipped `data-pill` **7 times** on a few pixels
  of scroll wobble, restarting the 620ms transition each time. Now two edges
  (condense at 72, expand at 16) sampled inside rAF: **7 flips → 0**.
  (b) Cross-fading two skins left a frame where neither was opaque
  (**minCombinedOpacity 0**) — a hole in the surface. One skin now morphs between
  states: **combined opacity is 1 throughout**.
  (c) Two stacked `backdrop-filter` layers double-blurred while both were partly
  visible. **Now zero stacked layers** (one skin, blur only in the pill state).
- **36.** **Drag tuned**: `speed={620}`, `threshold={4}`, `touchRatio={1.15}`, `followFinger`,
  `resistanceRatio={0.72}`, `shortSwipes`. A 70px flick commits. Both directions verified.
- **37.** **Responsive verified**: zero horizontal overflow at 360/390/768 on all routes,
  measured via CDP after every layout change.

## Current State

**Working.** `npm run lint` and `npm run build` both clean. 17 routes prerender.
Dev server may still be running — kill with `Get-Process node | Stop-Process -Force`.

Dependencies: `next 16.3.1`, `react 19.2.8`, `framer-motion`, `swiper`, `lucide-react`,
`clsx`, `tailwind-merge`, `resend`.

**Known gaps (deliberate, not bugs):**

- **Stock photos are wrong for the brand.** A saturated red gown, pink joggers, a purple
  studio backdrop, a men's leather jacket — not couture-atelier subjects, and the copy
  under them describes something else. The `.plate` CSS grade softens them but **cannot
  fix wrong subject matter**. This gap got *more* visible after the Instrument Serif
  switch — the typography is now elegant enough that the stock photography clashes.
- **`/collection` (Collection Surfer)**: cards are `<div>`s not links, so no piece is
  reachable from it and it isn't keyboard-navigable; no `prefers-reduced-motion` path.
  Left as the component ships because the user asked for it specifically.
- Static captures show blank blocks under "Standing" and below the contact form — these
  are scroll reveals that don't fire in a screenshot. Content **is** server-rendered.

## What Comes Next

1. **Get real photography from Joanna.** Single biggest quality gap. Replace every file in
   `public/pieces/` at 4:5, same filenames, then update `alt` in `src/content/pieces.ts`.
2. **Send Joanna the Spanish for review.** `node scripts/export-translations.mjs` →
   `translations.csv`; she edits column D only; `--import` it back. Instructions in
   [docs/TRANSLATION.md](docs/TRANSLATION.md). Every ES string is currently a developer
   draft, not hers.
3. **Resolve the `TODO(joanna)` markers** — grep for them. Real bio, Instagram handle,
   email, domain, FAQ answers (lead times/pricing/fittings are invented), process steps.
4. **Ask Joanna for her actual signature** — sign "Joanna" in black ink on white paper,
   photograph straight-on, vectorise, drop into the `GLYPHS` array in
   `src/components/signature.tsx`. Steps in `docs/SIGNATURE.md`. The current mark is drawn
   from an OFL font and is safe to ship, but her real hand would be unambiguously hers.
5. **Written permission for any named celebrity/artist credit** before publishing.
   `Piece.client` exists but is deliberately unused on every piece.
6. **Optional: real `/es` routes.** Scoped in [docs/I18N-ROUTING.md](docs/I18N-ROUTING.md)
   against this version's actual APIs (`next/root-params`, `proxy.ts` — **not** the older
   `middleware` pattern). Roughly a day. Do it when Joanna needs a shareable Spanish link
   or Spanish SEO starts to matter.
7. Consider fixing `/collection` accessibility (links + reduced-motion) — offered, not done.
8. Deploy to Vercel; set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM`.

## Active Decisions & Context

- **User's stated priorities, in their words:** "no slop allowed", "light mode", "I want
  all of them to be perfectly placed", "ensure that the entire site is responsive since a
  lot of people will reach out through their phones", "all images must be high quality",
  "the padding must be impeccable".
- **The client explicitly rejected the Lannino palette.** Structure was adapted; colour
  was not. Never reintroduce cream/ember.
- **Numbered nav (`01/02/03`) was tried and removed at user request** — don't add it back.
- **The user repeatedly supplies third-party components and wants them installed as given.**
  Install them, but adapt: local assets over hotlinks, own palette over bundled themes, add
  links/keyboard access where the component omits them. **Then say plainly what changed and
  why.** Twice now a supplied component would not install at all (watermelon `navigation-5`,
  `@componentry/signature` pulling a commercial font) — fetch the registry JSON directly and
  take what is useful.
- **Mobile is the primary case**, not an adaptation — traffic is an IG bio link on a phone.
- The contact form's submit button is deliberately NOT routed through the shared button
  component — it has a bespoke loading animation the fill would fight.
- The footer CTA hides itself on `/contact` (it would link to the current page).

### Verification discipline (this project has burned several hours on false readings)

- **Verify by measuring, not by reading markup.** CDP scripts in the scratchpad are the
  pattern: `shot.mjs` (screenshot with real viewport), `navjank.mjs` (per-frame nav
  geometry), `prevbug.mjs` (carousel index stepping), `drag.mjs`, `final.mjs`.
- **Synthetic DOM events do NOT drive React handlers.** Use `Input.dispatchMouseEvent`.
- **Headless browsers default to `prefers-reduced-motion: reduce`.** Anything honouring it
  will look broken. Always `Emulation.setEmulatedMedia` to `no-preference`.
- **Edge's `--window-size` does not set the layout viewport.** Use CDP
  `Emulation.setDeviceMetricsOverride`, or a "mobile" capture is really a cropped desktop
  one. This produced a false "text overflows on mobile" report.
- **Never proxy the dev server to inject probes** — it strips React hydration and makes
  every handler look dead. Drive the real origin over CDP.
- Add `--disable-extensions`; a browser extension toolbar has polluted captures.
- Let animations settle before asserting (signature reveal ≈ 900ms + 6×90ms stagger).

## Key Files

| Path | Description |
|---|---|
| `CLAUDE.md` | Stack, design tokens, conventions. Read first. |
| `.impeccable.md` | Design context, 5 principles, anti-references. |
| `PRD.md` | Goals, IA, decision record. |
| `src/app/globals.css` | Tokens, type scale, `.t-section`, `.btn-raised`, nav condense, reveals, typewriter. |
| `src/app/layout.tsx` | 4 fonts, providers, nav/footer. |
| `src/components/site-nav.tsx` | Pill-on-scroll nav, click-driven underline. |
| `src/components/home-link.tsx` | Logo link: navigates, or scrolls to top when already home. |
| `src/components/signature.tsx` | "Joanna" wordmark; static outline paths, `tight` crop option. |
| `src/components/work-carousel.tsx` | Home gallery wrapper around Skiper49. |
| `src/components/ui/skiper-ui/skiper49.tsx` | Coverflow carousel; two-stage slide click, loop buffer. |
| `src/content/pieces.ts` | The 8 pieces. CMS-swappable shape. |
| `src/content/studio.ts` | Studio facts, credits. Many `TODO(joanna)`. |
| `src/content/i18n.ts` | EN/ES dictionary (152 keys). All ES needs Joanna's review. |
| `src/components/locale-provider.tsx` | Locale state, persistence, `t()`. |
| `src/components/language-switch.tsx` | Floating EN/ES popover switch. |
| `src/components/t.tsx` | `<T>` / `<TCategory>` / `<SectionHeadT>` — translated leaves in Server Components. |
| `src/components/typewriter.tsx` | Scroll-triggered typing effect. |
| `src/components/faq-accordion.tsx` | FAQ dropdown with deep-link support. |
| `src/components/contact-form.tsx` | The form; bespoke submit animation. |
| `src/lib/contact-schema.ts` | Shared client+server validation; returns message KEYS. |
| `src/app/api/contact/route.ts` | Resend delivery, honeypot, rate limit. |
| `scripts/export-translations.mjs` | EN/ES ⇄ CSV for Joanna's review. |
| `docs/TRANSLATION.md` | How to run the Spanish review. |
| `docs/I18N-ROUTING.md` | What upgrading to `/es` routes involves. |
| `docs/SIGNATURE.md` | Signature provenance, OFL licence reasoning, how to swap in her handwriting. |
| `public/pieces/CREDITS.md` | Image attribution + how to replace. |

## How to Resume

Read `CLAUDE.md` and `.impeccable.md` first — they hold the design rules and are not
duplicated here. Then continue with task #1 in "What Comes Next".

Run `npm run dev` (port 3000). **Before claiming anything works, verify it by measuring.**
Read the "Verification discipline" section above before writing any browser probe — every
trap listed there has already cost real time in this project, and several produced
confident-but-wrong bug reports that had to be retracted.

Two things to be careful about: the user cares a lot about responsiveness and padding, so
re-measure overflow at 360/390px after any layout change; and when they hand you a
third-party component, install it as given but adapt it to the palette, `next/image`, and
accessibility — then say plainly what you changed and why.
