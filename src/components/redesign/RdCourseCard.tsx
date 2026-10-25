import Image from "next/image";
import Link from "next/link";

import { RdButton } from "@/components/redesign/RdButton";
import { RdImageCredit } from "@/components/redesign/RdImageCredit";
import { coursePath } from "@/content/courses/paths";
import type { CourseCardData } from "@/content/courses/types";
import { enquireHref } from "@/content/redesign-nav";
import { cn } from "@/lib/cn";

/**
 * One course card for Home, the catalogue and related lists. A photo shows
 * only when the course has one (the homepage set); every other course is a
 * text card. Never shows a fee.
 */
export function RdCourseCard({
  course,
  headingLevel = "h3",
  compact = false,
}: {
  course: CourseCardData;
  headingLevel?: "h2" | "h3";
  /** Smaller card without buttons, for related-course lists. */
  compact?: boolean;
}) {
  const Heading = headingLevel;
  const href = coursePath(course.slug);
  const topics =
    course.moduleCount > 0
      ? `${course.moduleCount} ${course.moduleCount === 1 ? "topic" : "topics"}`
      : "Topics to be published";

  return (
    <article
      className={cn(
        "rd-card group flex h-full flex-col overflow-hidden rounded-[18px] border border-rd-line bg-rd-elevated",
      )}
    >
      {course.image ? (
        <div className="relative aspect-[3/2] bg-rd-muted">
          <Image
            src={course.image.src}
            alt=""
            fill
            sizes="(min-width: 1180px) 400px, (min-width: 700px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
          <RdImageCredit image={course.image} />
        </div>
      ) : null}
      <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-4" : "gap-3 p-[22px]")}>
        <div className="flex items-start justify-between gap-3 text-[13px] font-semibold">
          <span className="text-rd-link">{course.category}</span>
          <span className="font-medium text-rd-soft">{course.code}</span>
        </div>
        <Heading
          className={cn(
            "font-rd-display font-medium leading-[1.2] text-rd-ink",
            compact ? "text-[19px]" : "text-[clamp(21px,1.8vw,24px)]",
          )}
        >
          <Link
            href={href}
            className="hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
          >
            {course.name}
          </Link>
        </Heading>
        <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-1 text-[14.5px] text-rd-soft">
          <div className="flex gap-1.5">
            <dt>Duration</dt>
            <dd className="font-semibold text-rd-ink">{course.duration}</dd>
          </div>
          <div>
            <dt className="sr-only">Topics</dt>
            <dd>{topics}</dd>
          </div>
        </dl>
        {compact ? null : (
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <RdButton href={href} variant="primary" className="min-h-11 px-3 text-[15px]">
              View Course<span className="sr-only">: {course.name}</span>
            </RdButton>
            <RdButton
              href={enquireHref(course.slug)}
              variant="secondary"
              className="min-h-11 px-3 text-[15px] hover:border-rd-accent hover:text-rd-accent"
            >
              Enquire<span className="sr-only"> about {course.name}</span>
            </RdButton>
          </div>
        )}
      </div>
    </article>
  );
}
