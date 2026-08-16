/**
 * The catalog. PLACEHOLDER pieces — replace with Johanna's real work.
 *
 * Shape is deliberately CMS-swappable: if she later moves to Sanity, the
 * components consume this same type and nothing in the UI changes.
 */

export type PieceImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Macro/detail shots carry the hand-made claim — laid out larger. */
  detail?: boolean;
};

export type Piece = {
  slug: string;
  title: string;
  year: number;
  category: Category;
  materials: string[];
  /** One line, shown under the title in the catalog. */
  summary: string;
  /** The story of the piece. */
  description: string[];
  /** Hours of hand-work — the proof of craft. */
  hours?: number;
  /** TODO(johanna): ONLY publish with written permission from the client. */
  client?: string;
  featured?: boolean;
  images: PieceImage[];
};

export const CATEGORIES = [
  "Evening",
  "Bridal",
  "Editorial",
  "Performance",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Stand-in photography. All frames are 4:5 so the catalog grid, the rail,
 * and the detail gallery share one ratio and never leave ragged columns.
 * TODO(johanna): replace every file in public/pieces/ with her own shots.
 * Sources are listed in public/pieces/CREDITS.md.
 */
const img = (
  slug: string,
  n: number,
  alt: string,
  detail = false,
): PieceImage => ({
  src: `/pieces/${slug}-${n}.jpg`,
  alt,
  // 1600×2000 source: enough pixels for next/image to emit a crisp 2x
  // srcset on retina phones without upscaling.
  width: 1600,
  height: 2000,
  detail,
});

export const pieces: Piece[] = [
  {
    slug: "azabache",
    title: "Azabache",
    year: 2026,
    category: "Evening",
    materials: ["Silk crêpe", "Hand-set jet beading", "Silk organza"],
    summary: "A floor-length column, beaded by hand over eleven weeks.",
    hours: 420,
    featured: true,
    description: [
      "The brief asked for something that would read from the back of a room without shouting from the front of it. The answer was weight: nearly four hundred hours of jet beading, set one at a time along a silk crêpe column so the light moves rather than flashes.",
      "The beading is graded — dense at the hem, thinning as it climbs, so the piece appears to dissolve upward under stage light. Nothing about that effect survives machine work, which is why it was done by hand.",
    ],
    images: [
      img("azabache", 1, "Full-length view of a beaded black silk evening column"),
      img("azabache", 2, "Detail of hand-set jet beading graded along the hem", true),
      img("azabache", 3, "Back view showing the covered button closure"),
    ],
  },
  {
    slug: "ceiba",
    title: "Ceiba",
    year: 2025,
    category: "Bridal",
    materials: ["Silk mikado", "Hand-cut lace", "Horsehair braid"],
    summary: "Bridal, built around a single unbroken bias seam.",
    hours: 310,
    featured: true,
    description: [
      "Named for the tree it was drawn under. The brief was a gown that could be danced in for nine hours and still photograph like architecture at midnight.",
      "The structure hides in the cut rather than in boning — one continuous bias seam carries the shape from shoulder to hem, which is why it moves the way it does.",
    ],
    images: [
      img("ceiba", 1, "Bridal gown in ivory silk mikado, full length"),
      img("ceiba", 2, "Detail of hand-cut lace applied at the shoulder", true),
      img("ceiba", 3, "Side profile showing the unbroken bias seam"),
    ],
  },
  {
    slug: "malecon",
    title: "Malecón",
    year: 2025,
    category: "Editorial",
    materials: ["Cotton poplin", "Hand-pleated linen"],
    summary: "Eighty-four hand-pressed pleats, made for movement in wind.",
    hours: 190,
    featured: true,
    description: [
      "An editorial piece shot at the seawall at first light. The garment had to behave in coastal wind — not resist it, but use it.",
      "Eighty-four pleats, each pressed and set by hand, weighted differently across the panel so the skirt opens on one side and holds on the other.",
    ],
    images: [
      img("malecon", 1, "Pleated linen garment photographed in motion"),
      img("malecon", 2, "Macro detail of hand-pressed pleat edges", true),
    ],
  },
  {
    slug: "vega-real",
    title: "Vega Real",
    year: 2024,
    category: "Performance",
    materials: ["Stretch silk", "Reinforced seams", "Hand-applied sequins"],
    summary: "Built for a touring performer — and for eleven months of stage.",
    hours: 260,
    description: [
      "Stage garments fail in ways evening wear never does: at the seams, under heat, after the fortieth night. This one was drafted to survive a tour.",
      "Every stress seam is reinforced and every sequin hand-applied with a stitch that will not run if one is lost. It came back after eleven months for a press and nothing else.",
    ],
    images: [
      img("vega-real", 1, "Performance garment with hand-applied sequins"),
      img("vega-real", 2, "Detail of reinforced seam construction", true),
    ],
  },
  {
    slug: "amber-room",
    title: "Amber Room",
    year: 2024,
    category: "Evening",
    materials: ["Silk velvet", "Antique gold thread"],
    summary: "Goldwork embroidery worked in a technique three centuries old.",
    hours: 350,
    description: [
      "The embroidery is goldwork — couched by hand, a technique largely unchanged in three hundred years and impossible to reproduce by machine.",
      "Silk velvet is unforgiving: it marks under pressure and cannot be unpicked cleanly. Every stitch here was placed once.",
    ],
    images: [
      img("amber-room", 1, "Silk velvet evening piece with goldwork embroidery"),
      img("amber-room", 2, "Macro detail of couched gold thread", true),
    ],
  },
  {
    slug: "saona",
    title: "Saona",
    year: 2023,
    category: "Bridal",
    materials: ["Silk chiffon", "Hand-rolled hems"],
    summary: "Seven layers of chiffon, every hem rolled by hand.",
    hours: 220,
    description: [
      "A destination piece — light enough for coastal heat, structured enough to photograph. Seven layers of silk chiffon, graded in length so the hem never reads as a single hard line.",
      "Every one of those hems is rolled and stitched by hand. It is the slowest possible way to finish chiffon and the only one that hangs correctly.",
    ],
    images: [
      img("saona", 1, "Layered silk chiffon bridal gown"),
      img("saona", 2, "Detail of hand-rolled chiffon hem", true),
    ],
  },
  {
    slug: "seda",
    title: "Seda",
    year: 2023,
    category: "Editorial",
    materials: ["Wild silk", "Hand-dyed thread"],
    summary: "Dyed in the atelier, one length at a time.",
    hours: 165,
    description: [
      "The colour did not exist commercially, so it was mixed by hand and the silk dyed a length at a time in the atelier sink. No two panels are identical, which is the point.",
      "Wild silk takes dye unevenly by nature. Rather than fight that, the cut places the deepest saturation where the light falls hardest.",
    ],
    images: [
      img("seda", 1, "Hand-dyed wild silk garment"),
      img("seda", 2, "Detail of uneven hand-dyed silk grain", true),
    ],
  },
  {
    slug: "higuey",
    title: "Higüey",
    year: 2023,
    category: "Performance",
    materials: ["Cotton sateen", "Hand-worked cutwork"],
    summary: "Cutwork panels, opened by hand with a scalpel.",
    hours: 240,
    description: [
      "Every opening in the panel was cut by hand and the raw edge worked closed so it will not fray under stage movement. There is no machine that does this without leaving a tell.",
      "It was drafted for a dancer, so the cutwork sits where the body folds — the garment opens as she moves and closes when she is still.",
    ],
    images: [
      img("higuey", 1, "Cotton sateen piece with hand-worked cutwork"),
      img("higuey", 2, "Macro detail of hand-cut and finished openings", true),
    ],
  },
];

export const featuredPieces = pieces.filter((p) => p.featured);

export function getPiece(slug: string) {
  return pieces.find((p) => p.slug === slug);
}
