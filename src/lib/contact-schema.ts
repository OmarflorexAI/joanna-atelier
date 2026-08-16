/**
 * One source of truth for enquiry validation, imported by both the client
 * form and the route handler so the rules cannot drift apart.
 *
 * Errors are returned as message KEYS, not sentences. The server has no
 * business deciding which language to apologise in — the client resolves the
 * key against the active locale, and the API can still log the key verbatim.
 */

export const OCCASIONS = [
  "Evening",
  "Bridal",
  "Editorial",
  "Performance",
  "Something else",
] as const;

export const TIMELINES = [
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Still deciding",
] as const;

export type Occasion = (typeof OCCASIONS)[number];
export type Timeline = (typeof TIMELINES)[number];

export type EnquiryInput = {
  name: string;
  email: string;
  occasion: string;
  timeline: string;
  message: string;
  /** Honeypot — must stay empty. */
  company?: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(input: Partial<EnquiryInput>): FieldErrors {
  const e: FieldErrors = {};

  const name = input.name?.trim() ?? "";
  if (name.length < 2) e.name = "err.name.short";
  else if (name.length > 100) e.name = "err.name.long";

  const email = input.email?.trim() ?? "";
  if (!email) e.email = "err.email.missing";
  else if (!EMAIL.test(email)) e.email = "err.email.invalid";
  else if (email.length > 200) e.email = "err.email.long";

  if (input.occasion && !OCCASIONS.includes(input.occasion as Occasion)) {
    e.occasion = "err.occasion.invalid";
  }

  if (input.timeline && !TIMELINES.includes(input.timeline as Timeline)) {
    e.timeline = "err.timeline.invalid";
  }

  const message = input.message?.trim() ?? "";
  if (message.length < 10) {
    e.message = "err.message.short";
  } else if (message.length > 4000) {
    e.message = "err.message.long";
  }

  return e;
}

export const MESSAGE_MAX = 4000;
