import type { Metadata } from "next";

import { RdButton } from "@/components/redesign/RdButton";
import { RdFaqList } from "@/components/redesign/RdFaqList";
import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdSection } from "@/components/redesign/RdSection";
import { faqCategories, faqEntries } from "@/content/faq";
import { faqPageCopy } from "@/content/public-pages";
import { enquireHref } from "@/content/redesign-nav";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({ title: "FAQ", description: faqPageCopy.intro, path: "/faq" });

export default function FaqPage() {
  const groups = faqCategories
    .filter((category) => category !== "All")
    .map((category) => ({ category, id: `faq-${category.toLowerCase().replace(/\s+/g, "-")}`, entries: faqEntries.filter((entry) => entry.category === category) }))
    .filter((group) => group.entries.length > 0);

  return (
    <>
      <RdPageHero eyebrow={faqPageCopy.eyebrow} title={faqPageCopy.title} intro={faqPageCopy.intro} />
      <RdSection width="prose">
        <div className="flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={group.id}>
              <h2
                id={group.id}
                className="font-rd-display text-[clamp(24px,2.4vw,30px)] font-medium text-rd-ink"
              >
                {group.category}
              </h2>
              <div className="mt-4">
                <RdFaqList entries={group.entries} group={group.id} />
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 rounded-[18px] bg-rd-muted p-6">
          <p className="text-[17px] text-rd-ink">Still have a question?</p>
          <RdButton href={enquireHref()} variant="accent" className="mt-4">
            Enquire Now
          </RdButton>
        </div>
      </RdSection>
    </>
  );
}
