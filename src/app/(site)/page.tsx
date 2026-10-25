import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdCourseCard } from "@/components/redesign/RdCourseCard";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdFaqList } from "@/components/redesign/RdFaqList";
import { RdImageCredit } from "@/components/redesign/RdImageCredit";
import { RdPill } from "@/components/redesign/RdPill";
import { RdSection, RdSectionHeading } from "@/components/redesign/RdSection";
import { RdEnquirySection } from "@/components/redesign/enquiry/RdEnquirySection";
import {
  courseAreas,
  coursePath,
  coursesInArea,
  getAllCourses,
  getCategories,
  getHomeFeaturedCourses,
  getSrsPrograms,
  toCourseCard,
} from "@/content/courses";
import { faqEntries } from "@/content/faq";
import { homeCopy, learnBuildAdvance } from "@/content/public-pages";
import { enquireHref } from "@/content/redesign-nav";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: site.tagline, description: site.description, path: "/" }),
  title: { absolute: `${site.name} — ${site.tagline} | Kolkata` },
};

/** Questions shown on Home; the full list lives on /faq. */
const HOME_FAQ_COUNT = 6;

export default function HomePage() {
  const programs = getSrsPrograms();
  const fullStack = programs.find((program) => program.curriculum?.length) ?? programs[0];
  const otherPrograms = programs.filter((program) => program.slug !== fullStack?.slug);
  const featured = getHomeFeaturedCourses().map((course) => toCourseCard(course, true));
  const totalCourses = getAllCourses().length;
  const categoryCounts = new Map(getCategories().map((item) => [item.category, item.count]));
  const hero = site.imagery.hero;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-rd-line bg-rd-bg py-[clamp(40px,6vw,88px)]">
        <RdContainer className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <RdEyebrow rule>{site.contact.locationSummary}</RdEyebrow>
            <h1 className="mt-5 max-w-[14ch] font-rd-display text-[clamp(40px,5.6vw,68px)] font-medium leading-[1.02] tracking-[-0.025em] text-rd-ink">
              {homeCopy.hero.title}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[clamp(17px,1.4vw,19.5px)] leading-[1.6] text-rd-body">
              {homeCopy.hero.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RdButton href="/courses" variant="primary">
                Explore Courses
              </RdButton>
              <RdButton href={enquireHref()} variant="secondary">
                Enquire Now
              </RdButton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-rd-line pt-6 text-[15px] text-rd-body">
              {homeCopy.hero.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-rd-link" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative pb-10 lg:pb-0">
            <div className="rd-lattice rounded-[28px] bg-rd-muted p-[clamp(14px,2vw,24px)]">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-[22px] shadow-[var(--rd-shadow-raised)]">
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
                <RdImageCredit image={hero} className="left-auto right-2" />
              </div>
            </div>
            {fullStack ? (
              <Link
                href={coursePath(fullStack.slug)}
                className="absolute -bottom-2 left-4 max-w-[300px] rounded-[16px] border border-rd-line bg-rd-elevated p-4 shadow-[var(--rd-shadow-card)] transition-colors hover:border-rd-line-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent sm:left-[-18px] lg:bottom-6"
              >
                <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-rd-link">
                  {homeCopy.hero.featuredLabel}
                </span>
                <span className="mt-1 block font-rd-display text-[21px] font-medium leading-tight text-rd-ink">
                  {fullStack.name}
                </span>
                <span className="mt-1 block text-[13.5px] text-rd-soft">
                  {[fullStack.duration, fullStack.level].filter(Boolean).join(" · ")}
                </span>
              </Link>
            ) : null}
          </div>
        </RdContainer>
      </section>

      {/* Featured courses with photos */}
      <RdSection labelledBy="home-courses">
        <RdSectionHeading
          id="home-courses"
          eyebrow={homeCopy.courses.eyebrow}
          title={homeCopy.courses.title}
          intro={homeCopy.courses.intro}
          action={
            <RdButton href="/courses" variant="accent">
              Explore all {totalCourses} courses
            </RdButton>
          }
        />
        <ul className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
          {featured.map((course) => (
            <li key={course.slug}>
              <RdCourseCard course={course} />
            </li>
          ))}
        </ul>
      </RdSection>

      {/* Course areas */}
      <RdSection tone="muted" labelledBy="home-areas">
        <RdSectionHeading
          id="home-areas"
          eyebrow={homeCopy.areas.eyebrow}
          title={homeCopy.areas.title}
          action={
            <RdButton href="/courses" variant="text">
              Browse all courses <span aria-hidden="true">→</span>
            </RdButton>
          }
        />
        <ul className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {courseAreas.map((area) => {
            const count = coursesInArea(area.id).length;
            const categories = area.categories.filter((category) => categoryCounts.has(category));
            return (
              <li
                key={area.id}
                className="flex flex-col rounded-[18px] border border-rd-line bg-rd-elevated p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-semibold text-rd-accent">{area.num}</span>
                  <RdPill tone="muted">
                    {count} {count === 1 ? "course" : "courses"}
                  </RdPill>
                </div>
                <h3 className="mt-3 font-rd-display text-[clamp(22px,2vw,26px)] font-medium text-rd-ink">
                  {area.name}
                </h3>
                <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{area.description}</p>
                <ul aria-label={`${area.name} categories`} className="mt-5 flex flex-wrap gap-2 border-t border-rd-line pt-4">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/courses?category=${encodeURIComponent(category)}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-rd-line-strong px-3 text-[14px] font-medium text-rd-ink transition-colors hover:border-rd-accent hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
                      >
                        {category}
                        <span className="text-rd-soft">{categoryCounts.get(category)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </RdSection>

      {/* SRS programs */}
      {fullStack ? (
        <RdSection labelledBy="home-programs">
          <RdSectionHeading id="home-programs" eyebrow={homeCopy.programs.eyebrow} title={homeCopy.programs.title} />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
            <article className="flex flex-col rounded-[20px] border border-rd-line bg-rd-muted p-[clamp(22px,3vw,36px)]">
              <div className="flex flex-wrap gap-2">
                <RdPill>{fullStack.category}</RdPill>
              </div>
              <h3 className="mt-4 font-rd-display text-[clamp(28px,3vw,38px)] font-medium leading-[1.1] text-rd-ink">
                {fullStack.name}
              </h3>
              {fullStack.summary ? (
                <p className="mt-3 max-w-[60ch] text-[16.5px] leading-[1.6] text-rd-body">{fullStack.summary}</p>
              ) : null}
              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-rd-line py-5 sm:grid-cols-3">
                <div>
                  <dt className="text-[13px] text-rd-soft">Duration</dt>
                  <dd className="mt-1 font-semibold text-rd-ink">{fullStack.duration}</dd>
                </div>
                {fullStack.level ? (
                  <div>
                    <dt className="text-[13px] text-rd-soft">Level</dt>
                    <dd className="mt-1 font-semibold text-rd-ink">{fullStack.level}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-[13px] text-rd-soft">Modules</dt>
                  <dd className="mt-1 font-semibold text-rd-ink">{fullStack.curriculum?.length ?? fullStack.modules.length}</dd>
                </div>
              </dl>
              <ul aria-label="What the program covers" className="mt-5 flex flex-wrap gap-2">
                {fullStack.modules.map((topic) => (
                  <li key={topic} className="rounded-lg border border-rd-line bg-rd-elevated px-3 py-1.5 text-[14px] text-rd-ink">
                    {topic}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <RdButton href={coursePath(fullStack.slug)} variant="primary">
                  View Details<span className="sr-only">: {fullStack.name}</span>
                </RdButton>
                <RdButton href={enquireHref(fullStack.slug)} variant="accent">
                  Enquire Now
                </RdButton>
              </div>
            </article>

            <ul className="grid gap-5 sm:grid-cols-2">
              {otherPrograms.map((program) => (
                <li
                  key={program.slug}
                  className="flex flex-col rounded-[18px] border border-rd-line bg-rd-elevated p-5 transition-[border-color,box-shadow] hover:border-rd-line-hover hover:shadow-[var(--rd-shadow-card)]"
                >
                  <span className="text-[13px] font-semibold text-rd-link">{program.category}</span>
                  <h3 className="mt-2 font-rd-display text-[22px] font-medium leading-tight text-rd-ink">{program.name}</h3>
                  {program.summary ? (
                    <p className="mt-2 text-[15px] leading-[1.55] text-rd-body">{program.summary}</p>
                  ) : null}
                  <p className="mt-3 text-[14px] text-rd-soft">Duration: {program.duration}</p>
                  <RdButton href={coursePath(program.slug)} variant="text" className="mt-auto self-start pt-2">
                    View details<span className="sr-only">: {program.name}</span> <span aria-hidden="true">→</span>
                  </RdButton>
                </li>
              ))}
            </ul>
          </div>
        </RdSection>
      ) : null}

      {/* Why SRS */}
      <RdSection tone="muted" labelledBy="home-why">
        <RdSectionHeading id="home-why" eyebrow={homeCopy.why.eyebrow} title={homeCopy.why.title} />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-[18px] border border-rd-line bg-rd-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))]">
          {homeCopy.why.items.map((item, index) => (
            <li key={item.title} className="bg-rd-elevated p-6">
              <span
                aria-hidden="true"
                className="inline-flex size-8 items-center justify-center rounded-full bg-rd-tint-green text-[14px] font-semibold text-rd-link"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-[18px] font-semibold leading-snug text-rd-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-rd-body">{item.body}</p>
            </li>
          ))}
        </ol>
      </RdSection>

      {/* About teaser */}
      <RdSection labelledBy="home-about">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-rd-muted">
            <Image
              src={site.imagery.about.src}
              alt={site.imagery.about.alt}
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
            <RdImageCredit image={site.imagery.about} />
          </div>
          <div>
            <RdEyebrow>{homeCopy.aboutTeaser.eyebrow}</RdEyebrow>
            <h2
              id="home-about"
              className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink"
            >
              The training initiative of {site.organisation.legalName}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.65] text-rd-body">{homeCopy.aboutTeaser.body}</p>
            <blockquote className="mt-7 border-l-[3px] border-rd-accent pl-5">
              <p className="font-rd-display text-[clamp(20px,1.8vw,23px)] leading-[1.45] text-rd-ink">
                “{site.organisation.mission}”
              </p>
              <footer className="mt-2 text-[14px] text-rd-soft">— Our mission</footer>
            </blockquote>
            <RdButton href="/about" variant="text" className="mt-6">
              Learn more about us <span aria-hidden="true">→</span>
            </RdButton>
          </div>
        </div>
      </RdSection>

      {/* How you learn */}
      <section aria-labelledby="home-learn" className="bg-rd-inverse py-[clamp(56px,8vw,104px)]">
        <RdContainer>
          <p className="text-[13.5px] font-semibold uppercase tracking-[0.1em] text-rd-inverse-muted">
            {homeCopy.howYouLearn.eyebrow}
          </p>
          <h2
            id="home-learn"
            className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-inverse-text"
          >
            {homeCopy.howYouLearn.title}
          </h2>
          <p className="mt-3 text-[17px] text-rd-inverse-muted">{homeCopy.howYouLearn.intro}</p>
          <ul className="mt-10 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
            {learnBuildAdvance.map((item) => {
              const image = site.imagery[item.image];
              return (
                <li key={item.title}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-rd-inverse-line">
                    <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
                    <RdImageCredit image={image} />
                  </div>
                  <p className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-rd-inverse-muted">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-1.5 font-rd-display text-[24px] font-medium text-rd-inverse-text">{item.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-inverse-muted">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </RdContainer>
      </section>

      {/* Student stories stay unrendered while site.features.showTestimonials is false. */}

      <RdEnquirySection tone="muted" />

      {/* FAQ */}
      <RdSection labelledBy="home-faq" width="prose">
        <RdEyebrow>{homeCopy.faq.eyebrow}</RdEyebrow>
        <h2
          id="home-faq"
          className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink"
        >
          {homeCopy.faq.title}
        </h2>
        <div className="mt-8">
          <RdFaqList entries={faqEntries.slice(0, HOME_FAQ_COUNT)} group="home-faq" />
        </div>
        <RdButton href="/faq" variant="text" className="mt-6">
          All questions <span aria-hidden="true">→</span>
        </RdButton>
      </RdSection>
    </>
  );
}
