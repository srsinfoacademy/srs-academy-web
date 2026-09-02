import type { Metadata } from "next";

import { EditorialSections } from "@/components/pages/EditorialSections";
import { PageHero } from "@/components/page/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { aboutPage } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: aboutPage.intro,
  path: routes.about,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="editorial"
        index="02"
        eyebrow={aboutPage.kicker}
        title="Built for what comes next."
        lead={aboutPage.intro}
        breadcrumb={[{ label: "About" }]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <EditorialSections sections={aboutPage.sections} />

        {/* Closing CTA reuses the homepage pattern at reduced scale. */}
        <section
          aria-labelledby="about-cta-title"
          className="mt-16 rounded-[var(--srs-radius-xl)] border border-line bg-surface-1 p-8 sm:p-10"
        >
          <IndexLabel index="08" as="p">
            Next
          </IndexLabel>
          <h2 id="about-cta-title" className="type-h3 mt-5 max-w-[20ch]">
            Explore what SRS Academy teaches.
          </h2>
          <div className="mt-8">
            <Button href={routes.programs} size="md">
              {aboutPage.ctaLabel} →
            </Button>
          </div>
        </section>
      </Container>
    </>
  );
}
