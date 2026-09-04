"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type DisclosureItem = {
  key: string;
  /** Leading index, e.g. a module number. Omitted for FAQ rows. */
  index?: string;
  title: string;
  content: ReactNode;
};

/**
 * Single-open disclosure list — the curriculum and the program FAQ share it,
 * as the design specifies one accordion component for both.
 *
 * Real buttons with aria-expanded and aria-controls; collapsed panels are
 * display:none, so their content leaves the accessibility tree rather than
 * lingering as hidden text. Opening one closes the current one, which keeps
 * scroll position predictable on a long page.
 *
 * The +/− glyph matches the index language used elsewhere; it is decorative
 * and never the only hit area, since the whole row is the control.
 */
export function Disclosure({
  items,
  headingLevel: Heading = "h3",
  defaultOpen = null,
}: {
  items: DisclosureItem[];
  headingLevel?: "h3" | "h4";
  defaultOpen?: string | null;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const baseId = useId();

  return (
    <ul className="border-t border-line">
      {items.map((item) => {
        const isOpen = open === item.key;
        const panelId = `${baseId}-${item.key}`;

        return (
          <li key={item.key} className="border-b border-line">
            <Heading>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.key)}
                className={cn(
                  "flex min-h-16 w-full items-center gap-4 py-4 text-left",
                  "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                  isOpen ? "text-primary" : "text-secondary hover:text-primary",
                )}
              >
                {item.index ? (
                  <span
                    className={cn("type-index shrink-0", isOpen ? "text-lime" : "text-muted")}
                  >
                    {item.index}
                  </span>
                ) : null}

                <span className="type-h4 flex-1 text-balance text-current">
                  {item.title}
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
            </Heading>

            <div className="accordion-panel" data-open={isOpen}>
              <div>
                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? true : undefined}
                  className="accordion-panel-content pb-6 pl-0 sm:pl-12"
                >
                  {item.content}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
