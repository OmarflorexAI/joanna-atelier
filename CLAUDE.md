@AGENTS.md

# Joanna — Online Catalog / Portfolio

Catalog and portfolio for **Joanna**, a Dominican Republic designer of custom, hand-made
garments whose clients include artists and celebrities. Primary traffic arrives from her
Instagram bio link, on a phone.

- [PRD.md](PRD.md) — goals, scope, IA, decision record.
- [.impeccable.md](.impeccable.md) — design context, principles, anti-slop rules.
  **Read this before any design work.**

## Stack

Next.js 16 (App Router) + React 19 + TypeScript, Tailwind v4, static-first, Vercel.
Resend for contact delivery. Content is local typed files in `src/content/` — no CMS.

Node 24 / Windows 11 / PowerShell. `jq` and `gh` are not installed.

## Design system

Structure (index-style nav, statement typography, oversized closing CTA, generous
vertical rhythm) is adapted from the client-supplied Lannino system. Its **palette was
explicitly rejected by the client** and replaced below; its spacing, radius, and motion
scales were sound and were retained.

Tokens are defined once in [src/app/globals.css](src/app/globals.css) and exposed to
Tailwind via `@theme inline`. **Never hard-code a hex outside that file.**

### Color — warm neutrals + one jewel accent

| Token | Hex | Role |
|---|---|---|
| `--bone` | `#FAF8F5` | Default page background. |
| `--oat` | `#EFEAE1` | Recessed panels, image beds. |
| `--linen` | `#E4DDD2` | Rare third surface. |
| `--umber` | `#241F1B` | Primary text. |
| `--taupe` | `#5A5149` | Body copy, secondary text. 7.3:1 on bone — clears AAA. |
| `--silt` | `#786E64` | Micro-labels, metadata. 4.7:1 on bone — passes AA. |
| `--jade` | `#1F4D3D` | The one accent: CTAs, focus rings, active chips. |
| `--jade-deep` | `#163629` | Accent hover. |

- Hairlines: `--rule`, `--rule-strong`.
- **Never more than two surfaces per view.** One accent, used sparingly.
- Light mode only. No pure black, no pure white, no grays outside this list.

### Typography

Four families via `next/font`: **Instrument Serif** (display, + italic accent),
**Schibsted Grotesk** (section headers), **DM Sans** (body/UI), **JetBrains
Mono** (micro-labels only).

Schibsted Grotesk was commissioned by Schibsted, Scandinavia's largest media
group, for editorial publishing — news and magazine hierarchy is its actual
design brief. It sits on `.t-section` only; the change of face between header
and body is itself a layer of hierarchy.

The pairing rule: **the serif states, the sans instructs.** The serif is
rationed to three places — the hero, piece titles, and the closing CTA.
Section headers use `.t-section` (DM Sans 700); using the serif for those too
made it ordinary, and each appearance now lands harder for being rarer. Instrument Serif carries
headlines, statements and piece titles — it ships a single 400 weight, so hierarchy
comes from scale, never from a synthesised bold. DM Sans carries everything the
visitor acts on: nav links, buttons, filter chips and `.t-label` are **700**. Body
copy stays **400** — bold at reading size hurts legibility and would flatten the
contrast that makes the bold UI read as instruction.

Use the scale classes from `globals.css` — not ad-hoc sizes:
`.t-display-xl`, `.t-display-lg`, `.t-display-md`, `.t-serif`, `.t-label`, `.t-body`,
`.t-micro`. All display sizes use `clamp()` and must never overflow at 390px.

### Brand marks

Defined in [src/components/brand.tsx](src/components/brand.tsx) as SVG on a 48×48 grid.

- `<Monogram />` — the isotype. A single serif-derived **J** whose baseline is crossed
  by one fine thread line, broken where it passes behind the letter: a hem stitch.
- `<Isologo />` — the mark locked to the "Joanna" wordmark. Used in the nav and footer.

Both draw in `currentColor`, so they invert on any surface with no second variant and
never need a light/dark pair. The favicon is generated from the mark by
[src/app/icon.tsx](src/app/icon.tsx) — reversed out of jade. Verified legible at 16px.

Original work for this project. A client-supplied "JAYSON" logo was offered as a
reference; it was **not** traced or adapted — reusing another brand's mark would leave
Joanna with an asset she has no right to use.

### The piece rail

[src/components/piece-rail.tsx](src/components/piece-rail.tsx) — the scroll-driven
showcase band on the home page.

- **Desktop** (`≥1024px`, motion allowed): pieces sit on a CSS perspective track and
  surf toward the viewer as the section crosses the viewport. Depth is expressed as
  **opacity against the oat ground, never brightness** — dimming a warm light surface
  just turns it muddy grey.
- **Mobile / reduced-motion**: the 3D path is dropped entirely for a snap-scroll swipe
  rail. Most traffic is a phone from Instagram; a perspective track is costly to render
  and awkward to thumb through.

The band stays in normal document flow — it must never take the viewport over, or the
nav, footer and `/work` filters stop working. Cards are real `<Link>`s, so the section
is keyboard-reachable and crawlable.

Written from scratch with plain CSS transforms and a rAF-throttled scroll listener.
A third-party "Collection Surfer" component was suggested as the reference; it was
**not** used — it is dark-mode, hijacks the page with a 50,000px fixed-viewport spacer,
bypasses `next/image`, and has no keyboard or reduced-motion path. Adding it would also
have pulled in `framer-motion` for effects we can express in ~30 lines of transform math.

### Buttons

[src/components/ui/origin-button.tsx](src/components/ui/origin-button.tsx) backs both
`ButtonPrimary` and `ButtonGhost`, so every CTA shares one implementation. The fill
expands from wherever the pointer entered; keyboard focus fills from the centre.

This is the supplied shadcn component, kept at the conventional `/components/ui` path
with its logic intact — `motion`, `cn`, the cover-diameter math, the pointer/keyboard
handlers, and the dev-only accessible-name warning. Deps: `motion`, `clsx`,
`tailwind-merge`, plus `cn` in [src/lib/utils.ts](src/lib/utils.ts).

Two deliberate deviations from upstream:

- **Its theme block is dropped.** It shipped a full light *and dark* token set (white
  card, `#111` ink, sky-blue brand) that would override our locked warm-neutral + jade
  palette wherever a button appeared. Shape and colour now resolve to our own tokens:
  jade pill, uppercase tracking, `--ease` curve, jade focus ring.
- **It is `<button>`-only, but most CTAs navigate.** `ButtonPrimary`/`ButtonGhost` wrap
  it in a `Link` when given `href`, with `tabIndex={-1}` on the inner control — one tab
  stop, and middle-click / open-in-new-tab still work.

The contact form's submit button is deliberately **not** routed through this — it has a
bespoke slide-up loading state that the fill would fight.

### Space, shape, motion

- Spacing 8px base: 8 · 16 · 24 · 40 · 64 · 112 · 176.
- Radius: `0` media, `6px` cards, `999px` buttons/chips.
- Motion: micro `180ms` · hover `320ms` · reveal `900ms`, easing
  `cubic-bezier(.22, 1, .36, 1)`. All motion respects `prefers-reduced-motion`.

## Conventions

- Server Components by default; `"use client"` only where interactivity demands it.
- Images always via `next/image` with explicit dimensions and meaningful `alt`.
- **Reveal animations are progressive enhancement.** Content is visible by default and
  only hidden once the `.js` class confirms JS can bring it back. Never gate content
  behind JS. `<html>` carries `suppressHydrationWarning` because of this.
- No secrets in the repo. See [.env.example](.env.example).
- Accessibility: semantic landmarks, visible jade focus rings, AA contrast, errors
  carry text not color alone.

## Placeholders

Everything awaiting Joanna's real input is marked `TODO(joanna)` — grep for it.
Piece imagery in `public/pieces/` is generated by
[scripts/gen-placeholders.mjs](scripts/gen-placeholders.mjs) and is disposable.

**Never publish a named celebrity/artist credit without written permission.**
