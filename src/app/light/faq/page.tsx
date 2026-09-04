import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { FaqAccordion } from "@/components/light/FaqAccordion";
import { faqPage } from "@/content/pages";

export const metadata: Metadata = { title: "FAQ" };

export default function LightFaqPage() {
  return (
    <>
      <EditorialHero kicker={faqPage.kicker} title={faqPage.title} intro="Answers to common questions about SRS Academy, programs, admissions, payments and certification." />
      <section className="sl-container pb-20">
        <FaqAccordion />
      </section>
    </>
  );
}
