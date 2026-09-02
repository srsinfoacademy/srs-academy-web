export type UpdateCategory = "General" | "Academic" | "Admissions" | "Policy";

export type UpdateAttachment = { name: string; note: string };

export type Update = {
  slug: string;
  title: string;
  /** ISO date, formatted at render. */
  date: string;
  category: UpdateCategory;
  referenceNumber: string;
  summary: string;
  body: string[];
  attachments?: UpdateAttachment[];
};

export const updateFilters = ["All", "General", "Academic", "Admissions", "Policy"] as const;

/**
 * Notices.
 *
 * Deliberately empty. The design set is explicit: "No notices are invented —
 * content ships empty until real notices exist." The list therefore renders
 * its no-content state, and /updates/[slug] generates no pages until real
 * notices are added here.
 */
export const updates: Update[] = [];

export function updateBySlug(slug: string): Update | undefined {
  return updates.find((update) => update.slug === slug);
}

/** Two or three others in the same category, for the detail page. */
export function relatedUpdates(slug: string, limit = 3): Update[] {
  const current = updateBySlug(slug);
  if (!current) return [];
  return updates
    .filter((u) => u.slug !== slug && u.category === current.category)
    .slice(0, limit);
}

export function formatUpdateDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
