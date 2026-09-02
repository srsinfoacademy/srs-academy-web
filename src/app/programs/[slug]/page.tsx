import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MobileCtaBar } from "@/components/program/MobileCtaBar";
import { ProgramBody } from "@/components/program/ProgramBody";
import { ProgramHero } from "@/components/program/ProgramHero";
import { detailFor } from "@/content/program-detail";
import { categoryOf, programs } from "@/content/programs";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

/**
 * Metadata is derived from the program record, so a program cannot be
 * described differently in the page and in its share preview.
 */
export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  const detail = detailFor(slug);
  if (!program || !detail) return {};

  return pageMetadata({
    title: `${program.name} — ${categoryOf(program).name}`,
    description: detail.overview,
    path: routes.program(program.slug),
  });
}

/**
 * Program detail.
 *
 * Server-rendered throughout except the curriculum and FAQ disclosures, the
 * in-page navigation and the mobile CTA bar, which carry the interaction.
 */
export default async function ProgramDetailPage({
  params,
}: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  const detail = detailFor(slug);
  if (!program || !detail) notFound();

  return (
    <>
      <ProgramHero program={program} detail={detail} />
      <ProgramBody program={program} detail={detail} />
      {/* Bottom padding clears the sticky bar so it never covers content. */}
      <div aria-hidden="true" className="h-20 xl:hidden" />
      <MobileCtaBar
        label={detail.primaryCta}
        pending="[PRIMARY PROGRAM CTA DESTINATION]"
      />
    </>
  );
}
