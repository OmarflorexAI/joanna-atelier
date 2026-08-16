import type { Metadata } from "next";
import { pieces } from "@/content/pieces";
import {
  CollectionSurfer,
  type CollectionItem,
} from "@/components/ui/collection-surfer";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "The full body of work on a scroll-driven track. Every piece custom and hand-made.",
};

/**
 * The surfer takes the whole viewport, so it gets its own route rather than
 * a slot inside an existing page. /work stays the browsable catalog with
 * filters and links to each piece; this is the immersive view.
 */
const items: CollectionItem[] = pieces.map((p, i) => ({
  id: i + 1,
  image: p.images[0].src,
  title: p.title.toUpperCase(),
}));

export default function CollectionPage() {
  return <CollectionSurfer items={items} variant="magnetic" />;
}
