/**
 * Export the EN/ES dictionary to a CSV Johanna can open in Excel or Google
 * Sheets, review, and send back — and import it again once she has.
 *
 * The problem this solves: the translations live in a TypeScript file she
 * has no way to edit. Asking a non-developer to review 180 strings inside
 * source code means the review never happens. A spreadsheet does.
 *
 *   node scripts/export-translations.mjs            # write translations.csv
 *   node scripts/export-translations.mjs --import <file.csv>
 *
 * The import path rewrites only the Spanish half of src/content/i18n.ts and
 * leaves the English source of truth untouched.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const I18N = join(HERE, "..", "src", "content", "i18n.ts");
const CSV = join(HERE, "..", "translations.csv");

/** Pull the two object literals out of the TS source without executing it. */
function parseDictionaries(src) {
  const grab = (startMarker, endMarker) => {
    const a = src.indexOf(startMarker);
    if (a < 0) throw new Error(`could not find ${startMarker}`);
    const b = src.indexOf(endMarker, a);
    if (b < 0) throw new Error(`could not find ${endMarker} after ${startMarker}`);
    return src.slice(a, b);
  };

  const enBlock = grab("const en = {", "} as const;");
  const esBlock = grab("const es: Record<keyof typeof en, string> = {", "\n};");

  // Keys and values are always double-quoted in this file; values may wrap
  // onto the next line, which is why this is not a single-line regex.
  const entries = (block) => {
    const out = new Map();
    const re = /"((?:[^"\\]|\\.)*)":\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = re.exec(block))) out.set(unescape_(m[1]), unescape_(m[2]));
    return out;
  };

  return { en: entries(enBlock), es: entries(esBlock) };
}

const unescape_ = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
const escape_ = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const csvCell = (s) => `"${String(s).replace(/"/g, '""')}"`;

/** Group keys by their dotted prefix so the sheet reads in page order. */
const SECTIONS = {
  nav: "Navigation",
  footer: "Footer",
  lang: "Language switch",
  home: "Home page",
  credit: "Home — standing",
  work: "Work index",
  piece: "Piece pages",
  cat: "Categories",
  about: "Atelier page",
  proc: "Atelier — process steps",
  contact: "Contact page",
  faq: "FAQ",
  occ: "Contact — occasion options",
  tl: "Contact — timeline options",
  err: "Errors and messages",
};

function exportCsv() {
  const src = readFileSync(I18N, "utf8");
  const { en, es } = parseDictionaries(src);

  const rows = [
    ["Section", "Key", "English (do not edit)", "Spanish (edit this column)", "Notes"],
  ];
  for (const [key, english] of en) {
    const prefix = key.split(".")[0];
    rows.push([
      SECTIONS[prefix] ?? prefix,
      key,
      english,
      es.get(key) ?? "",
      "",
    ]);
  }

  // BOM so Excel opens the accents correctly instead of mangling them.
  const csv = "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  writeFileSync(CSV, csv, "utf8");
  console.log(`Wrote ${CSV}`);
  console.log(`${rows.length - 1} strings across ${new Set([...en.keys()].map(k => k.split(".")[0])).size} sections.`);
  console.log("\nSend that file to Johanna. She edits column D only.");
}

function importCsv(file) {
  const text = readFileSync(file, "utf8").replace(/^﻿/, "");

  // Minimal RFC-4180 parser: handles quoted cells containing commas,
  // newlines and doubled quotes.
  const rows = [];
  let row = [], cell = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }

  const body = rows.slice(1).filter((r) => r.length >= 4 && r[1]);
  const updates = new Map(body.map((r) => [r[1].trim(), r[3]]));

  const src = readFileSync(I18N, "utf8");
  const { en, es } = parseDictionaries(src);

  let changed = 0, blank = 0;
  const merged = new Map(es);
  for (const [key] of en) {
    const next = updates.get(key);
    if (next === undefined) continue;
    if (!next.trim()) { blank++; continue; }
    if (next !== es.get(key)) { merged.set(key, next); changed++; }
  }

  // Rebuild only the Spanish block; English is the source of truth.
  const startMarker = "const es: Record<keyof typeof en, string> = {";
  const a = src.indexOf(startMarker);
  const b = src.indexOf("\n};", a);
  const rebuilt =
    startMarker +
    "\n" +
    [...en.keys()]
      .map((k) => `  ${JSON.stringify(k)}: "${escape_(merged.get(k) ?? "")}",`)
      .join("\n") +
    "\n";

  writeFileSync(I18N, src.slice(0, a) + rebuilt + src.slice(b + 1), "utf8");
  console.log(`Updated ${changed} Spanish strings.`);
  if (blank) console.log(`${blank} rows were blank and were left as they were.`);
  console.log("Run `npm run lint && npm run build` to check nothing broke.");
}

const arg = process.argv[2];
if (arg === "--import") {
  const file = process.argv[3];
  if (!file) { console.error("usage: --import <file.csv>"); process.exit(1); }
  importCsv(file);
} else {
  exportCsv();
}
