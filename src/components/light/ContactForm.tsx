"use client";

import { useState } from "react";

/**
 * A clean, non-glass contact form — forms are explicitly excluded from
 * glass treatment per the Master Consolidation ("legal text, forms... are
 * never glassified"). No backend exists yet, so submission is disabled and
 * clearly labelled rather than silently doing nothing.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex max-w-130 flex-col gap-5 rounded-[var(--radius-sl-lg)] border border-sl-ink/10 bg-white p-7"
      aria-describedby="contact-form-note"
    >
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
        className="sl-focus rounded-[var(--radius-sl-md)] bg-sl-ink px-6 py-3 text-sm font-semibold text-sl-paper transition-[background-color] hover:bg-black"
      >
        Send message
      </button>
      <p id="contact-form-note" className="text-xs text-sl-ink/50" role="status">
        {submitted
          ? "This preview form does not send messages yet — please use the email or phone details on this page."
          : "This is a visual preview form; it isn't connected to email yet."}
      </p>
    </form>
  );
}
