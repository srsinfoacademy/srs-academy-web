import { ProgramArt } from "@/components/home/ProgramArt";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GridBackground } from "@/components/knowledge-os/GridBackground";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { cn } from "@/lib/cn";
import { categoryOf, statusLabel } from "@/content/programs";
import { routes } from "@/lib/routes";
import type { Program, ProgramDetail } from "@/types/program";

/**
 * Program hero.
 *
 * The network on this page is category geometry — static, with a hover
 * response — rather than the homepage's five-node system, so the page is
 * recognisably part of the family without repeating its signature.
 */
export function ProgramHero({
  program,
  detail,
}: {
  program: Program;
  detail: ProgramDetail;
}) {
  const category = categoryOf(program);

  const meta = [
    { label: "Level", value: program.level },
    { label: "Duration", value: program.duration },
    { label: "Mode", value: program.mode },
    { label: "Category", value: category.name },
    ...(detail.startDate ? [{ label: "Start date", value: detail.startDate }] : []),
  ];

  return (
    <section
      aria-labelledby="program-title"
      className="relative isolate overflow-hidden pb-[var(--srs-section)] pt-[var(--srs-section-tight)]"
    >
      <GridBackground fade="radial" size={88} />

      <Container className="relative">
        <div className="hero-enter">
          <Breadcrumb
            items={[{ label: "Programs", href: routes.programs }, { label: program.name }]}
          />
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <IndexLabel index="04" as="p" className="hero-enter">
              Program
            </IndexLabel>

            <p
              className="type-index hero-enter mt-6 text-secondary"
              style={{ animationDelay: "60ms" }}
            >
              {category.name}
            </p>

            <h1
              id="program-title"
              className="type-h1 hero-enter mt-3 max-w-[18ch]"
              style={{ animationDelay: "120ms" }}
            >
              {program.name}
            </h1>

            <p
              className="type-body-l hero-enter mt-6 max-w-[58ch]"
              style={{ animationDelay: "180ms" }}
            >
              {detail.overview}
            </p>

            {/* Status is text, never colour alone. */}
            <p
              className="type-index hero-enter mt-6 inline-flex items-center gap-2"
              style={{ animationDelay: "220ms" }}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-lime" />
              {statusLabel[program.status]}
            </p>

            <div className="hero-enter mt-8" style={{ animationDelay: "260ms" }}>
              <Button pending="[PRIMARY PROGRAM CTA DESTINATION]" size="md">
                {detail.primaryCta}
              </Button>
            </div>

            {/* Marks where the hero CTA leaves the viewport. */}
            <div id="hero-cta-sentinel" aria-hidden="true" className="h-px" />
          </div>

          <div className="lg:col-span-5">
            <div
              className={cn(
                "hero-enter group h-44 rounded-[var(--srs-radius-xl)] border border-line bg-surface-2 p-6",
                "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                "hover:border-line-strong sm:h-56",
              )}
              style={{ animationDelay: "300ms" }}
            >
              <ProgramArt type={program.visualType} />
            </div>
            <p className="type-index mt-3">{program.artLabel}</p>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line-hairline pt-8 lg:grid-cols-5">
          {meta.map((row) => (
            <div key={row.label} className="flex flex-col gap-1.5">
              <dt className="type-index">{row.label}</dt>
              <dd className="type-body-s text-primary">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
