"use client";

import { useId, useState } from "react";

import { ProgramArt } from "@/components/home/ProgramArt";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { programMetaRows, programs } from "@/content/programs";
import { routes } from "@/lib/routes";

/**
 * Mobile program accordion.
 *
 * Single-open: opening one row closes the current one, which keeps scroll
 * position predictable on a 390px screen. The whole row is the control at a
 * 64px minimum height; the +/− glyph is decorative and never the only hit
 * area. The sign matches the desktop index language better than a chevron.
 */
export function ProgramAccordion() {
  const [open, setOpen] = useState<string | null>(programs[0].slug);
  const baseId = useId();

  return (
    <ul className="mt-10 border-t border-line">
      {programs.map((program) => {
        const isOpen = open === program.slug;
        const panelId = `${baseId}-${program.slug}`;

        return (
          <li key={program.slug} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : program.slug)}
                className={cn(
                  "flex min-h-16 w-full items-center gap-4 py-4 text-left",
                  "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                  isOpen ? "text-primary" : "text-secondary",
                )}
              >
                <span className={cn("type-index", isOpen ? "text-lime" : "text-muted")}>
                  {program.num}
                </span>
                <span className="type-h4 flex-1 text-current">{program.name}</span>
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

            {/* Collapsed content is display:none, so it leaves the a11y tree. */}
            <div id={panelId} hidden={!isOpen} className="pb-6">
              <div className="h-28 rounded-[var(--srs-radius-lg)] border border-line-hairline p-4">
                <ProgramArt type={program.visualType} />
              </div>
              <p className="type-index mt-3">{program.artLabel}</p>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {programMetaRows(program).map((row) => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <dt className="type-index">{row.label}</dt>
                    <dd className="type-body-s text-primary">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="type-body-s mt-4">{program.shortDescription}</p>

              <div className="mt-6">
                <Button
                  href={routes.program(program.slug)}
                  size="md"
                  variant="secondary"
                  block
                >
                  Explore Program
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
