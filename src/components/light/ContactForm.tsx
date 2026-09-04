"use client";

import { useId, useRef, useState } from "react";

import { submitContactEnquiry } from "@/lib/contact/submit";

/** Minimum gap between two submit attempts, guarding against a double-click race. */
const RESUBMIT_GUARD_MS = 2000;

/**
 * A clean, non-glass contact form — forms are explicitly excluded from
 * glass treatment per the Master Consolidation ("legal text, forms... are
 * never glassified"). Submits to the same /api/contact route the dark
 * theme's form uses.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const baseId = useId();
  const [formRenderedAt] = useState(() => Date.now());
  const lastSubmitAtRef = useRef(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitAtRef.current < RESUBMIT_GUARD_MS) return;
    lastSubmitAtRef.current = now;

    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    const result = await submitContactEnquiry({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      honeypot,
      formRenderedAt,
      sourcePage: window.location.pathname,
    });
    setStatus(result.ok ? "done" : "error");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-130 flex-col gap-5 rounded-[var(--radius-sl-lg)] border border-sl-ink/10 bg-white p-7"
      aria-describedby="contact-form-note"
    >
      {/* Honeypot — off-screen and unreachable by keyboard, never seen by a real visitor. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${baseId}-company`}>Leave this field empty</label>
        <input
          id={`${baseId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-semibold">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="sl-focus rounded-[var(--radius-sl-sm)] border border-sl-ink/18 px-3.5 py-2.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="sl-focus rounded-[var(--radius-sl-sm)] border border-sl-ink/18 px-3.5 py-2.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="sl-focus rounded-[var(--radius-sl-sm)] border border-sl-ink/18 px-3.5 py-2.5 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="sl-focus rounded-[var(--radius-sl-md)] bg-sl-ink px-6 py-3 text-sm font-semibold text-sl-paper transition-[background-color] hover:bg-black disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p id="contact-form-note" className="text-xs text-sl-ink/50" role="status">
        {status === "done"
          ? "Thank you. Your enquiry has been received."
          : status === "error"
            ? "We couldn't send your enquiry right now. Please try again or contact us directly."
            : null}
      </p>
    </form>
  );
}
