import type { Metadata } from "next";

import { EditorialSections } from "@/components/pages/EditorialSections";
import { PageHero } from "@/components/page/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { admissionsJourney, admissionsPage } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: admissionsPage.title,
  description: admissionsPage.intro,
  path: routes.admissions,
});

/**
 * Admissions. Practical, low-decoration: this page exists to be used.
 * The journey reuses the node language shared with the homepage and the
 * program detail pages. No application is submitted here — CTA only.
 */
export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        variant="information"
        index="05"
        eyebrow={admissionsPage.kicker}
        title="Admissions"
        lead={admissionsPage.intro}
        breadcrumb={[{ label: "Admissions" }]}
        meta={[
          { label: "Steps", value: "05" },
          { label: "Intake", value: "[INTAKE DATES]" },
        ]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <section aria-labelledby="journey-title" className="border-t border-line-hairline pt-8">
          <IndexLabel index="00" as="p">
            Journey
          </IndexLabel>
          <h2 id="journey-title" className="type-h3 mt-5">
            The admissions journey
          </h2>

          <ol className="mt-10 flex flex-col">
            {admissionsJourney.map((step, i) => (
              <li key={step.num} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className={
                      i === 0
                        ? "mt-1.5 size-3 shrink-0 rounded-full bg-lime"
                        : "mt-1.5 size-2.5 shrink-0 rounded-full border border-line-strong bg-transparent"
                    }
                  />
                  {i < admissionsJourney.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="w-px flex-1 bg-[rgb(216_255_94_/_0.28)]"
                    />
                  ) : null}
                </div>
                <div className="pb-10">
                  <p className="type-index text-lime">{step.num}</p>
                  <h3 className="type-h4 mt-2">{step.title}</h3>
                  <p className="type-body-s measure mt-2">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <EditorialSections sections={admissionsPage.sections} className="mt-14" />

        <section
          aria-labelledby="admissions-cta-title"
          className="mt-16 rounded-[var(--srs-radius-xl)] border border-line bg-surface-1 p-8 sm:p-10"
        >
          <IndexLabel index="07" as="p">
            Next
          </IndexLabel>
          <h2 id="admissions-cta-title" className="type-h3 mt-5 max-w-[22ch]">
            Questions about applying?
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button pending="[APPLICATION DESTINATION]" size="md">
              {admissionsPage.ctaLabel}
            </Button>
            <Button href={routes.contact} variant="secondary" size="md">
              Contact admissions
            </Button>
          </div>
        </section>
      </Container>
    </>
  );
}
