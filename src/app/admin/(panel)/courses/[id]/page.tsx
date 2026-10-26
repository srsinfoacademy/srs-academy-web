import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseForm } from "@/components/admin/courses/CourseForm";
import { site } from "@/content/site";
import { readCategories, readCourses } from "@/lib/data/courses";

export const metadata: Metadata = { title: "Edit course" };

export default async function EditCoursePage({ params, searchParams }: PageProps<"/admin/courses/[id]">) {
  const { id } = await params;
  const { saved } = await searchParams;
  const courses = await readCourses();
  const course = courses.find((item) => item.id === id);
  if (!course) notFound();
  const categories = (await readCategories(courses)).map((category) => category.name);
  const durations = [...new Set(courses.map((item) => item.duration).filter(Boolean))].sort();

  return (
    <CourseForm
      key={course.id}
      mode="edit"
      id={course.id}
      origin={course.origin}
      hasCurriculum={Boolean(course.curriculum?.length)}
      categories={categories}
      durations={durations}
      siteUrl={site.url}
      savedNotice={saved === "1"}
      initial={{
        name: course.name,
        slug: course.slug,
        code: course.code,
        category: course.category,
        duration: course.duration,
        level: course.level,
        summary: course.summary,
        modules: course.modules,
        coverImage: course.coverImage || course.image,
        seoTitle: course.seoTitle,
        seoDescription: course.seoDescription,
        published: course.published,
      }}
    />
  );
}
