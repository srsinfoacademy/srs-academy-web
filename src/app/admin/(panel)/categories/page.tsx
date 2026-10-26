import type { Metadata } from "next";

import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { StorageNotice } from "@/components/admin/StorageNotice";
import { readCategories, readCourses, withCounts } from "@/lib/data/courses";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const courses = await readCourses();
  const categories = withCounts(await readCategories(courses), courses);
  return (
    <>
      <StorageNotice />
      <CategoriesManager initial={categories} />
    </>
  );
}
