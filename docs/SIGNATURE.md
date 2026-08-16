# The Joanna signature mark

Provenance and licence for the signature wordmark in
[src/components/signature.tsx](../src/components/signature.tsx).

## What it is

Six SVG outline paths — one per letter of "Joanna" — normalised to a 320×120
viewBox. They are static artwork committed to the repo. There is no font
fetched at runtime and no font file shipped with the site.

## Where the letterforms came from

Traced from **Parisienne**, designed by Astigmatic, licensed under the
**SIL Open Font License 1.1**.

The OFL is the reason this is safe. It permits use of the font and of works
derived from it, including commercially and including in a logo, with no
requirement to license the mark separately. Two of its conditions matter here
and both are satisfied:

- **The font itself is not redistributed.** Only outline path data derived
  from it lives in this repo. The OFL's restrictions govern distribution of
  the *font software*; converting glyphs to paths in a design produces
  artwork, which the licence explicitly allows to be used and sold freely.
- **The reserved font name is not used.** Nothing here is named or presented
  as "Parisienne".

Full licence text: <https://openfontlicense.org>

## Why not the component's own font

`@componentry/signature` ships pointing at `LastoriaBoldRegular.otf`, loading
it from `componentry.fun` at runtime. That was replaced for three reasons:

1. **Licence.** Lastoria is a commercial typeface. Most commercial font EULAs
   carve out logo and trademark use specifically, requiring a separate
   extended licence. A logo is a permanent asset Joanna needs to own outright,
   so deriving her mark from it without that licence was not acceptable.
2. **Third-party runtime dependency.** The logo would have been fetched from
   someone else's server on every page load, and would vanish sitewide if that
   file were ever moved or renamed.
3. **Weight and timing.** It pulled `opentype.js` (a full font parser) into
   the client bundle and rendered nothing until the font downloaded and
   parsed — on a page whose primary visitor is on a phone from Instagram.

## What was kept from the component

The idea: a signature that writes itself on when it comes into view, one
letter at a time. That is implemented here in ~20 lines of CSS against static
paths, so the mark is server-rendered, present in the HTML with JS disabled,
and honours `prefers-reduced-motion`.

## If Joanna wants her real signature instead

This is the better long-term answer, and the mark is a drop-in replacement:

1. Have her sign "Joanna" in black ink on unlined white paper. Photograph or
   scan it straight-on at high resolution.
2. Vectorise it (Illustrator: Image Trace → Black and White Logo → Expand;
   or Inkscape: Path → Trace Bitmap).
3. Normalise the result to a 320×120 viewBox and replace the `GLYPHS` array.
   Keeping one path per letter preserves the letter-by-letter reveal; a single
   combined path also works and will simply ink in as one piece.

That version would be unambiguously hers, with no upstream licence in the
picture at all.
