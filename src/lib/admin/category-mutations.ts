import "server-only";

import { newCategoryId, readCategories, readCourses, writeCategories, writeCourses } from "@/lib/data/courses";
import { slugify } from "@/lib/data/schemas";
import type { CategoryRecord } from "@/lib/data/types";

export class CategoryError extends Error {
  constructor(
    public status: number,
    public fields: Record<string, string>,
  ) {
    super("Category error");
  }
}

function checkUnique(categories: CategoryRecord[], name: string, slug: string, id?: string) {
  const others = categories.filter((category) => category.id !== id);
  const fields: Record<string, string> = {};
  if (others.some((category) => category.name.toLowerCase() === name.toLowerCase())) fields.name = "A category with this name already exists.";
  if (!slug) fields.slug = "Use letters or numbers in the name or slug.";
  else if (others.some((category) => category.slug === slug)) fields.slug = "Another category already uses this slug.";
  if (Object.keys(fields).length) throw new CategoryError(409, fields);
}

export async function createCategory(input: { name: string; slug?: string; visible: boolean }) {
  const courses = await readCourses();
  const categories = await readCategories(courses);
  const slug = slugify(input.slug || input.name);
  checkUnique(categories, input.name, slug);
  await writeCategories([...categories, { id: newCategoryId(input.name), name: input.name, slug, visible: input.visible }]);
}

/** Renaming moves the category's courses with it. */
export async function updateCategory(input: { id: string; name: string; slug?: string; visible: boolean }) {
  const courses = await readCourses();
  const categories = await readCategories(courses);
  const current = categories.find((category) => category.id === input.id);
  if (!current) throw new CategoryError(404, { form: "That category no longer exists." });
  const slug = slugify(input.slug || input.name);
  checkUnique(categories, input.name, slug, input.id);
  if (current.name !== input.name) {
    const now = new Date().toISOString();
    await writeCourses(courses.map((course) => (course.category === current.name ? { ...course, category: input.name, updatedAt: now } : course)));
  }
  await writeCategories(categories.map((category) => (category.id === input.id ? { ...category, name: input.name, slug, visible: input.visible } : category)));
}

export async function setCategoryVisibility(id: string, visible: boolean) {
  const categories = await readCategories();
  if (!categories.some((category) => category.id === id)) throw new CategoryError(404, { form: "That category no longer exists." });
  await writeCategories(categories.map((category) => (category.id === id ? { ...category, visible } : category)));
}

export async function reorderCategories(ids: string[]) {
  const categories = await readCategories();
  const byId = new Map(categories.map((category) => [category.id, category]));
  if (ids.length !== categories.length || new Set(ids).size !== ids.length || ids.some((id) => !byId.has(id))) {
    throw new CategoryError(409, { form: "The category list changed. Reload the page and try again." });
  }
  await writeCategories(ids.map((id) => byId.get(id)!));
}

/** Only an empty category can be deleted, unless its courses are reassigned to another category. */
export async function deleteCategory(id: string, reassignTo?: string) {
  const courses = await readCourses();
  const categories = await readCategories(courses);
  const current = categories.find((category) => category.id === id);
  if (!current) throw new CategoryError(404, { form: "That category no longer exists." });
  const inUse = courses.filter((course) => course.category === current.name);
  if (inUse.length) {
    if (!reassignTo) throw new CategoryError(409, { reassignTo: `Move its ${inUse.length} courses to another category first.` });
    if (reassignTo === current.name || !categories.some((category) => category.name === reassignTo)) {
      throw new CategoryError(409, { reassignTo: "Choose a different, existing category." });
    }
    const now = new Date().toISOString();
    await writeCourses(courses.map((course) => (course.category === current.name ? { ...course, category: reassignTo, updatedAt: now } : course)));
  }
  await writeCategories(categories.filter((category) => category.id !== id));
}
