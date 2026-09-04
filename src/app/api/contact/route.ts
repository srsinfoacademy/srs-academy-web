import { NextResponse } from "next/server";
import { Resend } from "resend";

import { site } from "@/content/site";
import { checkRateLimit } from "@/lib/contact/rate-limit";
import type { ContactEnquiryPayload } from "@/lib/contact/types";

export const runtime = "nodejs";

const MAX_LENGTHS = {
  name: 200,
  email: 320,
  phone: 40,
  subject: 200,
  message: 5000,
  sourcePage: 200,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Too fast to be a human filling in the form — a bot submitting immediately on load. */
const MIN_FILL_TIME_MS = 1200;

type ValidatedEnquiry = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  sourcePage: string;
};

function validate(body: unknown): ValidatedEnquiry | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Partial<ContactEnquiryPayload>;

  if (typeof b.name !== "string" || typeof b.email !== "string" || typeof b.message !== "string") {
    return null;
  }

  const name = b.name.trim();
  const email = b.email.trim();
  const message = b.message.trim();
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const sourcePage = typeof b.sourcePage === "string" ? b.sourcePage.trim() : "";

  if (!name || name.length > MAX_LENGTHS.name) return null;
  if (!email || email.length > MAX_LENGTHS.email || !EMAIL_RE.test(email)) return null;
  if (!message || message.length > MAX_LENGTHS.message) return null;
  if (phone.length > MAX_LENGTHS.phone) return null;
  if (subject.length > MAX_LENGTHS.subject) return null;
  if (sourcePage.length > MAX_LENGTHS.sourcePage) return null;

  return {
    name,
    email,
    message,
    ...(phone ? { phone } : {}),
    ...(subject ? { subject } : {}),
    sourcePage: sourcePage || "unknown",
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function notificationEmailHtml(enquiry: ValidatedEnquiry, submittedAt: string): string {
  const rows: Array<[string, string]> = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone ?? "—"],
    ["Enquiry type", enquiry.subject ?? "—"],
    ["Submitted", submittedAt],
    ["Source page", enquiry.sourcePage],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;font-size:14px;color:#111;">
      <h2 style="margin:0 0 16px;">New enquiry from ${escapeHtml(site.name)} website</h2>
      <table style="border-collapse:collapse;margin-bottom:16px;">${rowsHtml}</table>
      <p style="margin:0 0 4px;color:#666;">Message</p>
      <p style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px;margin:0;">${escapeHtml(enquiry.message)}</p>
    </div>
  `;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const body = raw as Partial<ContactEnquiryPayload> | null;

  // Honeypot: a hidden field no human fills in. A non-empty value is a bot —
  // report success without sending anything, rather than telling the bot it
  // was caught (which only teaches it to leave the field blank next time).
  if (typeof body?.honeypot === "string" && body.honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Also reject submissions that arrive implausibly fast after the form
  // rendered — the same "obviously not a human" signal, checked server-side
  // since a bot can simply skip client-side checks.
  if (
    typeof body?.formRenderedAt !== "number" ||
    Date.now() - body.formRenderedAt < MIN_FILL_TIME_MS
  ) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const enquiry = validate(body);
  if (!enquiry) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.error("Contact form: RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.");
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const notification = await resend.emails.send({
    from: fromEmail,
    to: site.contact.email,
    replyTo: enquiry.email,
    subject: `New enquiry — ${enquiry.subject || "General"} — ${enquiry.name}`,
    html: notificationEmailHtml(enquiry, submittedAt),
  });

  if (notification.error) {
    console.error("Contact form: failed to send notification email.", notification.error);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  // Confirmation email is a courtesy — its failure doesn't fail the request,
  // since the notification (the part that actually matters) already sent.
  try {
    await resend.emails.send({
      from: fromEmail,
      to: enquiry.email,
      replyTo: site.contact.email,
      subject: `We've received your enquiry — ${site.name}`,
      html: `<p style="font-family:sans-serif;font-size:14px;color:#111;">Thank you for contacting ${escapeHtml(site.name)}. We have received your enquiry and will get back to you as soon as possible.</p>`,
    });
  } catch (error) {
    console.error("Contact form: failed to send visitor confirmation email.", error);
  }

  return NextResponse.json({ ok: true });
}
