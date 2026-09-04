import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/light/ui/Reveal";
import { courses, levelLabels, modeLabels } from "@/content/light/courses";
import { lightRoutes } from "@/lib/light/routes";

const featuredIds = ["fullstack", "makeup", "mehendi", "english"];

export function FeaturedPrograms() {
  const featured = featuredIds
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is (typeof courses)[number] => Boolean(c));

  return (
    <section className="sl-container py-16">
      <Reveal>
        <div className="mb-6.5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="sl-h2 text-[1.75rem]">Featured courses</h2>
          <Link
            href={lightRoutes.courses}
            className="sl-focus inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "var(--sl-accent-text)" }}
          >
            View all courses <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 min-[1100px]:grid-cols-4">
        {featured.map((course, i) => (
          <Reveal key={course.id} delay={i * 70}>
            <Link
              href={lightRoutes.course(course.slug)}
              className="sl-focus group block overflow-hidden rounded-[var(--radius-sl-md)] border border-sl-ink/8 bg-white shadow-none transition-[transform,box-shadow] duration-[var(--sl-dur-med)] ease-[var(--sl-ease)] hover:-translate-y-1.5 hover:shadow-[var(--sl-shadow-card)]"
            >
              <div className="relative h-30 w-full">
                <Image
                  src={course.photo}
                  alt=""
                  fill
                  sizes="(min-width: 1100px) 25vw, (min-width: 560px) 50vw, 100vw"
                  className="object-cover"
                />
                {course.status === "placeholder" ? (
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 font-sl-mono text-[9px] tracking-[0.06em] text-sl-ink/70">
                    COMING SOON
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <div className="mb-1.5 text-[15px] font-semibold">{course.title}</div>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className="rounded-full px-2 py-1 font-sl-mono text-[9px]"
                    style={{ background: "var(--sl-accent-soft)" }}
                  >
                    {modeLabels[course.mode].toUpperCase()}
                  </span>
                  <span className="rounded-full bg-sl-ink/6 px-2 py-1 font-sl-mono text-[9px]">
                    {levelLabels[course.level].toUpperCase()}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
