import { catalogueCourses } from "@/content/catalogue/courses";
import { sharedCategoryOf } from "@/content/catalogue/categories";
import { detailFor } from "@/content/program-detail";
import { programs } from "@/content/programs";
import type { NormalizedCourse } from "@/content/catalogue/types";

/**
 * The master course-content template — one editor-friendly row per real
 * catalogue course, covering every field SRS Academy might gradually
 * confirm. This is a VIEW, computed from the live data both themes already
 * read (`catalogueCourses` for the 22 imported courses, `program-detail.ts`
 * for Full Stack Web Development's existing rich content) — it is not a
 * second data store, so it can never drift out of sync or duplicate a
 * course object. Editing a course's real content still means editing
 * `src/content/catalogue/enrichment.ts` (see that file's own header for
 * how); this template exists to make it easy to see, all in one place,
 * what's already known and what SRS Academy still needs to confirm.
 *
 * Nothing here invents a value: a field is populated only when the live
 * data already has it (from the spreadsheet, from approved enrichment, or
 * from Full Stack's confirmed detail copy); everything else is `null`.
 *
 * Export this to CSV/XLSX with `scripts/generate-course-template.ts`
 * (`pnpm dlx tsx scripts/generate-course-template.ts`).
 */

/** The 7 fields SRS Academy is expected to gradually confirm — used for both completeness scoring and the missing-field report. */
export const TRACKED_FIELDS = [
  "mode",
  "level",
  "overview",
  "outcomes",
  "eligibility",
  "certification",
  "fees",
] as const;

export type TrackedField = (typeof TRACKED_FIELDS)[number];

export type CompletenessState = "complete" | "partial" | "minimal";

export type Completeness = {
  state: CompletenessState;
  /** Share of `TRACKED_FIELDS` that are populated, 0–100. */
  percent: number;
  missingFields: TrackedField[];
};

export type MasterCourseRow = {
  slug: string;
  courseCode: string | null;
  courseName: string;
  category: string | null;
  subcategory: string | null;
  courseType: string | null;
  duration: string;
  mode: string[] | null;
  level: string | null;
  overview: string | null;
  outcomes: string[] | null;
  eligibility: string[] | null;
  certification: string | null;
  fees: string | null;
  curriculum: string[];
  featured: boolean;
  status: string;
  notes: string | null;
  completeness: Completeness;
};

function completenessOf(row: Pick<MasterCourseRow, TrackedField>): Completeness {
  const missingFields = TRACKED_FIELDS.filter((field) => {
    const value = row[field];
    return value === null || (Array.isArray(value) && value.length === 0);
  });

  const populated = TRACKED_FIELDS.length - missingFields.length;
  const percent = Math.round((populated / TRACKED_FIELDS.length) * 100);
  const state: CompletenessState = percent === 100 ? "complete" : percent === 0 ? "minimal" : "partial";

  return { state, percent, missingFields };
}

function fromCatalogueCourse(course: NormalizedCourse): MasterCourseRow {
  const category = sharedCategoryOf(course.category);
  const base = {
    mode: course.mode,
    level: course.level,
    overview: course.overview,
    outcomes: course.outcomes,
    eligibility: course.eligibility,
    certification: course.certification,
    fees: course.fees,
  };

  return {
    slug: course.slug,
    courseCode: course.courseCode,
    courseName: course.name,
    category: category?.label ?? null,
    subcategory: course.subcategory,
    courseType: course.courseType,
    duration: course.duration.raw,
    ...base,
    curriculum: course.curriculumModules ? course.curriculumModules.flatMap((m) => m.topics) : course.curriculum,
    featured: course.featured,
    status: course.status,
    notes: course.notes,
    completeness: completenessOf(base),
  };
}

/**
 * Full Stack Web Development isn't part of `catalogueCourses` (see that
 * file's header) — it's rebuilt here from the same rich, hand-authored
 * detail the live pages already render, so the template still covers all
 * 23 real courses without duplicating that content a third time.
 */
function fullStackRow(): MasterCourseRow | null {
  const program = programs.find((p) => p.slug === "full-stack-web-development");
  const detail = detailFor("full-stack-web-development");
  if (!program || !detail) return null;

  const certification =
    typeof detail.certification === "string"
      ? detail.certification
      : detail.certification
        ? `${detail.certification.name} — issued by ${detail.certification.issuedBy}`
        : null;

  const base = {
    mode: program.mode ? [program.mode] : null,
    level: program.level ?? null,
    overview: detail.overview ?? null,
    outcomes: detail.learningOutcomes ?? null,
    eligibility: detail.eligibility ?? null,
    certification,
    fees: typeof detail.fees === "string" ? detail.fees : (detail.fees?.program ?? null),
  };

  return {
    slug: program.slug,
    courseCode: null,
    courseName: program.name,
    category: "Web & Software Development",
    subcategory: null,
    courseType: null,
    duration: program.duration,
    ...base,
    curriculum: detail.modules.flatMap((m) => m.topics ?? []),
    featured: true,
    status: "live",
    notes:
      detail.certification && typeof detail.certification !== "string"
        ? "Certificate verification method not yet documented (shows as unconfirmed on the live page)."
        : null,
    completeness: completenessOf(base),
  };
}

export const masterCourseTemplate: MasterCourseRow[] = [
  ...catalogueCourses.map(fromCatalogueCourse),
  ...(() => {
    const row = fullStackRow();
    return row ? [row] : [];
  })(),
];

/** Fails fast if this view and the live catalogue ever disagree on course count or slugs. */
function assertTemplateMatchesCatalogue(rows: MasterCourseRow[]): void {
  const expected = catalogueCourses.length + 1; // +1 for Full Stack
  if (rows.length !== expected) {
    throw new Error(`masterCourseTemplate has ${rows.length} rows, expected ${expected}.`);
  }
  const slugs = new Set(rows.map((r) => r.slug));
  if (slugs.size !== rows.length) {
    throw new Error("masterCourseTemplate has duplicate slugs.");
  }
}

assertTemplateMatchesCatalogue(masterCourseTemplate);

/** One row per course, per tracked field it's missing — the input to the missing-field report. */
export function missingFieldReport(): { slug: string; courseName: string; missingFields: TrackedField[] }[] {
  return masterCourseTemplate
    .filter((row) => row.completeness.missingFields.length > 0)
    .map((row) => ({ slug: row.slug, courseName: row.courseName, missingFields: row.completeness.missingFields }));
}

/** Count of courses in each completeness bucket. */
export function completenessSummary(): Record<CompletenessState, number> {
  return masterCourseTemplate.reduce(
    (acc, row) => {
      acc[row.completeness.state] += 1;
      return acc;
    },
    { complete: 0, partial: 0, minimal: 0 } as Record<CompletenessState, number>,
  );
}
