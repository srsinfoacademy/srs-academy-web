"use client";

import { useCallback, useId, useRef, useState } from "react";

import { ProgramArt } from "@/components/home/ProgramArt";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { categoryOf, programMetaRows, programs } from "@/content/programs";
import { routes } from "@/lib/routes";

/**
 * Desktop program explorer.
 *
 * The list is a single-select listbox: arrow keys move selection, Home and
 * End jump to the ends, and Enter opens the program. Selection follows focus,
 * which is the expected behaviour for a listbox that drives a preview.
 *
 * The preview shell stays put and only its contents swap, so the surface
 * never appears to reload.
 */
export function ProgramExplorer() {
  const [index, setIndex] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const active = programs[index];

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (keys.includes(event.key)) {
      event.preventDefault();
      setIndex((current) => {
        if (event.key === "Home") return 0;
        if (event.key === "End") return programs.length - 1;
        const next = current + (event.key === "ArrowDown" ? 1 : -1);
        return Math.min(Math.max(next, 0), programs.length - 1);
      });
    }
  }, []);

  return (
    <div className="mt-14 grid gap-8 xl:grid-cols-12 xl:gap-10">
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label="Programs"
        aria-activedescendant={`${listId}-${active.slug}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn(
          "flex flex-col rounded-[var(--srs-radius-xl)] border border-line",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--srs-focus)]",
          "xl:col-span-5",
        )}
      >
        {programs.map((program, i) => {
          const selected = i === index;

          return (
            <li
              key={program.slug}
              id={`${listId}-${program.slug}`}
              role="option"
              aria-selected={selected}
              onClick={() => setIndex(i)}
              className={cn(
                "group flex cursor-pointer items-baseline gap-4 border-b border-line-hairline px-6 py-5 last:border-b-0",
                "transition-[background-color,color,transform] duration-[var(--srs-duration-fast)] ease-standard",
                selected
                  ? "translate-x-1.5 bg-[rgb(216_255_94_/_0.07)] text-primary"
                  : "text-secondary hover:translate-x-1 hover:bg-[rgb(242_244_239_/_0.03)]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-4 w-0.5 shrink-0 self-center rounded-full transition-[width,background-color] duration-[var(--srs-duration-fast)] ease-standard",
                  selected ? "w-1 bg-lime" : "bg-line group-hover:w-0.5 group-hover:bg-line-strong",
                )}
              />
              <span className={cn("type-index", selected ? "text-lime" : "text-muted")}>
                {program.num}
              </span>
              <span className="type-h4 flex-1 text-current">{program.name}</span>
              <span className="type-index">{program.level}</span>
            </li>
          );
        })}
      </ul>

      {/* Preview shell — fixed surface, swapping contents. */}
      <div
        className={cn(
          "flex flex-col rounded-[var(--srs-radius-xl)] border border-line bg-surface-2 p-8",
          "xl:col-span-7",
        )}
      >
        {/*
          Keyed on the selected program: the whole preview body fades and
          rises in on selection rather than the shell reloading.
        */}
        <div key={active.slug} className="rise-in flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <p className="type-index text-lime">
            {active.num} / {categoryOf(active).label.toUpperCase()}
          </p>
          <p className="type-index">{active.level}</p>
        </div>

        <div className="mt-6 h-40 rounded-[var(--srs-radius-lg)] border border-line-hairline p-6">
          <ProgramArt type={active.visualType} />
        </div>
        <p className="type-index mt-3">{active.artLabel}</p>

        <h3 className="type-h3 mt-6">{active.name}</h3>
        <p className="type-body-s mt-3 max-w-[56ch]">{active.shortDescription}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line-hairline pt-5 sm:grid-cols-3">
          {programMetaRows(active).map((row) => (
            <div key={row.label} className="flex flex-col gap-1.5">
              <dt className="type-index">{row.label}</dt>
              <dd className="type-body-s text-primary">{row.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 flex flex-wrap items-center gap-2">
          {(active.pathway ?? []).map((step) => (
            <li
              key={step}
              className="type-label rounded-[var(--srs-radius-full)] border border-line px-3 py-1.5"
            >
              {step}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button href={routes.program(active.slug)} size="md" variant="secondary">
            Explore Program
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
