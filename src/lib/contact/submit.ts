import type { ContactEnquiryPayload, ContactEnquiryResponse } from "@/lib/contact/types";

/**
 * The one client-side call both ContactForm components (dark and light) make
 * — the only thing shared between them client-side, since their field sets
 * and markup are otherwise intentionally separate. The real shared logic
 * (validation, spam checks, sending) lives entirely in the API route.
 */
export async function submitContactEnquiry(
  payload: ContactEnquiryPayload,
): Promise<ContactEnquiryResponse> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as ContactEnquiryResponse | null;
    if (data && typeof data.ok === "boolean") return data;
    return { ok: false, error: "server_error" };
  } catch {
    return { ok: false, error: "server_error" };
  }
}
