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
      <RdSection>
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-rd-eyebrow">Topics</p>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {groups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-rd-line-strong px-4 text-[15px] text-rd-ink transition-colors hover:border-rd-accent hover:text-rd-accent lg:rounded-md lg:border-transparent lg:px-2"
                  >
                    {group.category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex max-w-[900px] flex-col gap-12">
            {groups.map((group) => (
              <section key={group.category} aria-labelledby={`${group.id}-title`} id={group.id} className="scroll-mt-28">
                <h2
                  id={`${group.id}-title`}
                  className="font-rd-display text-[clamp(24px,2.4vw,30px)] font-medium text-rd-ink"
                >
                  {group.category}
                </h2>
                <div className="mt-4">
                  <RdFaqList entries={group.entries} group={group.id} />
                </div>
              </section>
            ))}
            <div className="rounded-[18px] bg-rd-muted p-6">
              <p className="text-[17px] text-rd-ink">Still have a question?</p>
              <RdButton href={enquireHref()} variant="accent" className="mt-4">
                Enquire Now
              </RdButton>
            </div>
          </div>
        </div>
      </RdSection>
    </>
  );
}
