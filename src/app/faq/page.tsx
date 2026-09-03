import type { Metadata } from "next";

import { FaqList } from "@/components/pages/FaqList";
import { PageHero } from "@/components/page/PageHero";
import { Container } from "@/components/ui/Container";
import { faqEntries } from "@/content/faq";
import { faqPage } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: faqPage.title,
  description: faqPage.intro,
  path: routes.faq,
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        variant="information"
        index="09"
        eyebrow={faqPage.kicker}
        title="FAQ"
        lead={faqPage.intro}
        breadcrumb={[{ label: "FAQ" }]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <h2 className="sr-only-srs">Questions by category</h2>
        <FaqList entries={faqEntries} />
      </Container>
    </>
  );
}
