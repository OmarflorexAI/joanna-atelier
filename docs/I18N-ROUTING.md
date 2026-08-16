# Giving Spanish its own URLs

## Where things stand

Language is a **client-side toggle**. The choice lives in `localStorage`, the
floating pill switches it, and every page renders whichever language is
selected. There is one URL per page, and it serves both languages.

That was chosen deliberately to ship, and for the traffic this site actually
gets — an Instagram bio link, opened on a phone, by someone who already knows
who Johanna is — it is close to free. The visitor lands, the page is in their
language (the provider reads `navigator.language`, so an `es-*` phone gets
Spanish on the first paint), and nothing else about the visit depends on the
URL.

## What it costs

Two things, both real:

1. **Google indexes one version.** Search engines see the English HTML,
   because that is what the server renders. Someone searching in Spanish for
   a Dominican atelier is less likely to find the site.
2. **Johanna cannot send a Spanish link.** If she pastes a URL into a WhatsApp
   conversation with a Spanish-speaking client, it opens in whatever that
   person's browser prefers — usually right, but not something she controls.

Point 2 is the one she will notice. Point 1 matters if organic search ever
becomes a real channel; today it is not.

## What upgrading involves

The expensive part of a routed setup is extracting every string from the
markup. **That is already done** — 152 keys in
[src/content/i18n.ts](../src/content/i18n.ts), typed so a missing translation
fails the build. What is left is wiring, and it is genuinely mechanical.

Concretely, in this version of Next.js (16 — check
`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`, the
APIs have changed and are not what older tutorials describe):

1. **Move the app under a dynamic segment.** `src/app/*` becomes
   `src/app/[lang]/*`. The root layout moves with it.
2. **Read the locale with `next/root-params`.** In Next 16 a root-level
   dynamic segment is readable from any Server Component via
   `import { lang } from "next/root-params"` — no prop drilling, and it works
   in shared layouts. `<html lang={await lang()}>` becomes correct at the
   server, not patched by an effect.
3. **Add `proxy.ts`** (Next 16 renamed `middleware` to Proxy for this) to
   redirect a bare path to the visitor's locale, reading `Accept-Language`.
4. **Make the 13 internal links locale-aware.** `href="/work"` becomes
   `` href={`/${lang}/work`} ``. Grep: `grep -rn 'href="/' src --include=*.tsx`.
5. **Emit `hreflang`** in `generateMetadata` via `alternates.languages`, so
   Google connects the two versions instead of reading them as duplicates.
6. **Keep `t()` for Client Components.** `LocaleProvider` stays, seeded from
   the route segment rather than `localStorage`; the switch becomes a
   `<Link>` to the same page under the other prefix, which also makes it
   work without JS.
7. **`generateStaticParams` returns both locales**, so all 17 routes prerender
   twice — 34 static pages. Still a static build; still free to host.

Rough size: a focused day, most of it in steps 1 and 4, plus re-testing
responsive at 360/390 because Spanish runs 15–25% longer than English and the
nav is the tightest row on the site.

## When to do it

Do it when one of these becomes true:

- Johanna asks for a link she can send that is definitely in Spanish.
- Organic search becomes a channel worth optimising for.
- A second language gets added (the toggle does not scale to three).

Until then the current setup is not technical debt so much as a deliberately
deferred decision, and the deferral is cheap because the strings are already
out of the markup.
