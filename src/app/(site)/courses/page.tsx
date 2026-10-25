import type { Metadata } from "next";
import { Suspense } from "react";

import { RdContainer } from "@/components/redesign/RdContainer";
import { RdCourseCard } from "@/components/redesign/RdCourseCard";
import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdSection, RdSectionHeading } from "@/components/redesign/RdSection";
import { RdCourseCatalogue } from "@/components/redesign/courses/RdCourseCatalogue";
import { coursesCopy } from "@/content/public-pages";
import { getPublicCatalogue, getPublicCategories, getPublicSrsPrograms, toPublicCard } from "@/lib/data/courses";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Courses",
  description: coursesCopy.intro,
  path: "/courses",
});

export default async function CoursesPage() {
  const [catalogue, categories, srsPrograms] = await Promise.all([getPublicCatalogue(), getPublicCategories(), getPublicSrsPrograms()]);
  const cards = catalogue.map((course) => toPublicCard(course, true));
  const programs = srsPrograms.map((course) => toPublicCard(course));

  return (
    <>
      <RdPageHero
        eyebrow={coursesCopy.eyebrow}
        title={coursesCopy.title}
        intro={coursesCopy.intro}
        titleClassName="text-[clamp(36px,4.6vw,56px)]"
      />

      <section aria-labelledby="catalogue-title" className="border-b border-rd-line py-[clamp(40px,6vw,72px)]">
        <RdContainer>
          <h2 id="catalogue-title" className="sr-only">
            Course catalogue
          </h2>
          <Suspense
            fallback={
              <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
                {cards.slice(0, 24).map((course) => (
                  <li key={course.slug}>
                    <RdCourseCard course={course} />
                  </li>
                ))}
              </ul>
            }
          >
            <RdCourseCatalogue
              courses={cards}
              categories={categories}
              searchPlaceholder={coursesCopy.searchPlaceholder}
            />
          </Suspense>
        </RdContainer>
      </section>

      <RdSection tone="muted" labelledBy="srs-programs">
        <RdSectionHeading
          id="srs-programs"
          eyebrow={coursesCopy.programsEyebrow}
          title={coursesCopy.programsTitle}
          intro={coursesCopy.programsIntro}
        />
        <ul data-reveal="stagger" className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
          {programs.map((course) => (
            <li key={course.slug}>
              <RdCourseCard course={course} />
            </li>
          ))}
        </ul>
      </RdSection>
    </>
  );
}
