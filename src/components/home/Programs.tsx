import { ProgramAccordion } from "@/components/home/ProgramAccordion";
import { ProgramExplorer } from "@/components/home/ProgramExplorer";
import { Button } from "@/components/ui/Button";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/routes";

/**
 * Homepage programs preview — not the full catalogue.
 *
 * The explorer and the accordion are two presentations of one data source.
 * Only one is in the DOM at a time: the hidden variant is display:none, so it
 * is absent from the accessibility tree rather than duplicated in it.
 */
export function Programs() {
  return (
    <Section spacing="loose" surface="surface-1" ruled aria-labelledby="programs-title">
      <IndexLabel index="04" as="p">
        Programs
      </IndexLabel>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <h2 id="programs-title" className="type-h2 max-w-[18ch]">
          Five routes into the system
        </h2>
        <Button href={routes.programs} variant="ghost" size="sm">
          All programs →
        </Button>
      </div>

      <div className="hidden lg:block">
        <ProgramExplorer />
      </div>
      <div className="lg:hidden">
        <ProgramAccordion />
      </div>
    </Section>
  );
}
