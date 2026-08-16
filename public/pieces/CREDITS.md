# Image credits — PLACEHOLDER ASSETS

Every `.jpg` in this folder is **stand-in photography from Unsplash**, used under the
[Unsplash License](https://unsplash.com/license) (free for commercial use, no permission
needed, attribution appreciated but not required).

**These are not Joanna's work.** They exist so the layout can be built and reviewed at
real image weights and aspect ratios. Every one must be replaced with her own photography
before the site goes live — a portfolio showing another photographer's garments is worse
than one showing none.

All frames are cropped to 900×1125 (4:5) so the catalog grid, the piece rail, and the
detail galleries share a single ratio.

## Replacing them

Drop her files in at the same paths and ratio, keeping the existing names:

```
public/pieces/<slug>-1.jpg   cover      (4:5)
public/pieces/<slug>-2.jpg   detail     (4:5)
public/pieces/<slug>-3.jpg   optional   (4:5)
public/pieces/portrait.jpg   about page (4:5)
```

Then update the `alt` text in [src/content/pieces.ts](../../src/content/pieces.ts) to
describe what is actually in each frame — the current alt text describes the intent of
the shot, not the placeholder.

The generator for the earlier abstract SVG placeholders is still at
[scripts/gen-placeholders.mjs](../../scripts/gen-placeholders.mjs) if you need neutral
blanks instead of photography at any point.
