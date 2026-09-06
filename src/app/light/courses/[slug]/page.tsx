import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailLive } from "@/components/light/detail/CourseDetailLive";
import { CourseDetailPlaceholder } from "@/components/light/detail/CourseDetailPlaceholder";
import { CATALOGUE_SLUGS } from "@/content/catalogue/courses";
import { allCoursePrograms as programs } from "@/content/programs";
import { courseBySlug, courses } from "@/content/light/courses";

const SHARED_PROGRAM_SLUGS = new Set<string>(["full-stack-web-development", ...CATALOGUE_SLUGS]);

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/light/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = courseBySlug(slug);
  if (!course) return { title: "Course" };

  // A genuinely shared course (real catalogue entry or Full Stack) canonicalizes
  // to its matching dark URL; a light-only placeholder "Coming soon" sample
  // course has no dark equivalent, so it self-canonicalizes instead — never
  // omit `alternates` here, or it silently inherits the root layout's "/"
  // canonical instead of pointing at itself.
  return {
    title: course.title,
    alternates: {
      canonical: SHARED_PROGRAM_SLUGS.has(slug) ? `/programs/${slug}` : `/light/courses/${slug}`,
    },
  };
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
