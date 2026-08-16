import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateEnquiry, type EnquiryInput } from "@/lib/contact-schema";

/**
 * Enquiry intake. Delivers to Joanna's inbox via Resend.
 *
 * Env required in production:
 *   RESEND_API_KEY   — from resend.com
 *   CONTACT_TO_EMAIL — where enquiries land
 *   CONTACT_FROM     — a verified sending address on her domain
 */

// In-memory rate limit. Adequate for a low-traffic portfolio; if this ever
// runs on more than one instance, move to a shared store.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  HITS.set(ip, recent);
  // Opportunistic cleanup so the map cannot grow without bound.
  if (HITS.size > 2000) {
    for (const [k, v] of HITS) {
      if (v.every((t) => now - t >= WINDOW_MS)) HITS.delete(k);
    }
  }
  return false;
}

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );

/**
 * The client IP, taken only from headers the hosting platform sets itself.
 *
 * `x-forwarded-for` is attacker-controlled: anyone can send a different value
 * on every request and walk straight past a per-IP limit (verified — 8/8
 * accepted while rotating the header). Netlify sets `x-nf-client-connection-ip`
 * and Vercel sets `x-vercel-forwarded-for`; both are stamped at the edge and
 * cannot be spoofed by the client.
 *
 * If neither is present we are either local or behind an unknown proxy, so we
 * fall back to a single shared bucket rather than to `x-forwarded-for`. That
 * is deliberately conservative: a shared bucket may rate-limit honest visitors
 * together, but it cannot be bypassed. For a portfolio contact form that is
 * the right side to err on.
 */
function clientIp(request: Request): string {
  const trusted =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("cf-connecting-ip");
  return trusted?.split(",")[0]?.trim() || "shared";
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "err.rateLimit" },
      { status: 429 },
    );
  }

  let body: Partial<EnquiryInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "err.malformed" },
      { status: 400 },
    );
  }

  // Honeypot: bots fill hidden fields. Report success so they don't retry.
  if (body.company) return NextResponse.json({ ok: true });

  const errors = validateEnquiry(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const name = body.name!.trim();
  const email = body.email!.trim();
  const message = body.message!.trim();
  const occasion = body.occasion?.trim() || "Not specified";
  const timeline = body.timeline?.trim() || "Not specified";

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM;
  const key = process.env.RESEND_API_KEY;

  // Without credentials (local dev), log and succeed so the UI is testable.
  if (!key || !to || !from) {
    console.warn(
      "[contact] Resend not configured — enquiry not emailed.\n",
      { name, email, occasion, timeline, message },
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New enquiry — ${name} (${occasion})`,
      text: [
        `Name:     ${name}`,
        `Email:    ${email}`,
        `Occasion: ${occasion}`,
        `Timeline: ${timeline}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#241f1b;line-height:1.6">
          <h2 style="font-weight:400;margin:0 0 16px">New enquiry</h2>
          <table style="border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:4px 16px 4px 0;color:#6b6259">Name</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:4px 16px 4px 0;color:#6b6259">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:4px 16px 4px 0;color:#6b6259">Occasion</td><td>${escapeHtml(occasion)}</td></tr>
            <tr><td style="padding:4px 16px 4px 0;color:#6b6259">Timeline</td><td>${escapeHtml(timeline)}</td></tr>
          </table>
          <div style="white-space:pre-wrap;border-left:2px solid #1f4d3d;padding-left:16px">${escapeHtml(message)}</div>
        </div>`,
    });

    if (error) {
      console.error("[contact] Resend error", error);
      return NextResponse.json(
        { ok: false, error: "err.sendFailed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: "err.sendFailed",
      },
      { status: 502 },
    );
  }
}
