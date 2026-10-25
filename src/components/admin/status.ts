import type { PillTone } from "@/components/admin/ui";
import { enquiryStatusLabels, type EnquiryStatus } from "@/lib/data/types";

export const enquiryTone: Record<EnquiryStatus, PillTone> = {
  new: "s",
  contacted: "b",
  "follow-up": "g",
  closed: "n",
};

export function enquiryLabel(status: EnquiryStatus): string {
  return enquiryStatusLabels[status] ?? status;
}

/** "25 Oct 2026, 4:05 pm" in India time. */
export function formatDateTime(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
