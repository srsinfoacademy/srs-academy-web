import { PageHero } from "@/components/page/PageHero";
import { Container } from "@/components/ui/Container";
import { PrintLink } from "@/components/ui/PrintLink";
import { SectionNav } from "@/components/ui/SectionNav";
import type { LegalDocument } from "@/content/legal";

/**
 * One legal template, four instances.
 *
 * Motion is minimal here by design: the legal hero carries no network, and
 * nothing animates on entry. Body text sits at the 16/1.65 minimum the
 * accessibility handoff sets for long-form legal reading.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  const sections = document.sections.map((section) => ({
    id: section.id,
    label: section.label,
  }));

  return (
    <>
      <PageHero
        variant="legal"
        index="10"
        eyebrow="Legal"
        title={document.title}
        lead={document.intro}
        breadcrumb={[{ label: document.title }]}
        meta={[{ label: "Last updated", value: document.lastUpdated }]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <div className="grid gap-10 xl:grid-cols-12 xl:gap-12">
          <div className="xl:col-span-3 print:hidden">
            <SectionNav sections={sections} />
            <div className="mt-8 hidden xl:block">
              <PrintLink />
            </div>
          </div>

          <div className="legal-fade flex flex-col gap-12 xl:col-span-9">
            {document.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-28 border-t border-line-hairline pt-8 first:border-t-0 first:pt-0"
              >
                <h2 id={`${section.id}-title`} className="type-h3">
                  {section.label}
                </h2>
                {/* leading-relaxed is the 1.65 legal minimum. */}
                <p className="type-body measure mt-5 leading-[var(--srs-leading-relaxed)]">
                  {section.body}
                </p>
              </section>
            ))}

            <div className="xl:hidden print:hidden">
              <PrintLink />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
