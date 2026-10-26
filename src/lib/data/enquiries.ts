import "server-only";

import { randomUUID } from "node:crypto";

import { docPaths, listPaths, readJson, writeJson } from "@/lib/data/store";
import type { EnquiryRecord, EnquiryStatus } from "@/lib/data/types";

/**
 * Website enquiries, one JSON document per enquiry: enquiries/<id>.json.
 * Ids start with a time component so a plain sort is newest-last.
 */

const ID_RE = /^e[0-9a-z]{8,14}-[0-9a-f]{8}$/;

export function isEnquiryId(id: string): boolean {
  return ID_RE.test(id);
}

export async function createEnquiry(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  sourcePage: string;
}): Promise<EnquiryRecord> {
  const now = new Date();
  const record: EnquiryRecord = {
    id: `e${now.getTime().toString(36)}-${randomUUID().slice(0, 8)}`,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    subject: input.subject ?? "",
    message: input.message,
    sourcePage: input.sourcePage,
    status: "new",
    notes: [],
  };
  await writeJson(docPaths.enquiry(record.id), record);
  return record;
}

export async function getEnquiry(id: string): Promise<EnquiryRecord | null> {
  if (!isEnquiryId(id)) return null;
  return readJson<EnquiryRecord>(docPaths.enquiry(id));
}

export async function saveEnquiry(record: EnquiryRecord): Promise<EnquiryRecord> {
  const saved = { ...record, updatedAt: new Date().toISOString() };
  await writeJson(docPaths.enquiry(record.id), saved);
  return saved;
}

/** Newest first. Reads documents in small parallel batches. */
export async function listEnquiries(): Promise<EnquiryRecord[]> {
  const paths = (await listPaths(docPaths.enquiriesPrefix)).filter((p) => p.endsWith(".json"));
  const out: EnquiryRecord[] = [];
  const BATCH = 16;
  for (let i = 0; i < paths.length; i += BATCH) {
    const batch = await Promise.all(paths.slice(i, i + BATCH).map((p) => readJson<EnquiryRecord>(p).catch(() => null)));
    for (const record of batch) if (record) out.push(record);
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function countByStatus(list: EnquiryRecord[]): Record<EnquiryStatus, number> {
  const counts: Record<EnquiryStatus, number> = { new: 0, contacted: 0, "follow-up": 0, closed: 0 };
  for (const item of list) counts[item.status] = (counts[item.status] ?? 0) + 1;
  return counts;
}
