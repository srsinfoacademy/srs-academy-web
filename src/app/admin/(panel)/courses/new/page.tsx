import type { Metadata } from "next";

import { CourseForm } from "@/components/admin/courses/CourseForm";
import { site } from "@/content/site";
import { readCategories, readCourses } from "@/lib/data/courses";

export const metadata: Metadata = { title: "Add course" };

export default async function NewCoursePage() {
  const courses = await readCourses();
  const categories = (await readCategories(courses)).map((category) => category.name);
  const durations = [...new Set(courses.map((course) => course.duration).filter(Boolean))].sort();

  return (
    <CourseForm
      mode="new"
      categories={categories}
      durations={durations}
      siteUrl={site.url}
      initial={{
        name: "",
        slug: "",
        code: "",
        category: categories[0] ?? "",
        duration: "",
        level: "",
        summary: "",
        modules: [],
        image: "",
        seoTitle: "",
        seoDescription: "",
        published: false,
      }}
    />
  );
}
