import type { Metadata } from "next";

import { RdButton } from "@/components/redesign/RdButton";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdFaqList } from "@/components/redesign/RdFaqList";
import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdSection, RdSectionHeading } from "@/components/redesign/RdSection";
import { RdEnquirySection } from "@/components/redesign/enquiry/RdEnquirySection";
import { faqEntries } from "@/content/faq";
import { admissionsCopy, admissionsJourney } from "@/content/public-pages";
import { enquireHref } from "@/content/redesign-nav";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Admissions", description: admissionsCopy.intro, path: "/admissions" }),
  title: { absolute: `Admissions & Enquiry — ${site.name}` },
};

export default function AdmissionsPage() {
  const admissionFaq = faqEntries.filter((entry) => entry.category === "Admissions" || entry.category === "Programs");

  return (
    <>
      <RdPageHero eyebrow={admissionsCopy.eyebrow} title={admissionsCopy.title} intro={admissionsCopy.intro}>
        <RdButton href={enquireHref()} variant="accent" className="mt-8">
          Send an enquiry
        </RdButton>
      </RdPageHero>

      <RdSection tone="muted" labelledBy="admission-steps">
        <RdSectionHeading id="admission-steps" title={admissionsCopy.stepsTitle} />
        <ol className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {admissionsJourney.map((step) => (
            <li key={step.num} className="rounded-[18px] border border-rd-line bg-rd-elevated p-6">
              <span className="text-[15px] font-semibold text-rd-accent">{step.num}</span>
              <h3 className="mt-2 font-rd-display text-[clamp(23px,2vw,27px)] font-medium text-rd-ink">{step.title}</h3>
              <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </RdSection>

      <RdEnquirySection />

      <RdSection tone="muted" labelledBy="admissions-faq" width="prose">
        <RdEyebrow>FAQ</RdEyebrow>
        <h2
          id="admissions-faq"
          className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink"
        >
          Frequently asked questions
        </h2>
        <div className="mt-8">
          <RdFaqList entries={admissionFaq} group="admissions-faq" />
        </div>
        <RdButton href="/faq" variant="text" className="mt-6">
          All questions <span aria-hidden="true">→</span>
        </RdButton>
      </RdSection>
    </>
  );
}
