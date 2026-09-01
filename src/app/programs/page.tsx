import type { Metadata } from "next";

import { ProgramCatalogue } from "@/components/programs/ProgramCatalogue";
import { PageHero } from "@/components/page/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Programs",
  description: "[PROGRAMS OVERVIEW — approved copy pending.]",
  path: routes.programs,
});

/**
 * Programs catalogue.
 *
 * The sitemap assigns this page the editorial hero. The hero and page chrome
 * are server-rendered; only the catalogue itself is a client component,
 * because only it carries interaction.
 */
export default function ProgramsPage() {
  return (
    <>
      <PageHero
        variant="editorial"
        index="03"
        eyebrow="Programs"
        title="Five routes into the system."
        lead="[PROGRAMS OVERVIEW — 2 SENTENCES. Approved copy pending.]"
        breadcrumb={[{ label: "Programs" }]}
      />
      <ProgramCatalogue />
    </>
  );
}
