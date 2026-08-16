/**
 * Studio-level facts. PLACEHOLDER copy — replace with Joanna's real details.
 * Search the repo for `TODO(joanna)` for everything awaiting her input.
 */

export const studio = {
  name: "Joanna",
  // TODO(joanna): confirm how she wants to be described
  discipline: "Custom Atelier",
  location: "Santo Domingo, Dominican Republic",
  // TODO(joanna): real domain
  url: "https://joanna.example.com",
  metaDescription:
    "Custom, hand-made garments made to measure in Santo Domingo. Private work for artists, performers and collectors.",

  // TODO(joanna): real handles + address
  instagram: "https://instagram.com/",
  instagramHandle: "@joanna",
  email: "hola@joanna.example.com",
  whatsapp: "https://wa.me/",

  since: 2014,

  /** Statement words — the site's typographic anchor. */
  values: ["Measured", "Made by hand", "Made once"],

  intro:
    "Every piece begins as a conversation and ends as a single garment that exists once. No patterns are reused, no size is assumed, and nothing leaves the atelier until it fits the person it was drawn for.",
} as const;

/** Proof of standing. TODO(joanna): only publish names with written permission. */
export const credits = [
  "Featured in regional press",
  "Dressed for televised award ceremonies",
  "Private work since 2014",
  "Bridal and editorial work",
] as const;
