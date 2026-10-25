import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdCourseCard } from "@/components/redesign/RdCourseCard";
import { RdDashedPanel } from "@/components/redesign/RdDashedPanel";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdPill } from "@/components/redesign/RdPill";
import { getAllCourses, getCourseBySlug, relatedCourses, toCourseCard } from "@/content/courses";
import { courseDetailCopy as copy } from "@/content/public-pages";
import { enquireHref } from "@/content/redesign-nav";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

/** Every course gets a static page from this one template. */
export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  const description =
    course.summary ??
    `${course.name} (${course.code}) — a ${course.category.toLowerCase()} course at ${site.name}. Duration: ${course.duration}.`;
  return pageMetadata({ title: course.name, description, path: `/courses/${course.slug}` });
}

const h2 = "font-rd-display text-[clamp(26px,2.6vw,34px)] font-medium leading-[1.15] text-rd-ink";

export default async function CourseDetailPage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const related = relatedCourses(course.slug, 3).map((item) => toCourseCard(item));
  const hasCurriculum = Boolean(course.curriculum?.length);
  const isFullStack = course.slug === "full-stack-web-development";

  const stats = [
    { label: "Duration", value: course.duration },
    { label: "Course code", value: course.code },
    ...(course.level ? [{ label: "Level", value: course.level }] : []),
    {
      label: hasCurriculum ? "Modules" : "Topics",
      value: String(hasCurriculum ? course.curriculum!.length : course.modules.length || "To be published"),
    },
  ];

  return (
    <>
      <section className="rd-lattice border-b border-rd-line bg-rd-muted py-[clamp(36px,5vw,72px)]">
        <RdContainer>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] text-rd-soft">
              <li>
                <Link href="/" className="text-rd-link underline-offset-4 hover:text-rd-accent hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/courses" className="text-rd-link underline-offset-4 hover:text-rd-accent hover:underline">
                  Courses
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-rd-ink">
                {course.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-wrap gap-2">
            <RdPill>{course.category}</RdPill>
          </div>
          <h1 className="mt-4 max-w-[24ch] font-rd-display text-[clamp(38px,5vw,62px)] font-medium leading-[1.04] tracking-[-0.025em] text-rd-ink">
            {course.name}
          </h1>
          {course.summary ? (
            <p className="mt-5 max-w-[62ch] text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-rd-body">
              {course.summary}
            </p>
          ) : null}

          <dl className="mt-8 grid max-w-[860px] gap-px overflow-hidden rounded-[16px] border border-rd-line bg-rd-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr))]">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-rd-elevated p-4">
                <dt className="text-[13.5px] text-rd-soft">{stat.label}</dt>
                <dd className="mt-1 text-[16.5px] font-semibold text-rd-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <RdButton href={enquireHref(course.slug)} variant="accent">
              Enquire About This Course
            </RdButton>
            <RdButton href="/courses" variant="secondary">
              All courses
            </RdButton>
          </div>
        </RdContainer>
      </section>

      <RdContainer className="grid gap-12 py-[clamp(48px,7vw,88px)] lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-14">
          {course.outcomes?.length ? (
            <section aria-labelledby="learn">
              <h2 id="learn" className={h2}>
                What you will learn
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-[16px] leading-[1.55] text-rd-body">
                    <span aria-hidden="true" className="font-semibold text-rd-link">
                      ✓
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hasCurriculum ? (
            <section aria-labelledby="curriculum">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="curriculum" className={h2}>
                  Curriculum
                </h2>
                <span className="text-[15px] text-rd-soft">{course.curriculum!.length} modules</span>
              </div>
              <div className="mt-6 overflow-hidden rounded-[16px] border border-rd-line bg-rd-elevated">
                {course.curriculum!.map((module, index) => (
                  <details key={module.title} name="curriculum" className="group border-b border-rd-line last:border-b-0">
                    <summary className="flex min-h-[60px] cursor-pointer list-none items-center gap-4 px-5 py-4 hover:bg-rd-muted focus-visible:outline focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-rd-accent [&::-webkit-details-marker]:hidden">
                      <span className="text-[14px] font-semibold text-rd-accent">{String(index + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-[17px] font-semibold text-rd-ink">{module.title}</span>
                      <span aria-hidden="true" className="text-xl text-rd-soft">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-[15.5px] leading-[1.6] text-rd-body">{module.summary}</p>
                      <ul aria-label={`${module.title} topics`} className="mt-3 flex flex-wrap gap-2">
                        {module.topics.map((topic) => (
                          <li key={topic} className="rounded-lg bg-rd-muted px-2.5 py-1 text-[14px] text-rd-ink">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ) : course.modules.length > 0 ? (
            <section aria-labelledby="topics">
              <h2 id="topics" className={h2}>
                {copy.topicsTitle}
              </h2>
              <ol className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {course.modules.map((topic, index) => (
                  <li key={`${topic}-${index}`} className="flex gap-3 border-b border-rd-line pb-2.5 text-[16px] text-rd-body">
                    <span className="w-6 shrink-0 text-[14px] font-semibold text-rd-soft">{index + 1}</span>
                    {topic}
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <RdDashedPanel>
              <RdEyebrow>{copy.pendingEyebrow}</RdEyebrow>
              <h2 className={`${h2} mt-3`}>{copy.pendingTitle}</h2>
              <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.6] text-rd-body">{copy.topicsPending}</p>
            </RdDashedPanel>
          )}

          {isFullStack ? (
            <section aria-labelledby="who">
              <h2 id="who" className={h2}>
                {copy.whoTitle}
              </h2>
              {copy.fullStackWho.map((paragraph) => (
                <p key={paragraph} className="mt-4 max-w-[66ch] text-[16.5px] leading-[1.65] text-rd-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ) : null}

          {course.origin === "srs" ? (
            <section aria-labelledby="certification">
              <h2 id="certification" className={h2}>
                {copy.certificationTitle}
              </h2>
              <p className="mt-4 max-w-[66ch] text-[16.5px] leading-[1.65] text-rd-body">{copy.certificationBody}</p>
            </section>
          ) : null}
        </div>

        <aside aria-label="Enquire and related courses" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[18px] border border-rd-line bg-rd-elevated p-6">
            <h2 className="font-rd-display text-[23px] font-medium text-rd-ink">{copy.asideTitle}</h2>
            <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{copy.asideBody}</p>
            <RdButton href={enquireHref(course.slug)} variant="accent" className="mt-5 w-full">
              Enquire Now
            </RdButton>
          </div>
          {related.length ? (
            <div className="mt-8">
              <RdEyebrow as="div">{copy.relatedTitle}</RdEyebrow>
              <ul className="mt-4 flex flex-col gap-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <RdCourseCard course={item} compact />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </RdContainer>
    </>
  );
}
