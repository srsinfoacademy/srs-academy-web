import { sharedCategories, sharedCategoryOf } from "@/content/catalogue/categories";
import type { CourseEnrichment, NormalizedCourse } from "@/content/catalogue/types";

/** Best-effort split of the spreadsheet's "Course Curriculum / Topics" prose into topics. */
export function splitCurriculum(raw: string): string[] {
  return raw
    .trim()
    .replace(/\.$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** kebab-case slug from a normalized display name. Apostrophes drop; "&" reads as "and". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** True only when every course's slug is unique — used by the QA pass, not at runtime. */
export function findSlugCollisions(list: NormalizedCourse[]): string[] {
  const seen = new Map<string, number>();
  for (const c of list) seen.set(c.slug, (seen.get(c.slug) ?? 0) + 1);
  return [...seen.entries()].filter(([, count]) => count > 1).map(([slug]) => slug);
}

/**
 * Case-insensitive search across every field the SEARCH requirement lists:
 * normalized name, source name, course code, category, subcategory, tags,
 * curriculum keywords.
 */
export function searchCourses(list: NormalizedCourse[], query: string): NormalizedCourse[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((course) => {
    const category = sharedCategoryOf(course.category);
    const haystack = [
      course.name,
      course.sourceName,
      course.courseCode ?? "",
      category?.label ?? "",
      course.subcategory ?? "",
      ...course.tags,
      ...course.curriculum,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

/** Distinct, non-null course types actually present in `list` — for the Course Type filter. */
export function courseTypeOptions(list: NormalizedCourse[]): string[] {
  return [...new Set(list.map((c) => c.courseType).filter((t): t is NonNullable<typeof t> => t !== null))].sort();
}

/** Distinct duration buckets actually present, ordered short → long. */
export function durationRawOptions(list: NormalizedCourse[]): string[] {
  const order = ["1 Month", "2 Months", "3 Months", "6 Months", "1 Year", "120 Hours"];
  const present = new Set(list.map((c) => c.duration.raw));
  return order.filter((d) => present.has(d));
}

/**
 * Merges each course with its (optional) enrichment entry, if the two
 * `Record`s share a slug — this is the one place `NormalizedCourse`'s own
 * shape and `CourseEnrichment`'s simpler one meet. A field left out of the
 * enrichment entry passes the base record's value through untouched (so an
 * always-null spreadsheet field stays null, exactly as before); a field the
 * enrichment entry does set overwrites it. Source-traceability fields
 * (`sourceName`, `sourceCourseCode`, `codeConflict`, `sourceRow`,
 * `courseCode`, `curriculum`, `curriculumRaw`) are never touched here —
 * enrichment has no way to override them.
 */
export function mergeEnrichment(
  courses: NormalizedCourse[],
  enrichment: Partial<Record<string, CourseEnrichment>>,
): NormalizedCourse[] {
  return courses.map((course) => {
    const patch = enrichment[course.slug];
    if (!patch) return course;

    return {
      ...course,
      mode: patch.mode !== undefined ? patch.mode : course.mode,
      level: patch.level !== undefined ? patch.level : course.level,
      overview: patch.overview !== undefined ? patch.overview : course.overview,
      outcomes: patch.outcomes !== undefined ? patch.outcomes : course.outcomes,
      eligibility:
        patch.eligibility !== undefined
          ? normalizeEligibility(patch.eligibility)
          : course.eligibility,
      certification: patch.certification !== undefined ? patch.certification : course.certification,
      fees: patch.fees !== undefined ? patch.fees : course.fees,
      curriculumModules: patch.curriculum !== undefined ? patch.curriculum : course.curriculumModules,
      primaryCta: patch.primaryCta !== undefined ? patch.primaryCta : course.primaryCta,
      notes: patch.notes !== undefined ? patch.notes : course.notes,
    };
  });
}

function normalizeEligibility(value: string[] | string | null): string[] | null {
  if (value === null) return null;
  return Array.isArray(value) ? value : [value];
}

export { sharedCategories };
