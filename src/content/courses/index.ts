import catalogueData from "@/content/courses/courses.json";
import redirectData from "@/content/courses/redirects.json";
import { featuredPrograms, homeFeaturedCodes } from "@/content/courses/featured-programs";
import type { CatalogueCourse, Course, CourseCardData, SiteRedirect } from "@/content/courses/types";
import { site, type SiteImage } from "@/content/site";

/**
 * Course helpers. Pages should use these functions rather than importing the
 * JSON directly.
 *
 * Catalogue filters the redesign still needs to honour:
 * - `/courses?q=` matches name, code, category and topics
 * - `/courses?category=` matches `Course.category` (Computer, Vocational, …)
 * - `/courses/[slug]` is one static page per course, including the five SRS programs
 *
 * `legacyRedirects` is intentionally not wired in next.config.ts yet. Enable
 * it only after those destination routes exist.
 */

const catalogueCourses: Course[] = (catalogueData as CatalogueCourse[]).map((course) => ({
  ...course,
  origin: "catalogue" as const,
}));

const merged = new Map<string, Course>();
for (const course of featuredPrograms) merged.set(course.slug, course);
for (const course of catalogueCourses) {
  if (!merged.has(course.slug)) merged.set(course.slug, course);
}

export const courses: readonly Course[] = [...merged.values()].sort((a, b) => {
  if (a.origin !== b.origin) return a.origin === "srs" ? -1 : 1;
  return a.sno - b.sno || a.name.localeCompare(b.name);
});

/** The spreadsheet catalogue only — the SRS programs are listed separately. */
const catalogueOnly: readonly Course[] = courses.filter((course) => course.origin === "catalogue");

const bySlug = new Map(courses.map((course) => [course.slug, course]));
const byCode = new Map(courses.map((course) => [course.code, course]));

/** Every course page: the SRS programs plus the spreadsheet catalogue. */
export function getAllCourses(): readonly Course[] {
  return courses;
}

/** Spreadsheet catalogue rows only (what /courses lists and counts). */
export function getCatalogueCourses(): readonly Course[] {
  return catalogueOnly;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return bySlug.get(slug);
}

export function getCourseByCode(code: string): Course | undefined {
  return byCode.get(code);
}

export { coursePath } from "@/content/courses/paths";

/** Catalogue categories with counts, from the spreadsheet rows only. */
export function getCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const course of catalogueOnly) counts.set(course.category, (counts.get(course.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function getCoursesByCategory(category: string): Course[] {
  if (!category || category === "All") return [...catalogueOnly];
  return catalogueOnly.filter((course) => course.category === category);
}

/** Case-insensitive match on name, code, category, summary and topic lines. */
export function searchCourses(query: string, category?: string): Course[] {
  const pool = getCoursesByCategory(category && category !== "All" ? category : "All");
  const needle = query.trim().toLowerCase();
  if (!needle) return pool;
  return pool.filter((course) => {
    const haystack = [course.name, course.code, course.category, course.summary ?? "", ...course.modules]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function relatedCourses(slug: string, limit = 3): Course[] {
  const current = getCourseBySlug(slug);
  if (!current) return [];
  const same = courses.filter((course) => course.slug !== slug && course.category === current.category);
  const rest = courses.filter((course) => course.slug !== slug && course.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}

export function getHomeFeaturedCourses(): Course[] {
  return homeFeaturedCodes
    .map((code) => getCourseByCode(code))
    .filter((course): course is Course => course !== undefined);
}

/** The SRS programs, in the order defined in featured-programs.ts (Full Stack first). */
export function getSrsPrograms(): Course[] {
  return featuredPrograms
    .map((program) => bySlug.get(program.slug))
    .filter((course): course is Course => course?.origin === "srs");
}

/**
 * Homepage "three areas" grouping. Catalogue filters still use the real
 * spreadsheet categories; these areas only curate the home page.
 */
export const courseAreas = [
  {
    id: "computer-technology",
    num: "01",
    name: "Computer & Technology",
    description: "Software, office, programming and digital courses, from first skills to longer diplomas.",
    categories: ["Computer", "Project", "Professional", "Technical Training"],
  },
  {
    id: "vocational",
    num: "02",
    name: "Vocational Skills",
    description: "Practical beauty, tailoring, food and other hands-on vocational courses.",
    categories: ["Vocational", "Professional Vocational"],
  },
  {
    id: "career-office",
    num: "03",
    name: "Career, Office & School",
    description: "Typing, stenography, school courses and short internship programs.",
    categories: ["Typing", "Stenography", "School", "Internship"],
  },
] as const;

export function coursesInArea(areaId: string): Course[] {
  const area = courseAreas.find((item) => item.id === areaId);
  if (!area) return [];
  const allowed = new Set<string>(area.categories);
  return catalogueOnly.filter((course) => allowed.has(course.category));
}

export const legacyRedirects = redirectData as SiteRedirect[];

/** Photo for a course card, when the homepage set has one. */
export function courseImage(course: Course): SiteImage | undefined {
  return (site.imagery.courses as Record<string, SiteImage>)[course.code];
}

/** Slim card data. `withImage` attaches the photo when one exists. */
export function toCourseCard(course: Course, withImage = false): CourseCardData {
  const image = withImage ? courseImage(course) : undefined;
  return {
    slug: course.slug,
    name: course.name,
    category: course.category,
    code: course.code,
    duration: course.duration,
    moduleCount: course.modules.length,
    origin: course.origin,
    search: [course.name, course.code, course.category, course.summary ?? "", ...course.modules]
      .join(" ")
      .toLowerCase(),
    ...(image ? { image } : {}),
  };
}
