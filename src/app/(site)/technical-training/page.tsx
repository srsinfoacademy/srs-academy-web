import type { Metadata } from "next";
import Image from "next/image";

import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdImageCredit } from "@/components/redesign/RdImageCredit";
import { RdSection, RdSectionHeading } from "@/components/redesign/RdSection";
import { coursePath } from "@/content/courses/paths";
import { technicalProgramSlugs } from "@/content/courses/featured-programs";
import { learnBuildAdvance, technicalTrainingCopy as copy } from "@/content/public-pages";
import { enquireHref } from "@/content/redesign-nav";
import { site } from "@/content/site";
import { getPublicCourseBySlug } from "@/lib/data/courses";
import type { CourseRecord } from "@/lib/data/types";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Technical Training",
  description: copy.intro,
  path: "/technical-training",
});

export default async function TechnicalTrainingPage() {
  const programs = (await Promise.all(technicalProgramSlugs.map((slug) => getPublicCourseBySlug(slug)))).filter(
    (course): course is CourseRecord => course !== undefined,
  );
  const image = site.imagery.technical;

  return (
    <>
      <section className="border-b border-rd-line bg-rd-bg py-[clamp(40px,6vw,80px)]">
        <RdContainer className="rd-hero grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <RdEyebrow rule>{copy.eyebrow}</RdEyebrow>
            <h1 className="mt-4 max-w-[20ch] font-rd-display text-[clamp(38px,5vw,60px)] font-medium leading-[1.04] tracking-[-0.025em] text-rd-ink">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-rd-body">{copy.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RdButton href="#technical-programs" variant="primary">
                See the programs
              </RdButton>
              <RdButton href={enquireHref()} variant="accent">
                Enquire Now
              </RdButton>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-rd-muted shadow-[var(--rd-shadow-raised)]">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            <RdImageCredit image={image} />
          </div>
        </RdContainer>
      </section>

      <RdSection id="technical-programs" labelledBy="technical-programs-title" tone="muted">
        <RdSectionHeading id="technical-programs-title" title={copy.programsTitle} />
        <ul data-reveal="stagger" className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {programs.map((program) => (
            <li key={program.slug} className="rd-card flex flex-col rounded-[18px] border border-rd-line bg-rd-elevated p-6">
              <span className="text-[13px] font-semibold text-rd-link">{program.category}</span>
              <h3 className="mt-2 font-rd-display text-[clamp(23px,2vw,27px)] font-medium leading-tight text-rd-ink">
                {program.name}
              </h3>
              {program.summary ? (
                <p className="mt-3 text-[15.5px] leading-[1.6] text-rd-body">{program.summary}</p>
              ) : null}
              <p className="mt-4 text-[14.5px] text-rd-soft">
                {[program.duration, program.level].filter(Boolean).join(" · ")}
              </p>
              <RdButton href={coursePath(program.slug)} variant="primary" className="mt-6 self-start">
                View Course Details<span className="sr-only">: {program.name}</span>
              </RdButton>
            </li>
          ))}
        </ul>
      </RdSection>

      <RdSection labelledBy="technical-approach">
        <h2 id="technical-approach" className="sr-only">
          How the programs work
        </h2>
        <ul data-reveal="stagger" className="grid gap-px overflow-hidden rounded-[18px] border border-rd-line bg-rd-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          {learnBuildAdvance.map((item) => (
            <li key={item.title} className="bg-rd-elevated p-6">
              <RdEyebrow as="div">{item.eyebrow}</RdEyebrow>
              <h3 className="mt-2 font-rd-display text-[23px] font-medium text-rd-ink">{item.title}</h3>
              <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{item.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 rounded-[18px] bg-rd-muted p-[clamp(22px,3vw,36px)]">
          <h2 className="font-rd-display text-[clamp(24px,2.4vw,30px)] font-medium text-rd-ink">{copy.moreTitle}</h2>
          <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.6] text-rd-body">{copy.moreBody}</p>
          <RdButton href="/courses" variant="secondary" className="mt-5">
            Browse all courses
          </RdButton>
        </div>
      </RdSection>
    </>
  );
}
