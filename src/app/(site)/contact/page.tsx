import type { Metadata } from "next";

import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdEnquirySection } from "@/components/redesign/enquiry/RdEnquirySection";
import { contactCopy } from "@/content/public-pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Contact", description: contactCopy.intro, path: "/contact" }),
  title: { absolute: `Contact ${site.name} — Saltlake, Kolkata` },
};

export default function ContactPage() {
  return (
    <>
      <RdPageHero eyebrow={contactCopy.eyebrow} title={contactCopy.title} intro={contactCopy.intro} />
      <RdEnquirySection />
    </>
  );
}
