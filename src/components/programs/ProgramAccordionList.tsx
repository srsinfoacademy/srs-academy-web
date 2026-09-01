"use client";

import { useId } from "react";

import { ProgramArt } from "@/components/home/ProgramArt";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { categoryOf, statusLabel } from "@/content/programs";
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
        const category = categoryOf(program);

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
                  <span className="type-index mt-1.5 block">
                    {category.label} · {statusLabel[program.status]}
                  </span>
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

            <div id={panelId} hidden={!isOpen} className="pb-6">
              <div className="h-28 rounded-[var(--srs-radius-lg)] border border-line-hairline p-4">
                <ProgramArt type={program.visualType} />
              </div>
              <p className="type-index mt-3">{program.artLabel}</p>

              <p className="type-body-s mt-4">{program.shortDescription}</p>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { label: "Duration", value: program.duration },
                  { label: "Mode", value: program.mode },
                  { label: "Level", value: program.level },
                  { label: "Eligibility", value: program.eligibility },
                ].map((row) => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <dt className="type-index">{row.label}</dt>
                    <dd className="type-body-s text-primary">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                <Button href={routes.program(program.slug)} size="md" block>
                  View Program →
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
