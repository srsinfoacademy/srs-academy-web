import "server-only";

import { randomUUID } from "node:crypto";

import { unstable_cache } from "next/cache";

import { featuredPrograms, homeFeaturedCodes } from "@/content/courses/featured-programs";
import type { CourseCardData } from "@/content/courses/types";
import { site, type SiteImage } from "@/content/site";
import { seedCategories, seedCourses } from "@/lib/data/seed";
import { slugify } from "@/lib/data/schemas";
import { docPaths, readJson, writeJson } from "@/lib/data/store";
import type { CategoriesDoc, CategoryRecord, CategoryWithCount, CourseRecord, CoursesDoc } from "@/lib/data/types";

/**
 * Courses and categories: one module for the public site and the admin.
 *
 * Public pages call the `getPublic*` helpers, which read through
 * `unstable_cache` tagged `courses` / `categories`. Admin saves write the
 * document and then call `revalidatePublicData()` (src/lib/data/revalidate.ts).
 *
 * A course is on the website when it is published AND its category is visible.
 */

export const COURSES_TAG = "courses";
export const CATEGORIES_TAG = "categories";

/* ---------- raw documents (uncached; admin and mutations) ---------- */

export async function readCourses(): Promise<CourseRecord[]> {
  const doc = await readJson<CoursesDoc>(docPaths.courses);
  return doc?.courses ?? seedCourses();
}

export async function writeCourses(courses: CourseRecord[]): Promise<void> {
  const doc: CoursesDoc = { version: 1, updatedAt: new Date().toISOString(), courses };
  await writeJson(docPaths.courses, doc);
}

/** Stored order, plus any category a course uses that is not stored yet (appended, visible). */
export function mergeCategories(stored: CategoryRecord[] | null, courses: readonly CourseRecord[]): CategoryRecord[] {
  const base = stored ?? seedCategories(courses);
  const names = new Set(base.map((category) => category.name));
  const extra: CategoryRecord[] = [];
  for (const course of courses) {
    if (!names.has(course.category)) {
      names.add(course.category);
      extra.push({ id: `k-${slugify(course.category)}-${extra.length}`, name: course.category, slug: slugify(course.category), visible: true });
    }
  }
  return [...base, ...extra];
}

export async function readCategories(courses?: readonly CourseRecord[]): Promise<CategoryRecord[]> {
  const [doc, list] = await Promise.all([
    readJson<CategoriesDoc>(docPaths.categories),
    courses ? Promise.resolve(courses) : readCourses(),
  ]);
  return mergeCategories(doc?.categories ?? null, list);
}

export async function writeCategories(categories: CategoryRecord[]): Promise<void> {
  const doc: CategoriesDoc = { version: 1, updatedAt: new Date().toISOString(), categories };
  await writeJson(docPaths.categories, doc);
}

export function withCounts(categories: CategoryRecord[], courses: readonly CourseRecord[]): CategoryWithCount[] {
  return categories.map((category) => {
    const inCategory = courses.filter((course) => course.category === category.name);
    return { ...category, count: inCategory.length, publishedCount: inCategory.filter((course) => course.published).length };
  });
}

export function newCourseId(): string {
  return `n${Date.now().toString(36)}${randomUUID().slice(0, 6)}`;
}

export function newCategoryId(name: string): string {
  return `k-${slugify(name) || "category"}-${randomUUID().slice(0, 6)}`;
}

/** Slug free of collisions: the name slug, then `-{code}`, then a counter. */
export function uniqueSlug(base: string, code: string, taken: Set<string>): string {
  const root = slugify(base) || "course";
  if (!taken.has(root)) return root;
  const withCode = `${root}-${slugify(code)}`;
  if (code && !taken.has(withCode)) return withCode;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

/* ---------- cached public reads ---------- */

const cachedCourses = unstable_cache(readCourses, ["srs-data-courses-v1"], { tags: [COURSES_TAG] });

const cachedCategoryDoc = unstable_cache(
  async () => (await readJson<CategoriesDoc>(docPaths.categories))?.categories ?? null,
  ["srs-data-categories-v1"],
  { tags: [CATEGORIES_TAG] },
);

const srsOrder = new Map(featuredPrograms.map((program, index) => [program.slug, index]));

function sortCourses(a: CourseRecord, b: CourseRecord): number {
  if (a.origin !== b.origin) return a.origin === "srs" ? -1 : 1;
  if (a.origin === "srs") return (srsOrder.get(a.slug) ?? 99) - (srsOrder.get(b.slug) ?? 99) || a.name.localeCompare(b.name);
  return a.sno - b.sno || a.name.localeCompare(b.name);
}

type PublicData = {
  courses: CourseRecord[];
  categories: CategoryRecord[];
};

async function publicData(): Promise<PublicData> {
  const all = await cachedCourses();
  const categories = mergeCategories(await cachedCategoryDoc(), all);
  const visible = new Set(categories.filter((category) => category.visible).map((category) => category.name));
  const courses = all.filter((course) => course.published && visible.has(course.category)).sort(sortCourses);
  return { courses, categories: categories.filter((category) => category.visible) };
}

/** Every public course page: SRS programs plus catalogue rows that are published and visible. */
export async function getPublicCourses(): Promise<CourseRecord[]> {
  return (await publicData()).courses;
}

/** Catalogue rows only (what /courses lists and counts). Admin-created courses count as catalogue. */
export async function getPublicCatalogue(): Promise<CourseRecord[]> {
  return (await publicData()).courses.filter((course) => course.origin === "catalogue");
}

export async function getPublicSrsPrograms(): Promise<CourseRecord[]> {
  return (await publicData()).courses.filter((course) => course.origin === "srs");
}

export async function getPublicCourseBySlug(slug: string): Promise<CourseRecord | undefined> {
  return (await publicData()).courses.find((course) => course.slug === slug);
}

/** Visible catalogue categories in admin order, with public course counts; empty ones are left out. */
export async function getPublicCategories(): Promise<{ category: string; slug: string; count: number }[]> {
  const { courses, categories } = await publicData();
  const counts = new Map<string, number>();
  for (const course of courses) {
    if (course.origin === "catalogue") counts.set(course.category, (counts.get(course.category) ?? 0) + 1);
  }
  return categories
    .map((category) => ({ category: category.name, slug: category.slug, count: counts.get(category.name) ?? 0 }))
    .filter((item) => item.count > 0);
}

export async function getPublicRelatedCourses(slug: string, limit = 3): Promise<CourseRecord[]> {
  const { courses } = await publicData();
  const current = courses.find((course) => course.slug === slug);
  if (!current) return [];
  const same = courses.filter((course) => course.slug !== slug && course.category === current.category);
  const rest = courses.filter((course) => course.slug !== slug && course.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}

export async function getPublicHomeFeatured(): Promise<CourseRecord[]> {
  const { courses } = await publicData();
  return homeFeaturedCodes
    .map((code) => courses.find((course) => course.code === code))
    .filter((course): course is CourseRecord => course !== undefined);
}

/* ---------- card mapping ---------- */

const siteCourseImages = site.imagery.courses as Record<string, SiteImage>;

/** Photo for a card: the course image, with the Unsplash credit when it is one of the site stand-ins. */
export function courseCardImage(course: CourseRecord): SiteImage | undefined {
  if (!course.image) return undefined;
  const known = Object.values(siteCourseImages).find((image) => image.src === course.image);
  return known ?? { src: course.image, alt: "", credit: "", creditHref: "" };
}

export function toPublicCard(course: CourseRecord, withImage = false): CourseCardData {
  const image = withImage ? courseCardImage(course) : undefined;
  return {
    slug: course.slug,
    name: course.name,
    category: course.category,
    code: course.code,
    duration: course.duration || "To be confirmed",
    moduleCount: course.modules.length,
    origin: course.origin,
    topicText: course.modules.join(" | "),
    ...(image ? { image } : {}),
  };
}
