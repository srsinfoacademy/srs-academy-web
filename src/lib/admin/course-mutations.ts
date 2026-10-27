import "server-only";

import { newCourseId, readCategories, readCourses, uniqueSlug, writeCourses } from "@/lib/data/courses";
import { codeKey, matchCategory } from "@/lib/data/import-rules";
import type { CourseInput, ImportRow } from "@/lib/data/schemas";
import type { CourseRecord } from "@/lib/data/types";

/**
 * Course writes. Every function reads the latest document, applies the
 * change and writes it back; callers revalidate the public site after.
 */

export class CourseConflict extends Error {
  constructor(public fields: Record<string, string>) {
    super("Course conflict");
  }
}

export class CourseNotFound extends Error {}

async function checkInput(input: CourseInput, courses: CourseRecord[], id?: string) {
  const fields: Record<string, string> = {};
  const others = courses.filter((course) => course.id !== id);
  if (others.some((course) => course.slug === input.slug)) fields.slug = "Another course already uses this URL slug.";
  const current = courses.find((course) => course.id === id);
  const codeChanged = !current || codeKey(current.code) !== codeKey(input.code);
  if (codeChanged && others.some((course) => codeKey(course.code) === codeKey(input.code))) {
    fields.code = "Another course already uses this code.";
  }
  const categories = await readCategories(courses);
  if (!categories.some((category) => category.name === input.category)) fields.category = "Choose an existing category.";
  if (Object.keys(fields).length) throw new CourseConflict(fields);
}

function fromInput(input: CourseInput) {
  return {
    name: input.name,
    slug: input.slug,
    code: input.code,
    category: input.category,
    duration: input.duration,
    level: input.level,
    summary: input.summary,
    modules: input.modules,
    coverImage: input.coverImage,
    image: "",
    eligibility: input.eligibility,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    published: input.published,
  };
}

export async function createCourse(input: CourseInput): Promise<CourseRecord> {
  const courses = await readCourses();
  await checkInput(input, courses);
  const record: CourseRecord = {
    id: newCourseId(),
    sno: Math.max(0, ...courses.map((course) => course.sno)) + 1,
    origin: "catalogue",
    ...fromInput(input),
    updatedAt: new Date().toISOString(),
  };
  await writeCourses([...courses, record]);
  return record;
}

export async function updateCourse(id: string, input: CourseInput): Promise<CourseRecord> {
  const courses = await readCourses();
  const index = courses.findIndex((course) => course.id === id);
  if (index < 0) throw new CourseNotFound();
  await checkInput(input, courses, id);
  const record: CourseRecord = { ...courses[index], ...fromInput(input), updatedAt: new Date().toISOString() };
  const next = [...courses];
  next[index] = record;
  await writeCourses(next);
  return record;
}

export async function deleteCourses(ids: string[]): Promise<number> {
  const courses = await readCourses();
  const remove = new Set(ids);
  const next = courses.filter((course) => !remove.has(course.id));
  if (next.length !== courses.length) await writeCourses(next);
  return courses.length - next.length;
}

export async function bulkUpdate(ids: string[], patch: Partial<Pick<CourseRecord, "published" | "category">>): Promise<number> {
  const courses = await readCourses();
  if (patch.category) {
    const categories = await readCategories(courses);
    if (!categories.some((category) => category.name === patch.category)) throw new CourseConflict({ category: "Choose an existing category." });
  }
  const target = new Set(ids);
  const now = new Date().toISOString();
  let changed = 0;
  const next = courses.map((course) => {
    if (!target.has(course.id)) return course;
    changed += 1;
    return { ...course, ...patch, updatedAt: now };
  });
  if (changed) await writeCourses(next);
  return changed;
}

export type ImportResult = { added: number; updated: number; skipped: number; newCategories: string[] };

/**
 * Upsert by course code (ignoring case and spaces). The catalogue has a few
 * codes shared by two courses, so the n-th row with a code in the file
 * updates the n-th course with that code (catalogue order); extra rows are
 * added. New courses are unpublished.
 */
export async function importCourses(rows: ImportRow[], mode: "update" | "skip"): Promise<ImportResult> {
  const courses = await readCourses();
  const knownCategories = new Set((await readCategories(courses)).map((category) => category.name));
  const categoryNames = [...knownCategories];
  const byCode = new Map<string, number[]>();
  courses
    .map((course, index) => ({ course, index }))
    .sort((a, b) => a.course.sno - b.course.sno)
    .forEach(({ course, index }) => {
      const key = codeKey(course.code);
      if (key) byCode.set(key, [...(byCode.get(key) ?? []), index]);
    });
  const seenInFile = new Map<string, number>();
  const slugs = new Set(courses.map((course) => course.slug));
  const next = [...courses];
  const now = new Date().toISOString();
  let sno = Math.max(0, ...courses.map((course) => course.sno));
  const result: ImportResult = { added: 0, updated: 0, skipped: 0, newCategories: [] };

  for (const row of rows) {
    if (!row.name || !row.code) {
      result.skipped += 1;
      continue;
    }
    const category = matchCategory(row.category, categoryNames) || "Uncategorised";
    if (!knownCategories.has(category)) {
      knownCategories.add(category);
      result.newCategories.push(category);
    }
    const key = codeKey(row.code);
    const occurrence = seenInFile.get(key) ?? 0;
    seenInFile.set(key, occurrence + 1);
    const existing = byCode.get(key)?.[occurrence];
    if (existing !== undefined) {
      if (mode === "skip") {
        result.skipped += 1;
        continue;
      }
      const current = next[existing];
      next[existing] = {
        ...current,
        name: row.name,
        category: row.category ? category : current.category,
        duration: row.duration || current.duration,
        level: row.level || current.level,
        modules: row.modules.length ? row.modules : current.modules,
        eligibility: row.eligibility || current.eligibility || "",
        updatedAt: now,
      };
      result.updated += 1;
    } else {
      const slug = uniqueSlug(row.name, row.code, slugs);
      slugs.add(slug);
      sno += 1;
      next.push({
        id: newCourseId(),
        sno,
        slug,
        name: row.name,
        code: row.code,
        category,
        duration: row.duration,
        level: row.level,
        summary: "",
        modules: row.modules,
        image: "",
        eligibility: row.eligibility,
        seoTitle: "",
        seoDescription: "",
        published: false,
        origin: "catalogue",
        updatedAt: now,
      });

      result.added += 1;
    }
  }

  if (result.added || result.updated) await writeCourses(next);
  return result;
}
