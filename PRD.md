# PRD — Johanna Online Catalog / Portfolio

**Status:** Draft v1 · 2026-08-14
**Owner:** Samir · **Client:** Johanna (designer, Dominican Republic)

> Sections marked **[NEEDS JOANNA]** are placeholders awaiting real assets
> (Instagram handle, bio, piece photos, client list). Nothing in the build is
> blocked by them — they are content, not structure.

---

## 1. Background

Johanna designs custom, hand-made pieces for a clientele that includes artists and
celebrities in the Dominican Republic. Her reputation is strong and largely
word-of-mouth; her online presence is essentially her Instagram.

Two problems in her own words:

1. **She answers the same questions over and over.** Pricing basics, lead times, how
   commissions work, whether she ships — repeated manually in DMs, every day.
2. **She has no single place that shows the body of work.** Instagram is a feed, not a
   catalog: past pieces sink, celebrity work isn't grouped, and nothing is linkable.

## 2. Goals

| # | Goal | How we'll know it worked |
|---|---|---|
| G1 | Give her one link that showcases the full body of work | Catalog page live, reachable from her IG bio |
| G2 | Cut repeat questions | A FAQ she can paste as a deep link into any DM |
| G3 | Make her reputation legible to a stranger in ~10 seconds | Client/press proof visible above the fold |
| G4 | Convert visitors into enquiries | Contact form delivering to her inbox |
| G5 | Feel as crafted as the pieces themselves | Design-system fidelity; fast on mobile |

### Non-goals (v1)

E-commerce or checkout · user accounts · a booking calendar · multi-language (see §8) ·
a blog · anything requiring Johanna to learn a CMS.

## 3. Audience

- **Primary — the prospective client.** Arrives from Instagram on a phone, knows nothing
  about the site, decides in seconds. Mobile-first is not a preference here, it's the
  main case.
- **Secondary — press / stylists / collaborators.** Want credibility signals and a fast
  way to reach her professionally.

## 4. Platform decision: web app, not a native app

**Decision: build a responsive web app (Next.js on Vercel). Do not build a native app.**

| Factor | Web app | Native app |
|---|---|---|
| Traffic from an IG bio link | Opens instantly | Requires a download first — kills the funnel |
| Stopping repeat questions | Linkable URL per FAQ/piece, pasteable into a DM | Content isn't linkable or shareable |
| Discoverability | Indexed by Google, rich link previews | Invisible to search |
| Cost & upkeep | One codebase, deploy in seconds | Two platforms, store review, release cycles |
| Showing image-heavy craft | Excellent with modern image optimization | No real advantage |

A native app would only be justified by push notifications or a returning-client portal.
Neither is a v1 need. **Revisit only if she later wants repeat-client commission tracking.**

## 5. Technical decisions

| Area | Choice | Rationale |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Static-first, great image handling, first-class on Vercel |
| Rendering | Static (SSG) for all content pages | Content changes rarely; fastest possible mobile load |
| Styling | Tailwind + CSS custom properties for tokens | Tokens stay single-source; see `CLAUDE.md` |
| Content | Local typed data files + `public/` images | Zero cost, zero latency, fully version-controlled |
| Contact | Route Handler → **Resend** email | She just reads her inbox; no dashboard to learn |
| Hosting | Vercel | Preview deploys, image CDN, trivial custom domain |

**Content trade-off, stated plainly:** local files mean Johanna cannot add pieces herself —
updates go through you. That's the right call for v1 (speed, cost, performance), and the
data is deliberately shaped so a CMS can be swapped in later without touching components.

**Rejected:** auto-syncing the catalog from the Instagram API. Token refreshes break
silently, captions can't be curated, and pieces can't be grouped by client — the exact
things that make this better than her feed.

## 6. Information architecture

Single-domain site, five routes:

- `/` — **Home.** Oversized name, one-line positioning, featured pieces, proof strip,
  CTA. Must communicate what she makes and that she's trusted, without scrolling.
- `/work` — **The catalog.** Filterable grid of all pieces. The core of the site.
- `/work/[slug]` — **Piece detail.** Large imagery, materials, year, the story, optional
  client credit, and a contextual "commission something like this" CTA.
- `/about` — Portrait, story, craft process, client & press list.
- `/contact` — The form, plus direct channels (IG, WhatsApp, email).

FAQ is a section on `/contact` with anchored IDs (e.g. `/contact#lead-time`) so she can
paste a link straight to a single answer — this is what actually solves G2.

## 7. Design language

Full token table lives in [CLAUDE.md](CLAUDE.md#design-system--lannino-tokens). Summary:
warm cream surface, ember ink, thin geometric Quicksand display type, Playfair serif
accents, mono micro-labels, generous air, and restrained motion on a
`cubic-bezier(.22,1,.36,1)` curve.

**Rebrand rule:** we inherit tokens and component shapes from the Lannino system, never
its identity. No "Lannino", "Lorenzo", "Venice", or "Creative Developer" copy ships.

**Skills to apply during build:** `frontend-design` for overall aesthetic direction and
`animate` for the contact-form micro-interactions, with `web-design-guidelines` as the
accessibility/quality backstop.

### The contact form

The most designed element on the site. Requirements:

- Underline-only fields matching the system, ember focus transitions at 320ms.
- Fields: name · email · what they're looking for (select) · budget range (optional) ·
  message. Every field is a question she currently answers manually.
- Inline validation on blur, never on keystroke. Errors in ember, with text — not color alone.
- Animated submit: idle → sending → a success state that feels like a small reward.
- Honeypot + rate limiting on the route handler. No CAPTCHA (it would cheapen the page).
- Full keyboard operability; all motion gated behind `prefers-reduced-motion`.

## 8. Content model

```ts
type Piece = {
  slug: string;            // URL-safe id
  title: string;
  year: number;
  category: string;        // drives catalog filtering
  materials: string[];
  description: string;     // the story behind the piece
  images: { src: string; alt: string; width: number; height: number }[];
  client?: string;         // celebrity/artist credit — ONLY with permission
  featured?: boolean;      // surfaces on the home page
};
```

**[NEEDS JOANNA]** — the real content:

- Instagram handle, and whether the site or the IG is the canonical bio.
- Her bio/story in her own words, and how she wants to be described.
- The initial set of pieces with high-resolution photos.
- **Written permission for every named celebrity/artist credit.** Do not publish a client
  name on assumption — for this clientele that is a real professional risk. Unpermitted
  work can still be shown uncredited.
- Contact email for enquiries, and the sending domain for Resend.
- Whether the site should be Spanish, English, or both. Her market is Dominican but her
  clientele is international — this affects copy and possibly routing, so it's worth
  asking early rather than retrofitting.

## 9. Quality bar

- **Performance:** Lighthouse ≥ 90 on mobile; images `next/image`, modern formats, lazy
  below the fold.
- **Accessibility:** WCAG AA for all content text, semantic landmarks, visible ember
  focus rings, alt text on every piece image. Dune `#D2A579` is decorative-only.
- **Responsive:** designed at 390px first; display type uses `clamp()` and must never
  overflow. Touch targets ≥ 44px.
- **SEO/social:** per-piece metadata and OG images so a link pasted into a DM or story
  renders as a rich card.

## 10. Build phases

1. **Foundation** — Next.js scaffold, tokens as CSS variables, fonts, base layout.
2. **Component library** — buttons, chips, nav, piece card, portrait strip, footer.
3. **Catalog** — `/work` grid + filtering, `/work/[slug]` detail, placeholder content.
4. **Home & About** — hero, featured work, proof strip, story.
5. **Contact** — the animated form, Resend route handler, FAQ anchors.
6. **Polish** — reveal animations, reduced-motion, accessibility audit, Lighthouse.
7. **Content swap** — replace all placeholders with Johanna's real assets.
8. **Ship** — custom domain, verify the IG bio link end-to-end on a real phone.
