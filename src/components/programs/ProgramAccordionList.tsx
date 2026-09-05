"use client";

import { useId } from "react";

import { ProgramArt } from "@/components/home/ProgramArt";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { catalogueCategoryOf, statusLabel } from "@/content/programs";
import { routes } from "@/lib/routes";
import type { Program } from "@/types/program";

/**
 * Mobile and tablet catalogue list.
 *
 * Single-open accordion: opening one row closes the current one, which keeps
 * scroll position predictable on a small screen. The whole row is the control
 * at a 64px minimum height; the +/− glyph is decorative and never the only
 * hit area.
 */
export function ProgramAccordionList({
  programs,
  openSlug,
  onToggle,
}: {
  programs: Program[];
  openSlug: string | null;
  onToggle: (slug: string | null) => void;
}) {
  const baseId = useId();

  return (
    <ul className="border-t border-line">
      {programs.map((program) => {
        const isOpen = openSlug === program.slug;
        const panelId = `${baseId}-${program.slug}`;
        const category = catalogueCategoryOf(program);
        const headerMeta = [category.label, statusLabel[program.status]].filter(
          (v): v is string => typeof v === "string" && !v.startsWith("["),
        );
        const rows = [
          { label: "Duration", value: program.duration },
          { label: "Mode", value: program.mode },
          { label: "Level", value: program.level },
          { label: "Eligibility", value: program.eligibility },
        ].filter((row): row is { label: string; value: string } => typeof row.value === "string" && !row.value.startsWith("["));

        return (
          <li key={program.slug} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(isOpen ? null : program.slug)}
                className={cn(
                  "flex min-h-16 w-full items-center gap-4 py-4 text-left",
                  "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                  isOpen ? "text-primary" : "text-secondary",
                )}
              >
                <span className={cn("type-index", isOpen ? "text-lime" : "text-muted")}>
                  {program.num}
                </span>
                <span className="flex-1">
                  <span className="type-h4 block text-current">{program.name}</span>
                  <span className="type-index mt-1.5 block">{headerMeta.join(" · ")}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-11 shrink-0 place-items-center text-lg text-lime",
                    "transition-transform duration-[var(--srs-duration-fast)] ease-standard",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>

            <div className="accordion-panel" data-open={isOpen}>
              <div>
                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? true : undefined}
                  className="accordion-panel-content pb-6"
                >
                  <div className="h-28 rounded-[var(--srs-radius-lg)] border border-line-hairline p-4">
                    <ProgramArt type={program.visualType} />
                  </div>
                  <p className="type-index mt-3">{program.artLabel}</p>

                  {program.shortDescription ? (
                    <p className="type-body-s mt-4">{program.shortDescription}</p>
                  ) : null}

                  {rows.length > 0 ? (
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                      {rows.map((row) => (
                        <div key={row.label} className="flex flex-col gap-1">
                          <dt className="type-index">{row.label}</dt>
                          <dd className="type-body-s text-primary">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <div className="mt-6">
                    <Button href={routes.program(program.slug)} size="md" block>
                      View Program →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
