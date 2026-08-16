"use client";

import type { MessageKey } from "@/content/i18n";
import type { Category } from "@/content/pieces";
import { useLocale } from "./locale-provider";
import { SectionHead } from "./ui";

/**
 * Renders one translated string.
 *
 * This exists so Server Components — the piece pages, /about, /work — can stay
 * server-rendered (and keep generateStaticParams, metadata and streaming)
 * while still having translatable labels. Only the leaf text becomes a client
 * component, not the whole page.
 *
 * Use <T k="..." /> for a label. For a whole paragraph of body copy, prefer
 * <TBlock> so the element itself carries the classes.
 */
export function T({ k }: { k: MessageKey }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}

/**
 * A piece category ("Evening", "Bridal", …) in the active language.
 * The stored value stays English — it is the data key — and only the
 * rendered label translates.
 */
export function TCategory({ value }: { value: Category }) {
  const { t } = useLocale();
  return <>{t(`cat.${value}` as MessageKey)}</>;
}

/** SectionHead with translated title/aside. Wraps the shared component so
 *  the rule + layout stay in one place. */
export function SectionHeadT({
  titleKey,
  asideKey,
}: {
  titleKey: MessageKey;
  asideKey?: MessageKey;
}) {
  const { t } = useLocale();
  return <SectionHead title={t(titleKey)} aside={asideKey ? t(asideKey) : undefined} />;
}

/** A translated block element — <p> by default. */
export function TBlock({
  k,
  className = "",
  as: Tag = "p",
}: {
  k: MessageKey;
  className?: string;
  as?: React.ElementType;
}) {
  const { t } = useLocale();
  return <Tag className={className}>{t(k)}</Tag>;
}
