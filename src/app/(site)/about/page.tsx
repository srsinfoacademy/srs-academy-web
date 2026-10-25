import type { Metadata } from "next";
import Image from "next/image";

import { RdButton } from "@/components/redesign/RdButton";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdImageCredit } from "@/components/redesign/RdImageCredit";
import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdSection } from "@/components/redesign/RdSection";
import { aboutCopy } from "@/content/public-pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: "About", description: aboutCopy.intro, path: "/about" }),
  title: { absolute: `About ${site.name} — Training initiative of ${site.organisation.legalName}` },
};

const h2 = "font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink";

export default function AboutPage() {
  const facts = [
    { label: "Parent company", value: site.organisation.legalName },
    { label: "Learning format", value: site.contact.locationSummary },
    { label: "Address", value: site.contact.address },
  ];
  const image = site.imagery.about;

  return (
    <>
      <RdPageHero eyebrow={aboutCopy.eyebrow} title={aboutCopy.title} intro={aboutCopy.intro} />

      <RdSection labelledBy="about-story">
        <div data-reveal className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 id="about-story" className={h2}>
              {aboutCopy.storyTitle}
            </h2>
            {aboutCopy.story.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-[62ch] text-[17px] leading-[1.65] text-rd-body">
                {paragraph}
              </p>
            ))}
            <p className="mt-6 text-[17px] font-semibold text-rd-ink">
              Chief Executive Officer: {site.organisation.ceo}
            </p>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-[16px] border border-rd-line bg-rd-line sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-rd-elevated p-5">
                  <dt className="text-[13.5px] text-rd-soft">{fact.label}</dt>
                  <dd className="mt-1 text-[16.5px] font-semibold text-rd-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[20px] bg-rd-muted">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            <RdImageCredit image={image} />
          </div>
        </div>
      </RdSection>

      <RdSection tone="muted" labelledBy="about-mission">
        <h2 id="about-mission" className="sr-only">
          Mission and vision
        </h2>
        <div data-reveal="stagger" className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[18px] border border-rd-line bg-rd-bg p-[clamp(22px,3vw,36px)]">
            <RdEyebrow>Mission</RdEyebrow>
            <p className="mt-4 font-rd-display text-[clamp(20px,2vw,23px)] leading-[1.45] text-rd-ink">
              {site.organisation.mission}
            </p>
          </div>
          <div className="rounded-[18px] border border-rd-line bg-rd-bg p-[clamp(22px,3vw,36px)]">
            <RdEyebrow className="text-rd-link">Vision</RdEyebrow>
            <p className="mt-4 font-rd-display text-[clamp(20px,2vw,23px)] leading-[1.45] text-rd-ink">
              {site.organisation.vision}
            </p>
          </div>
        </div>
      </RdSection>

      <RdSection labelledBy="about-values">
        <h2 id="about-values" className={h2}>
          {aboutCopy.valuesTitle}
        </h2>
        <ul data-reveal="stagger" className="mt-10 grid gap-px overflow-hidden rounded-[18px] border border-rd-line bg-rd-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {aboutCopy.values.map((value) => (
            <li key={value.title} className="bg-rd-elevated p-6">
              <h3 className="text-[18px] font-semibold text-rd-ink">{value.title}</h3>
              <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{value.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <RdButton href="/courses" variant="primary">
            Explore what we teach
          </RdButton>
          <RdButton href="/contact" variant="secondary">
            Contact us
          </RdButton>
        </div>
      </RdSection>
    </>
  );
}
