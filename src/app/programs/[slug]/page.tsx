import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { categoryOf, programs } from "@/content/programs";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};

  return pageMetadata({
    title: program.name,
    description: program.shortDescription,
    path: routes.program(program.slug),
  });
}

/**
 * Program detail — placeholder.
 *
 * Phase 4 builds this page in full. It exists now so that every link out of
 * the catalogue resolves rather than 404ing, and it says plainly that the
 * content is still to come rather than implying an empty program.
 */
export default async function ProgramDetailPage({
  params,
}: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  const category = categoryOf(program);

  return (
    <>
      <PageHero
        variant="program"
        index="04"
        eyebrow="Program"
        title={program.name}
        lead={program.shortDescription}
        breadcrumb={[{ label: "Programs", href: routes.programs }, { label: program.name }]}
        meta={[
          { label: "Level", value: program.level },
          { label: "Duration", value: program.duration },
          { label: "Mode", value: program.mode },
          { label: "Category", value: category.name },
        ]}
      />

      <Section spacing="tight" ruled>
        <p className="type-body-l measure">
          [PROGRAM DETAIL CONTENT — curriculum, eligibility, certification, fees,
          admissions journey and FAQ are built in a later phase.]
        </p>
        <div className="mt-8">
          <Button href={routes.programs} variant="secondary" size="md">
            ← All programs
          </Button>
        </div>
      </Section>
    </>
  );
}
