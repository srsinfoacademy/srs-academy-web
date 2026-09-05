/** Shape both ContactForm implementations (dark and light) post to /api/contact. */
export type ContactEnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Hidden field a human never fills in; non-empty means a bot. */
  honeypot: string;
  /** `Date.now()` captured when the form mounted — too-fast submissions are rejected as bot-like. */
  formRenderedAt: number;
  /** Pathname the enquiry was sent from (`/contact` or `/light/contact`). */
  sourcePage: string;
};

export type ContactEnquiryResponse =
  | { ok: true }
  | { ok: false; error: "validation" | "rate_limited" | "server_error" };
