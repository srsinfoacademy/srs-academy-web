import type { Metadata } from "next";

import { PageHero } from "@/components/page/PageHero";
import { UpdatesList } from "@/components/pages/UpdatesList";
import { Container } from "@/components/ui/Container";
import { updatesPage } from "@/content/pages";
import { updates } from "@/content/updates";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: updatesPage.title,
  description: updatesPage.intro,
  path: routes.updates,
});

export default function UpdatesPage() {
  return (
    <>
      <PageHero
        variant="information"
        index="06"
        eyebrow={updatesPage.kicker}
        title="Updates"
        lead={updatesPage.intro}
        breadcrumb={[{ label: "Updates" }]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <h2 className="sr-only-srs">Latest notices</h2>
        <UpdatesList updates={updates} />
      </Container>
    </>
  );
}
