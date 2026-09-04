import type { Metadata } from "next";

import { PageHero } from "@/components/page/PageHero";
import { ResourcesList } from "@/components/pages/ResourcesList";
import { Container } from "@/components/ui/Container";
import { resourcesPage } from "@/content/pages";
import { resources } from "@/content/resources";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: resourcesPage.title,
  description: resourcesPage.intro,
  path: routes.resources,
});

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        variant="information"
        index="07"
        eyebrow={resourcesPage.kicker}
        title="Resources"
        lead={resourcesPage.intro}
        breadcrumb={[{ label: "Resources" }]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <h2 className="sr-only-srs">Resource categories</h2>
        <ResourcesList resources={resources} />
      </Container>
    </>
  );
}
