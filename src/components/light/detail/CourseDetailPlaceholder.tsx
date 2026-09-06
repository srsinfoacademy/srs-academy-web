import Image from "next/image";

import { LightButton } from "@/components/light/ui/LightButton";
import { courseCategories, durationLabels, levelLabels, modeLabels, type Course } from "@/content/light/courses";
import { lightRoutes } from "@/lib/light/routes";

/**
 * Structural placeholder detail page for catalogue-breadth courses that
 * don't yet have confirmed curriculum, fees, or eligibility. Every section
 * that would need a specific business fact is replaced with an honest
 * "coming soon" state rather than an invented one.
 */
export function CourseDetailPlaceholder({ course }: { course: Course }) {
  const category = courseCategories.find((c) => c.id === course.category) ?? courseCategories[0];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="relative h-56 w-full min-[700px]:h-72">
          <Image src={course.photo} alt="" fill sizes="100vw" className="object-cover" priority />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(17,17,17,.15), rgba(17,17,17,.65))" }}
            aria-hidden="true"
          />
          <div className="sl-container absolute inset-x-0 bottom-0 pb-8 text-white">
            <span className="mb-3 inline-block rounded-full bg-sl-coral px-3 py-1 font-sl-mono text-[10px] tracking-[0.08em]">
              COMING SOON
            </span>
            <h1 className="sl-h1 max-w-160 text-[2rem] min-[700px]:text-[2.4rem]">{course.title}</h1>
          </div>
        </div>
      </section>

      <div className="sl-container py-12 min-[700px]:py-16">
        <div className="max-w-160">
          <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
            {category.emoji} {category.label.toUpperCase()}
          </div>
          <p className="mb-6 text-[15px] leading-relaxed text-sl-ink/72">{course.blurb}</p>

          <div className="sl-glass mb-8 rounded-[var(--radius-sl-md)] px-6 py-5">
            <p className="text-sm leading-relaxed text-sl-ink/68">
              This course is a structural placeholder demonstrating the catalogue&apos;s
              intended breadth — curriculum, eligibility, certification and fee details
              have not been confirmed yet, so nothing is asserted here. Only{" "}
              <em>Full Stack Web Development</em> is a confirmed, fully detailed
              program today.
            </p>
          </div>

          <dl className="mb-8 grid grid-cols-1 gap-4 min-[600px]:grid-cols-3">
            {course.mode ? (
              <div className="rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white p-4">
                <dt className="mb-1 font-sl-mono text-[10px] tracking-[0.1em] text-sl-ink/45">MODE</dt>
                <dd className="text-sm font-semibold">{modeLabels[course.mode]}</dd>
              </div>
            ) : null}
            {course.level ? (
              <div className="rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white p-4">
                <dt className="mb-1 font-sl-mono text-[10px] tracking-[0.1em] text-sl-ink/45">LEVEL</dt>
                <dd className="text-sm font-semibold">{levelLabels[course.level]}</dd>
              </div>
            ) : null}
            <div className="rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white p-4">
              <dt className="mb-1 font-sl-mono text-[10px] tracking-[0.1em] text-sl-ink/45">DURATION</dt>
              <dd className="text-sm font-semibold">{durationLabels[course.duration]}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3.5">
            <LightButton pending="[COURSE ENROLLMENT — pending confirmation]" variant="dark">
              Enroll now
            </LightButton>
            <LightButton href={lightRoutes.contact} variant="secondary">
              Ask about this course
            </LightButton>
          </div>
        </div>
      </div>
    </div>
  );
}
