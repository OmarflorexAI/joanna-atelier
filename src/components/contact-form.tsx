"use client";

import { useRef, useState } from "react";
import {
  MESSAGE_MAX,
  OCCASIONS,
  TIMELINES,
  validateEnquiry,
  type FieldErrors,
} from "@/lib/contact-schema";
import { studio } from "@/content/studio";
import { useLocale } from "./locale-provider";
import type { MessageKey } from "@/content/i18n";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = {
  name: "",
  email: "",
  occasion: "",
  timeline: "",
  message: "",
  company: "",
};

export function ContactForm() {
  const { t } = useLocale();
  /**
   * Field and server errors arrive as message keys. Resolve them, but fall
   * back to the raw string if it is not a known key — an unrecognised error
   * should still reach the visitor rather than disappear into a blank alert.
   */
  const msg = (k?: string) => {
    if (!k) return undefined;
    const hit = t(k as MessageKey);
    return hit === undefined ? k : hit;
  };
  const [values, setValues] = useState({ ...EMPTY });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  const set = (k: keyof typeof EMPTY) => (v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    // Clear an error as soon as the field becomes valid — never nag mid-typing.
    if (errors[k]) {
      const next = validateEnquiry({ ...values, [k]: v });
      if (!next[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    }
  };

  // Validate on blur, never on keystroke.
  const blur = (k: keyof typeof EMPTY) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    const next = validateEnquiry(values);
    setErrors((e) => ({ ...e, [k]: next[k] }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(found).length > 0) {
      firstErrorRef.current?.focus();
      return;
    }

    setStatus("sending");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        // The API may return a message key; fall back to the generic one.
        setServerError(msg(data.error) ?? t("err.server"));
        setStatus("error");
        return;
      }

      setStatus("sent");
      setValues({ ...EMPTY });
      setTouched({});
    } catch {
      setServerError(`${t("err.unreachable")} ${studio.email}.`);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-6 border-t border-umber pt-12"
      >
        {/* Hand-drawn check — draws itself once, then rests */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden
          className="text-jade"
        >
          <path
            d="M6 23.5 L17 34 L38 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 0,
              animation: "draw 900ms cubic-bezier(.22,1,.36,1) both",
            }}
          />
          <style>{`@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
            @media (prefers-reduced-motion:reduce){path{animation:none!important}}`}</style>
        </svg>

        <h3 className="t-display-lg">{t("contact.received")}</h3>
        <p className="t-body max-w-[44ch]">
          {t("contact.receivedBody1")}{" "}
          <a
            href={`mailto:${studio.email}`}
            className="text-umber underline underline-offset-4"
          >
            {studio.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="t-micro border-b border-[var(--rule-strong)] pb-1 text-taupe transition-colors duration-[var(--hover)] hover:text-umber"
        >
          {t("contact.sendAnother")}
        </button>
      </div>
    );
  }

  const busy = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-10">
      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) => set("company")(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <Field
          label={t("contact.yourName")}
          name="name"
          value={values.name}
          onChange={set("name")}
          onBlur={blur("name")}
          error={touched.name ? msg(errors.name) : undefined}
          autoComplete="name"
          disabled={busy}
        />
        <Field
          label={t("contact.email")}
          name="email"
          type="email"
          value={values.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={touched.email ? msg(errors.email) : undefined}
          autoComplete="email"
          disabled={busy}
        />
      </div>

      <ChoiceRow
        label={t("contact.whatOccasion")}
        keyPrefix="occ"
        name="occasion"
        options={[...OCCASIONS]}
        value={values.occasion}
        onChange={set("occasion")}
        disabled={busy}
      />

      <ChoiceRow
        label={t("contact.whenNeeded")}
        keyPrefix="tl"
        name="timeline"
        options={[...TIMELINES]}
        value={values.timeline}
        onChange={set("timeline")}
        disabled={busy}
      />

      <Field
        label={t("contact.message")}
        name="message"
        value={values.message}
        onChange={set("message")}
        onBlur={blur("message")}
        error={touched.message ? msg(errors.message) : undefined}
        textarea
        max={MESSAGE_MAX}
        disabled={busy}
      />

      {serverError ? (
        <p
          role="alert"
          className="border-l-2 border-jade pl-4 text-[0.9rem] text-umber"
        >
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="btn-send group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-jade px-10 py-4 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-bone transition-[background-color,transform] duration-[var(--hover)] ease-[var(--ease)] hover:bg-jade-deep active:translate-y-px disabled:opacity-70"
        >
          <span
            className={`transition-transform duration-[var(--hover)] ease-[var(--ease)] ${
              busy ? "-translate-y-8" : ""
            }`}
            style={{ position: "relative", zIndex: 1 }}
          >
            {t("contact.send")}
            <span aria-hidden className="btn-send-arrow ml-2 inline-block">
              →
            </span>
          </span>
          <span
            aria-hidden
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-[var(--hover)] ease-[var(--ease)] ${
              busy ? "translate-y-0" : "translate-y-8"
            }`}
          >
            <Dot delay={0} />
            <Dot delay={160} />
            <Dot delay={320} />
          </span>
        </button>
        <p className="text-[0.85rem] font-normal text-taupe">
          Or write to{" "}
          <a
            href={`mailto:${studio.email}`}
            className="text-umber underline underline-offset-4"
          >
            {studio.email}
          </a>
        </p>
      </div>
    </form>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-bone"
      style={{
        animation: "pulse 1.1s ease-in-out infinite",
        animationDelay: `${delay}ms`,
      }}
    >
      <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </span>
  );
}

/** Underline-only field. Label sits above; the rule thickens into jade on focus. */
function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  textarea = false,
  max,
  autoComplete,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  max?: number;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const id = `f-${name}`;
  const errId = `${id}-err`;
  const base =
    "peer w-full bg-transparent pb-3 pt-1 text-[1.05rem] font-normal text-umber outline-none placeholder:text-silt/70 disabled:opacity-60";

  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={id} className="t-micro text-silt">
        {label}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          value={value}
          maxLength={max}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={`${base} resize-none border-x border-t border-[var(--rule)] bg-[color-mix(in_srgb,var(--oat)_38%,transparent)] px-4 pt-3`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={base}
        />
      )}

      {/* Two-layer rule: resting hairline + accent that grows from the left */}
      <span className="relative block h-px w-full bg-[var(--rule-strong)]">
        <span
          className={`absolute inset-0 origin-left bg-jade transition-transform duration-[var(--hover)] ease-[var(--ease)] ${
            error ? "scale-x-100" : "scale-x-0 peer-focus:scale-x-100"
          }`}
          style={error ? { background: "var(--umber)" } : undefined}
        />
      </span>

      <div className="flex items-baseline justify-between gap-4">
        {error ? (
          <p id={errId} role="alert" className="text-[0.82rem] text-umber">
            {error}
          </p>
        ) : (
          <span />
        )}
        {max ? (
          <span className="t-micro tabular-nums text-silt">
            {value.length}/{max}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Radio row rendered as chips — faster than a select on a phone. */
function ChoiceRow({
  label,
  name,
  options,
  value,
  onChange,
  disabled,
  /** Key prefix used to look up each option's display label. The submitted
   *  value stays the English option, which is what the schema validates. */
  keyPrefix,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  keyPrefix: "occ" | "tl";
}) {
  const { t } = useLocale();
  return (
    // A <legend> is taken out of the flex flow, so the gap between it and
    // the chips has to be its own margin rather than the fieldset gap.
    <fieldset disabled={disabled} className="block">
      <legend className="t-micro mb-5 text-silt">{label}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <label
              key={o}
              className={`chip cursor-pointer rounded-[3px] border px-5 py-2.5 text-[0.88rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-jade ${
                active
                  ? "border-jade bg-jade text-bone"
                  : "border-[var(--rule-strong)] text-taupe"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o}
                checked={active}
                onChange={() => onChange(o)}
                className="sr-only"
              />
              {t(`${keyPrefix}.${o}` as MessageKey)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
