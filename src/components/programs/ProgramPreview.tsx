import { ProgramArt } from "@/components/home/ProgramArt";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { categoryOf, statusLabel } from "@/content/programs";
import { routes } from "@/lib/routes";
import type { Program } from "@/types/program";

/**
 * Selected-program preview.
 *
 * The shell stays put and only its contents swap, so the surface never
 * appears to reload — the behaviour specified for the homepage explorer,
 * reused here.
 */
export function ProgramPreview({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  const category = categoryOf(program);

  const rows = [
    { label: "Duration", value: program.duration },
    { label: "Mode", value: program.mode },
    { label: "Level", value: program.level },
    { label: "Eligibility", value: program.eligibility },
  ];

  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--srs-radius-xl)] border border-line bg-surface-2 p-6 sm:p-8",
        className,
      )}
    >
      {/*
        Keyed on the program: the body fades and rises in on each selection
        rather than the shell (border, surface, sticky offset) reloading.
      */}
      <div key={program.slug} className="rise-in flex flex-1 flex-col">
      <div className="flex items-baseline justify-between gap-4">
        <p className="type-index text-lime">
          {program.num} / {category.label.toUpperCase()}
        </p>
        <p className="type-index">{statusLabel[program.status]}</p>
      </div>

      {/* Category-specific abstract visual — SVG only, no imagery. */}
      <div className="mt-6 h-36 rounded-[var(--srs-radius-lg)] border border-line-hairline p-5 sm:h-44">
        <ProgramArt type={program.visualType} />
      </div>
      <p className="type-index mt-3">{program.artLabel}</p>

      <h3 className="type-h3 mt-6">{program.name}</h3>
      <p className="type-body-s mt-3">{program.shortDescription}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line-hairline pt-5">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1.5">
            <dt className="type-index">{row.label}</dt>
            <dd className="type-body-s text-primary">{row.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 flex flex-wrap items-center gap-2">
        {program.pathway.map((step) => (
          <li
            key={step}
            className="type-label rounded-[var(--srs-radius-full)] border border-line px-3 py-1.5"
          >
            {step}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button href={routes.program(program.slug)} size="md">
          View Program →
        </Button>
      </div>
      </div>
    </div>
  );
}
