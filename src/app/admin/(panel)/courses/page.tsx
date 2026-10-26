import type { Metadata } from "next";

import { CoursesTable } from "@/components/admin/courses/CoursesTable";
import type { AdminCourseRow } from "@/components/admin/courses/types";
import { StorageNotice } from "@/components/admin/StorageNotice";
import { readCategories, readCourses } from "@/lib/data/courses";

export const metadata: Metadata = { title: "Courses" };

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function AdminCoursesPage({ searchParams }: PageProps<"/admin/courses">) {
  const params = await searchParams;
  const courses = await readCourses();
  const categories = await readCategories(courses);

  const rows: AdminCourseRow[] = courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    name: course.name,
    code: course.code,
    category: course.category,
    duration: course.duration,
    level: course.level,
    eligibility: course.eligibility ?? "",
    published: course.published,
    origin: course.origin,
    moduleCount: course.modules.length,
    updatedAt: course.updatedAt ?? "",
  }));

  const status = first(params.status);
  const category = first(params.category);

  return (
    <>
      <StorageNotice />
      <CoursesTable
        courses={rows}
        categories={categories.map((item) => item.name)}
        initial={{
          q: first(params.q).slice(0, 100),
          category: categories.some((item) => item.name === category) ? category : "all",
          status: status === "published" || status === "unpublished" ? status : "all",
        }}
      />
    </>
  );
}
