import "server-only";

import { unstable_cache } from "next/cache";

import { seedContact } from "@/lib/data/seed";
import { docPaths, readJson, writeJson } from "@/lib/data/store";
import { socialIds, socialLabels, type ContactDoc, type SocialId } from "@/lib/data/types";

/**
 * Contact facts shown in the footer, the contact block and the enquiry
 * section, plus the enquiry notification inbox. Seeded from site.ts.
 */

export const CONTACT_TAG = "contact";

export async function readContact(): Promise<ContactDoc> {
  const stored = await readJson<Partial<ContactDoc>>(docPaths.contact);
  const seed = seedContact();
  if (!stored) return seed;
  return { ...seed, ...stored, social: { ...seed.social, ...(stored.social ?? {}) } };
}

export async function writeContact(doc: Omit<ContactDoc, "version" | "updatedAt">): Promise<ContactDoc> {
  const saved: ContactDoc = { ...doc, version: 1, updatedAt: new Date().toISOString() };
  await writeJson(docPaths.contact, saved);
  return saved;
}

/** Cached for public pages (tag `contact`). */
export const getPublicContact = unstable_cache(readContact, ["srs-data-contact-v1"], { tags: [CONTACT_TAG] });

/* ---------- helpers mirroring the old site.ts ones, driven by the doc ---------- */

export function contactPhone(doc: ContactDoc): string | null {
  const phone = doc.phone.trim();
  return phone ? phone : null;
}

export function contactTelHref(doc: ContactDoc): string | null {
  const phone = contactPhone(doc);
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:+${digits}` : null;
}

export function contactWhatsappHref(doc: ContactDoc): string | null {
  const digits = doc.whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function contactHoursSummary(doc: ContactDoc): string {
  return doc.hours.map((row) => [row.days, row.time].filter(Boolean).join(" ")).join(" · ");
}

export type PublicSocialLink = { label: string; href: string; icon: SocialId };

export function contactSocialLinks(doc: ContactDoc): PublicSocialLink[] {
  return socialIds
    .filter((id) => doc.social[id]?.trim())
    .map((id) => ({ label: socialLabels[id], href: doc.social[id].trim(), icon: id }));
}

export type PublicContactFact = { label: string; value: string; href?: string };

/** Rows safe to render. Empty fields are left out. */
export function contactFactsFrom(doc: ContactDoc, locationSummary: string): PublicContactFact[] {
  const facts: PublicContactFact[] = [];
  if (doc.address) facts.push({ label: "Address", value: doc.address });
  if (doc.email) facts.push({ label: "Email", value: doc.email, href: `mailto:${doc.email}` });
  const phone = contactPhone(doc);
  const tel = contactTelHref(doc);
  if (phone && tel) facts.push({ label: "Phone", value: phone, href: tel });
  facts.push({ label: "Learning", value: locationSummary });
  const hours = contactHoursSummary(doc);
  if (hours) facts.push({ label: "Hours", value: hours });
  const whatsapp = contactWhatsappHref(doc);
  if (whatsapp) facts.push({ label: "WhatsApp", value: phone ?? `+${doc.whatsapp}`, href: whatsapp });
  return facts;
}
