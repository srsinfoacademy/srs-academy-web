import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailLive } from "@/components/light/detail/CourseDetailLive";
import { CourseDetailPlaceholder } from "@/components/light/detail/CourseDetailPlaceholder";
import { programs } from "@/content/programs";
import { courseBySlug, courses } from "@/content/light/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/light/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = courseBySlug(slug);
  return { title: course ? course.title : "Course" };
}

export default async function LightCourseDetailPage({
  params,
}: PageProps<"/light/courses/[slug]">) {
  const { slug } = await params;
  const course = courseBySlug(slug);
  if (!course) notFound();

  if (course.status === "live") {
    const program = programs.find((p) => p.slug === course.slug);
    if (program) return <CourseDetailLive program={program} course={course} />;
  }

  return <CourseDetailPlaceholder course={course} />;
}
