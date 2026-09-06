import Image from "next/image";

import { LightButton } from "@/components/light/ui/LightButton";
import { detailFor, sectionsFor } from "@/content/program-detail";
import type { Program } from "@/types/program";
import { courseCategories, levelLabels, modeLabels, type Course } from "@/content/light/courses";
import { lightRoutes } from "@/lib/light/routes";

/**
 * Full course-detail template, populated with the one confirmed SRS Academy
 * program (Full Stack Web Development), sourced from `@/content/programs`
 * and `@/content/program-detail` — the same data the production dark-theme
 * site uses, reformatted for the light visual system.
 */
export function CourseDetailLive({ program, course }: { program: Program; course: Course }) {
  const detail = detailFor(program.slug);
  if (!detail) return null;
  const category = courseCategories.find((c) => c.id === course.category) ?? courseCategories[0];
  const sections = sectionsFor(detail);
  const has = (id: string) => sections.some((s) => s.id === id);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="relative h-64 w-full min-[700px]:h-80">
          <Image src={course.photo} alt="" fill sizes="100vw" className="object-cover" priority />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(17,17,17,.15), rgba(17,17,17,.65))" }}
            aria-hidden="true"
          />
          <div className="sl-container absolute inset-x-0 bottom-0 pb-8 text-white">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 font-sl-mono text-[10px] tracking-[0.08em] backdrop-blur">
                {category.emoji} {category.label.toUpperCase()}
              </span>
              {course.mode ? (
                <span className="rounded-full bg-white/15 px-3 py-1 font-sl-mono text-[10px] tracking-[0.08em] backdrop-blur">
                  {modeLabels[course.mode].toUpperCase()}
                </span>
              ) : null}
              {course.level ? (
                <span className="rounded-full bg-white/15 px-3 py-1 font-sl-mono text-[10px] tracking-[0.08em] backdrop-blur">
                  {levelLabels[course.level].toUpperCase()}
                </span>
              ) : null}
            </div>
            <h1 className="sl-h1 max-w-160 text-[2rem] min-[700px]:text-[2.6rem]">{program.name}</h1>
          </div>
        </div>
      </section>

      <nav
        aria-label="Section"
        className="sl-scrollbar-none sticky top-18 z-30 flex gap-6 overflow-x-auto border-b border-sl-ink/8 bg-sl-paper/95 px-5 py-3.5 backdrop-blur min-[700px]:px-16"
      >
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="sl-focus whitespace-nowrap text-sm font-medium text-sl-ink/60 hover:text-sl-ink">
            {s.label}
          </a>
        ))}
      </nav>

      <div className="sl-container grid grid-cols-1 gap-12 py-12 min-[1000px]:grid-cols-[1fr_320px] min-[1000px]:py-16">
        <div className="flex flex-col gap-14">
          {has("overview") ? (
            <section id="overview">
              <h2 className="sl-h2 mb-3 text-2xl">Overview</h2>
              {detail.overview ? (
                <p className="mb-4 text-[15px] leading-relaxed text-sl-ink/72">{detail.overview}</p>
              ) : null}
              {detail.about ? (
                <p className="text-[15px] leading-relaxed text-sl-ink/72">{detail.about}</p>
              ) : null}
            </section>
          ) : null}

          {has("learning") ? (
            <section id="learning">
              <h2 className="sl-h2 mb-4 text-2xl">Who it&apos;s for &amp; what you&apos;ll learn</h2>
              {detail.audience?.length ? (
                <div className="mb-6">
                  <h3 className="sl-h3 mb-2.5 text-base">Who this program is for</h3>
                  <ul className="flex flex-col gap-2">
                    {detail.audience.map((a) => (
                      <li key={a} className="flex gap-2.5 text-sm leading-relaxed text-sl-ink/70">
                        <span aria-hidden="true">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {detail.learningOutcomes?.length ? (
                <div>
                  <h3 className="sl-h3 mb-2.5 text-base">Learning outcomes</h3>
                  <ul className="grid grid-cols-1 gap-2.5 min-[600px]:grid-cols-2">
                    {detail.learningOutcomes.map((o) => (
                      <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-sl-ink/70">
                        <span className="mt-0.5" style={{ color: "var(--sl-accent-text)" }} aria-hidden="true">
                          ✓
                        </span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <section id="curriculum">
            <h2 className="sl-h2 mb-4 text-2xl">Curriculum</h2>
            <div className="flex flex-col gap-3">
              {detail.modules.map((m) => (
                <details key={m.num} className="group rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white px-5 py-4 open:pb-4.5">
                  <summary className="sl-focus flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="flex items-center gap-3">
                      <span className="font-sl-mono text-xs text-sl-ink/40">{m.num}</span>
                      <span className="text-[15px] font-semibold">{m.title}</span>
                    </span>
                    <span className="shrink-0 text-lg text-sl-ink/50 transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-sl-ink/68">{m.body}</p>
                  {m.topics ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.topics.map((t) => (
                        <span key={t} className="rounded-full bg-sl-ink/6 px-2.5 py-1 text-xs text-sl-ink/65">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </details>
              ))}
            </div>
          </section>

          {has("eligibility") && detail.eligibility ? (
            <section id="eligibility">
              <h2 className="sl-h2 mb-4 text-2xl">Eligibility</h2>
              <ul className="flex flex-col gap-3">
                {detail.eligibility.map((e) => (
                  <li key={e} className="text-sm leading-relaxed text-sl-ink/70">
                    {e}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {has("certification") && detail.certification ? (
            <section id="certification">
              <h2 className="sl-h2 mb-4 text-2xl">Certification</h2>
              <div className="sl-glass rounded-[var(--radius-sl-md)] px-6 py-5">
                {typeof detail.certification === "string" ? (
                  <div className="text-sm leading-relaxed text-sl-ink/72">{detail.certification}</div>
                ) : (
                  <>
                    <div className="mb-1 text-[15px] font-semibold">{detail.certification.name}</div>
                    <div className="mb-1 text-sm text-sl-ink/65">Issued by {detail.certification.issuedBy}</div>
                    <div className="text-sm text-sl-ink/50">{detail.certification.verification}</div>
                  </>
                )}
              </div>
            </section>
          ) : null}

          {has("admissions") && detail.admissionsSteps ? (
            <section id="admissions">
              <h2 className="sl-h2 mb-5 text-2xl">Admissions</h2>
              <ol className="flex flex-col gap-4">
                {detail.admissionsSteps.map((s) => (
                  <li key={s.num} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sl-ink/6 font-sl-mono text-xs">
                      {s.num}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-sm text-sl-ink/60">{s.body}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {has("faq") && detail.faq ? (
            <section id="faq">
              <h2 className="sl-h2 mb-4 text-2xl">Frequently asked questions</h2>
              <div className="flex flex-col gap-3">
                {detail.faq.map((f) => (
                  <details key={f.q} className="group rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white px-5 py-4">
                    <summary className="sl-focus flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                      {f.q}
                      <span className="shrink-0 text-lg text-sl-ink/50 transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-sl-ink/68">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit min-[1000px]:sticky min-[1000px]:top-24">
          <div className="rounded-[var(--radius-sl-lg)] border border-sl-ink/10 bg-white p-6">
            <div id="fees" className="mb-4 font-sl-mono text-[10px] tracking-[0.12em] text-sl-ink/45">
              FEES
            </div>
            {typeof detail.fees === "string" ? (
              <div className="mb-5 text-2xl font-bold">{detail.fees}</div>
            ) : detail.fees ? (
              <div className="mb-5 text-2xl font-bold">{detail.fees.program}</div>
            ) : (
              <p className="mb-5 text-sm leading-relaxed text-sl-ink/60">
                Fees for this program have not been announced yet. Contact SRS Academy
                for current enrollment information.
              </p>
            )}
            <dl className="mb-6 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-sl-ink/55">Duration</dt>
                <dd className="font-medium">{program.duration}</dd>
              </div>
              {course.mode ? (
                <div className="flex justify-between">
                  <dt className="text-sl-ink/55">Mode</dt>
                  <dd className="font-medium">{modeLabels[course.mode]}</dd>
                </div>
              ) : null}
              {program.level && !program.level.startsWith("[") ? (
                <div className="flex justify-between">
                  <dt className="text-sl-ink/55">Level</dt>
                  <dd className="font-medium">{program.level}</dd>
                </div>
              ) : null}
            </dl>
            <LightButton href={lightRoutes.contact} variant="dark" block>
              {detail.primaryCta.startsWith("[") ? "Talk to an Advisor" : detail.primaryCta}
            </LightButton>
            <LightButton href={lightRoutes.admissions} variant="secondary" block className="mt-3">
              View admissions process
            </LightButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
