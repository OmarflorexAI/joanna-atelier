/**
 * Generates placeholder SVGs for the catalog at correct aspect ratios,
 * so layout work is real before Johanna's photography arrives.
 * Run: node scripts/gen-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "pieces");
mkdirSync(OUT, { recursive: true });

const TONES = [
  ["#e8e1d6", "#d3c8b8"],
  ["#e2ded6", "#cfc6b8"],
  ["#e6ded2", "#d0c4b2"],
  ["#dfdad2", "#c8bdae"],
];

/** Portrait figure suggestion — never a literal drawing, just tonal mass. */
function portrait(w, h, [bg, fg], label, seed) {
  const cx = w / 2;
  const shoulder = h * 0.3;
  const hem = h * 0.94;
  const flare = w * (0.2 + (seed % 3) * 0.035);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <path d="M ${cx - w * 0.09} ${shoulder}
           C ${cx - w * 0.14} ${h * 0.5}, ${cx - flare} ${h * 0.78}, ${cx - flare} ${hem}
           L ${cx + flare} ${hem}
           C ${cx + flare} ${h * 0.78}, ${cx + w * 0.14} ${h * 0.5}, ${cx + w * 0.09} ${shoulder}
           Z" fill="${fg}" opacity=".85"/>
  <circle cx="${cx}" cy="${h * 0.2}" r="${w * 0.055}" fill="${fg}" opacity=".7"/>
  <rect x="0" y="${h - 1}" width="${w}" height="1" fill="rgba(36,31,27,.10)"/>
</svg>`;
}

/** Detail/macro — texture field, reads as fabric close-up. */
function detail(w, h, [bg, fg], label, seed) {
  const lines = [];
  const step = 22 + (seed % 4) * 6;
  for (let i = -h; i < w + h; i += step) {
    lines.push(
      `<line x1="${i}" y1="0" x2="${i + h}" y2="${h}" stroke="${fg}" stroke-width="${
        6 + (seed % 3) * 3
      }" opacity=".5"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <g>${lines.join("")}</g>
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <defs>
    <radialGradient id="v" cx="50%" cy="45%" r="72%">
      <stop offset="60%" stop-color="${bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity=".55"/>
    </radialGradient>
  </defs>
</svg>`;
}

const SPEC = [
  ["azabache", [false, true, false]],
  ["ceiba", [false, true, false]],
  ["malecon", [false, true]],
  ["vega-real", [false, true]],
  ["amber-room", [false, true]],
  ["saona", [false, true]],
];

let count = 0;
SPEC.forEach(([slug, kinds], si) => {
  kinds.forEach((isDetail, i) => {
    const tone = TONES[(si + i) % TONES.length];
    const svg = isDetail
      ? detail(1200, 900, tone, `${slug} detail`, si + i)
      : portrait(900, 1200, tone, slug, si + i);
    writeFileSync(join(OUT, `${slug}-${i + 1}.svg`), svg, "utf8");
    count++;
  });
});

// Portrait of Johanna for the about page
writeFileSync(
  join(OUT, "portrait.svg"),
  portrait(900, 1200, TONES[1], "portrait placeholder", 2),
  "utf8",
);
count++;

console.log(`wrote ${count} placeholder images to public/pieces`);
