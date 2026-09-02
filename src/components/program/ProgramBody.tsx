import Link from "next/link";

import { Disclosure } from "@/components/program/Disclosure";
import { DetailRows, DetailSection, NodeList } from "@/components/program/DetailSection";
import { SectionNav } from "@/components/program/SectionNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { cn } from "@/lib/cn";
import { categoryOf, programs } from "@/content/programs";
import { routes } from "@/lib/routes";
import type { Program, ProgramDetail } from "@/types/program";

export function ProgramBody({
  program,
  detail,
}: {
  program: Program;
  detail: ProgramDetail;
}) {
  const related = detail.relatedPrograms
    .map((slug) => programs.find((p) => p.slug === slug))
    .filter((p): p is Program => p !== undefined);

  const hasDates = (detail.importantDates?.length ?? 0) > 0;
  const hasDownloads = (detail.downloads?.length ?? 0) > 0;

  /*
   * Section indices count the sections actually rendered. Optional sections
   * are dropped when they have no content, and a hardcoded index would then
   * leave a gap in the sequence that reads as a mistake.
   */
  const order = [
    "overview",
    "learning",
    "curriculum",
    "eligibility",
    "certification",
    "fees",
    "admissions",
    ...(hasDates ? ["dates"] : []),
    ...(hasDownloads ? ["downloads"] : []),
    "faq",
    ...(related.length > 0 ? ["related"] : []),
    "cta",
  ];
  const idx = (key: string) => String(order.indexOf(key) + 1).padStart(2, "0");

  return (
    <Container className="pb-[var(--srs-section-loose)]">
      <div className="grid gap-10 xl:grid-cols-12 xl:gap-12">
        <div className="xl:col-span-3">
          <SectionNav />
        </div>

        <div className="flex flex-col gap-12 xl:col-span-9">
          <DetailSection id="overview" index={idx("overview")} eyebrow="Overview" title="About this program">
            <p className="type-body measure">{detail.about}</p>

            <h3 className="type-h4 mt-10">Who this program is for</h3>
            <div className="mt-5">
              <NodeList items={detail.audience} />
            </div>
          </DetailSection>

          <DetailSection id="learning" index={idx("learning")} eyebrow="Learning" title="What you will learn">
            <NodeList items={detail.learningOutcomes} />

            {detail.projectExperience ? (
              <>
                <h3 className="type-h4 mt-10">Project experience</h3>
                <p className="type-body-s measure mt-4">{detail.projectExperience}</p>
              </>
            ) : null}
          </DetailSection>

          <DetailSection
            id="curriculum"
            index={idx("curriculum")}
            eyebrow="Curriculum"
            title={`${detail.modules.length} modules`}
          >
            {/*
              The curriculum lists what a program covers. It deliberately shows
              no progress or completion state — this is a public page, not a
              learning record.
            */}
            <Disclosure
              items={detail.modules.map((module) => ({
                key: module.num,
                index: module.num,
                title: module.title,
                content: (
                  <>
                    <p className="type-body-s measure">{module.body}</p>
                    {module.topics?.length ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {module.topics.map((topic, i) => (
                          <li
                            key={`${topic}-${i}`}
                            className="type-label rounded-[var(--srs-radius-sm)] border border-line px-2.5 py-1.5"
                          >
                            {topic}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ),
              }))}
            />
          </DetailSection>

          <DetailSection id="eligibility" index={idx("eligibility")} eyebrow="Eligibility" title="Who can apply">
            <NodeList items={detail.eligibility} />
          </DetailSection>

          <DetailSection
            id="certification"
            index={idx("certification")}
            eyebrow="Certification"
            title="On completion"
          >
            <DetailRows
              rows={[
                { label: "Certificate", value: detail.certification.name },
                { label: "Issued by", value: detail.certification.issuedBy },
                { label: "Verification", value: detail.certification.verification },
              ]}
              columns={3}
            />
          </DetailSection>

          <DetailSection id="fees" index={idx("fees")} eyebrow="Fees" title="Program fees">
            {detail.fees ? (
              <DetailRows
                rows={[
                  { label: "Program fee", value: detail.fees.program },
                  { label: "Registration", value: detail.fees.registration },
                  { label: "Payment terms", value: detail.fees.paymentTerms },
                  { label: "Tax", value: detail.fees.tax },
                ]}
              />
            ) : (
              /*
                No invented pricing. When fees are unpublished the page says so
                plainly and points at the people who can answer.
              */
              <div className="rounded-[var(--srs-radius-xl)] border border-line p-6">
                <p className="type-index text-lime">[FEES NOT PUBLISHED]</p>
                <p className="type-body-s mt-3 measure">
                  Fees for this program have not been published yet. Contact admissions
                  for current figures and payment terms.
                </p>
                <div className="mt-6">
                  <Button pending="[ADMISSIONS CONTACT]" size="sm" variant="secondary">
                    Contact admissions
                  </Button>
                </div>
              </div>
            )}
          </DetailSection>

          <DetailSection id="admissions" index={idx("admissions")} eyebrow="Admissions" title="How to apply">
            {/* Same node language as the homepage journey — no arrows. */}
            <ol className="flex flex-col gap-0">
              {detail.admissionsSteps.map((step, i) => (
                <li key={step.num} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-2.5 shrink-0 rounded-full bg-lime"
                    />
                    {i < detail.admissionsSteps.length - 1 ? (
                      <span aria-hidden="true" className="w-px flex-1 bg-line" />
                    ) : null}
                  </div>
                  <div className="pb-8">
                    <p className="type-index text-lime">{step.num}</p>
                    <h3 className="type-h4 mt-2">{step.title}</h3>
                    <p className="type-body-s measure mt-2">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </DetailSection>

          {hasDates ? (
            <DetailSection id="dates" index={idx("dates")} eyebrow="Dates" title="Important dates">
              <DetailRows rows={detail.importantDates ?? []} columns={3} />
            </DetailSection>
          ) : null}

          {hasDownloads ? (
            <DetailSection id="downloads" index={idx("downloads")} eyebrow="Resources" title="Downloads">
              <ul className="flex flex-col gap-3">
                {(detail.downloads ?? []).map((file) => (
                  <li
                    key={file.name}
                    className="flex min-h-11 items-center justify-between gap-4 border-b border-line-hairline pb-3"
                  >
                    <span className="type-body-s text-primary">{file.name}</span>
                    <span className="type-index">{file.note}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          ) : null}

          <DetailSection id="faq" index={idx("faq")} eyebrow="FAQ" title="Common questions">
            <Disclosure
              items={detail.faq.map((item, i) => ({
                key: String(i),
                title: item.q,
                content: <p className="type-body-s measure">{item.a}</p>,
              }))}
            />
          </DetailSection>

          {related.length > 0 ? (
            <section
              aria-labelledby="related-title"
              className="scroll-mt-28 border-t border-line-hairline pt-10"
            >
              <IndexLabel index={idx("related")} as="p">
                Related
              </IndexLabel>
              <h2 id="related-title" className="type-h3 mt-5">
                Related programs
              </h2>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={routes.program(item.slug)}
                      className={cn(
                        "flex h-full flex-col gap-3 rounded-[var(--srs-radius-xl)] border border-line p-6",
                        "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                        "hover:border-line-strong hover:bg-[rgb(242_244_239_/_0.03)]",
                      )}
                    >
                      <span className="type-index text-lime">
                        {item.num} / {categoryOf(item).label.toUpperCase()}
                      </span>
                      <span className="type-h4 text-balance">{item.name}</span>
                      <span className="type-index mt-auto pt-2">View program →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Closing CTA. Also the point where the mobile bar stands down. */}
          <section
            id="program-cta"
            aria-labelledby="program-cta-title"
            className="rounded-[var(--srs-radius-xl)] border border-line bg-surface-1 p-8 sm:p-10"
          >
            <IndexLabel index={idx("cta")} as="p">
              Next
            </IndexLabel>
            <h2 id="program-cta-title" className="type-h3 mt-5 max-w-[18ch]">
              Ready to apply to {program.name}?
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button pending="[PRIMARY PROGRAM CTA DESTINATION]" size="md">
                {detail.primaryCta}
              </Button>
              <Button href={routes.programs} variant="ghost" size="md">
                All programs
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
