/**
 * Duration buckets for the /courses filter. Client-safe and dependency-free.
 *
 * Course durations are free text ("6 months", "1 year", "120 hours",
 * "15 days", "Approx. 4–6 months"). They are converted to months with
 * 1 month = 30 days, 1 week = 7 days, 1 year = 12 months and
 * 1 hour = 1/24 day. Several parts add up ("1 year 6 months"); a range
 * ("4–6 months") counts as its upper end. Text without a number and a
 * unit ("To be confirmed") does not parse and belongs to no bucket.
 */

export const durationBuckets = [
  { id: "under-1-month", label: "Under 1 month" },
  { id: "1-3-months", label: "1–3 months" },
  { id: "3-6-months", label: "3–6 months" },
  { id: "6-12-months", label: "6–12 months" },
  { id: "over-1-year", label: "Over 1 year" },
] as const;

export type DurationBucketId = (typeof durationBuckets)[number]["id"];

const UNIT_MONTHS: Record<string, number> = {
  hour: 1 / (24 * 30),
  day: 1 / 30,
  week: 7 / 30,
  month: 1,
  year: 12,
};

function unitOf(word: string): keyof typeof UNIT_MONTHS | null {
  const w = word.toLowerCase();
  if (/^(h|hr|hrs|hour|hours)$/.test(w)) return "hour";
  if (/^(d|day|days)$/.test(w)) return "day";
  if (/^(w|wk|wks|week|weeks)$/.test(w)) return "week";
  if (/^(m|mo|mos|mon|mons|month|months)$/.test(w)) return "month";
  if (/^(y|yr|yrs|year|years)$/.test(w)) return "year";
  return null;
}

/** Length in months, or null when the text has no number + unit. */
export function parseDurationMonths(text: string | null | undefined): number | null {
  if (!text) return null;
  // "<n>" or "<n>–<m>" (any dash or "to"), then a unit word.
  const re = /(\d+(?:\.\d+)?)(?:\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?))?\s*([a-z]+)/gi;
  let total = 0;
  let found = false;
  for (const match of text.matchAll(re)) {
    const unit = unitOf(match[3]);
    if (!unit) continue;
    const value = Number(match[2] ?? match[1]);
    if (!Number.isFinite(value)) continue;
    total += value * UNIT_MONTHS[unit];
    found = true;
  }
  return found && total > 0 ? total : null;
}

/** Floating-point safety for exact boundaries (e.g. 30 days = 1 month). */
const EPS = 1e-9;

/**
 * Under 1 month: < 1. 1–3 months: 1 to 3 inclusive. 3–6: over 3 up to 6.
 * 6–12: over 6 up to 12. Over 1 year: over 12.
 */
export function bucketForMonths(months: number): DurationBucketId {
  if (months < 1 - EPS) return "under-1-month";
  if (months <= 3 + EPS) return "1-3-months";
  if (months <= 6 + EPS) return "3-6-months";
  if (months <= 12 + EPS) return "6-12-months";
  return "over-1-year";
}

/** Bucket for a duration text, or null when it doesn't parse. */
export function durationBucket(text: string | null | undefined): DurationBucketId | null {
  const months = parseDurationMonths(text);
  return months === null ? null : bucketForMonths(months);
}

export function isDurationBucketId(value: string | null | undefined): value is DurationBucketId {
  return durationBuckets.some((bucket) => bucket.id === value);
}
