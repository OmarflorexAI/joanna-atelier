# Spanish review — how to actually get it done

The Spanish on the site is a **draft written by the developer, not by Johanna.**
It is careful, neutral Latin-American Spanish written to match the English
voice, but she is the native speaker and the brand voice is hers. Until she
has read it, treat every Spanish string as provisional.

The reason this had not happened yet is not that anyone forgot — it is that
the strings live in [src/content/i18n.ts](../src/content/i18n.ts), a
TypeScript file. Asking someone who does not write code to review 152 strings
inside source code means the review never happens. So there is a script.

## Sending it to Johanna

```bash
node scripts/export-translations.mjs
```

That writes `translations.csv` in the repo root: 152 rows, grouped by the
part of the site they appear in (Navigation, Home page, FAQ, and so on), with
the English beside the Spanish.

Send her that file. It opens in Excel, Numbers or Google Sheets. The only
instruction she needs:

> **Edit column D only.** Column C is the English original — leave it alone.
> If a line is already right, leave it. If it sounds wrong, or is not how you
> would say it, rewrite it. Anything you are unsure about, put a note in
> column E.

Worth telling her explicitly: this is not a translation exercise. She should
change anything that does not sound like her, even where the Spanish is
technically correct. Marketing-flavoured phrasing and over-formality are the
usual culprits.

## Bringing her edits back

```bash
node scripts/export-translations.mjs --import path/to/her-file.csv
npm run lint && npm run build
```

The importer rewrites **only** the Spanish half of `i18n.ts`. English is the
source of truth and is never touched. Blank cells are left as they were, so a
partially-completed sheet is safe to import — she can send it back in stages.

One row is blank on purpose: `err.h1c` is the third fragment of the 404
headline, which the Spanish phrasing does not need.

## Things to check after importing

- `npm run build` passes. A missing key is a TypeScript error, not a silent
  blank, so the build is a real check.
- Long strings still fit. Spanish commonly runs 15–25% longer than English;
  the nav and buttons are the tightest places. Re-check at 360px.
- The accents survived. If anything looks like `Ã³`, the file was saved as
  something other than UTF-8 — ask for it again as CSV UTF-8.

## What is still not solved

Spanish has no URL of its own. The switch is client-side, so:

- Google will not index a Spanish version separately.
- Johanna cannot send someone a link that opens in Spanish.

That was a deliberate trade to ship. The copy is already fully extracted,
which is the hard part of a routed setup — see
[docs/I18N-ROUTING.md](I18N-ROUTING.md) for what upgrading actually involves.
