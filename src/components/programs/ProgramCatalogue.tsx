"use client";

import { useCallback, useId, useMemo, useState } from "react";

import { ProgramAccordionList } from "@/components/programs/ProgramAccordionList";
import {
  ProgramFilters,
  emptyFilters,
  isFiltered,
  type Filters,
} from "@/components/programs/ProgramFilters";
import { ProgramPreview } from "@/components/programs/ProgramPreview";
import { ProgramRow } from "@/components/programs/ProgramRow";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { categoryOf, programs as allPrograms } from "@/content/programs";

/**
 * Programs catalogue.
 *
 * Three-column discovery from 1280 up — filters, list, preview. Below that
 * the preview cannot hold a useful width beside the list, so the list becomes
 * the single-open accordion already established on the homepage rather than a
 * squeezed copy of the desktop geometry.
 *
 * Filtering is synchronous over a local array. There is no asynchronous work,
 * so there is no loading state to show: inventing one would be theatre.
 */
export function ProgramCatalogue() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedSlug, setSelectedSlug] = useState(allPrograms[0].slug);
  const [openSlug, setOpenSlug] = useState<string | null>(allPrograms[0].slug);
  const listId = useId();

  const results = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return allPrograms.filter((program) => {
      if (filters.category !== "all" && program.category !== filters.category) {
        return false;
      }
      if (filters.level !== "all" && program.level !== filters.level) return false;
      if (filters.mode !== "all" && program.mode !== filters.mode) return false;
      if (!query) return true;

      const haystack = [
        program.name,
        program.shortDescription,
        categoryOf(program).name,
        categoryOf(program).label,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [filters]);

  // Keep the selection inside the current result set.
  const selected =
    results.find((program) => program.slug === selectedSlug) ?? results[0] ?? null;

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      if (results.length === 0) return;
      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      const current = results.findIndex((p) => p.slug === selected?.slug);
      let next = current;
      if (event.key === "Home") next = 0;
      else if (event.key === "End") next = results.length - 1;
      else next = current + (event.key === "ArrowDown" ? 1 : -1);

      const clamped = Math.min(Math.max(next, 0), results.length - 1);
      setSelectedSlug(results[clamped].slug);
    },
    [results, selected],
  );

  const noResults = results.length === 0;

  return (
    <Container className="pb-[var(--srs-section-loose)]">
      {/*
        The catalogue is a region under the page title. Its heading is visually
        redundant beside the hero, but it keeps the document outline from
        jumping straight from h1 to the program headings.
      */}
      <h2 className="sr-only-srs">Program catalogue</h2>

      <div className="grid gap-10 xl:grid-cols-12 xl:gap-8">
        {/* LEFT — category index and filters */}
        <div className="xl:col-span-3">
          <ProgramFilters
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
            className="xl:sticky xl:top-[calc(var(--srs-header-height-compact)+2rem)]"
          />
        </div>

        {noResults ? (
          <div className="xl:col-span-9">
            <EmptyState filtered={isFiltered(filters)} onReset={() => setFilters(emptyFilters)} />
          </div>
        ) : (
          <>
            {/* CENTER — program list */}
            <div className="xl:col-span-4">
              {/* Desktop: single-select listbox driving the preview. */}
              <ul
                id={listId}
                role="listbox"
                aria-label="Programs"
                aria-activedescendant={selected ? `${listId}-${selected.slug}` : undefined}
                tabIndex={0}
                onKeyDown={onKeyDown}
                className={cn(
                  "hidden rounded-[var(--srs-radius-xl)] border border-line xl:block",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  "focus-visible:outline-[var(--srs-focus)]",
                )}
              >
                {results.map((program) => (
                  <ProgramRow
                    key={program.slug}
                    id={`${listId}-${program.slug}`}
                    program={program}
                    selected={program.slug === selected?.slug}
                    onSelect={() => setSelectedSlug(program.slug)}
                  />
                ))}
              </ul>

              {/* Below 1280: the accordion carries list and detail together. */}
              <div className="xl:hidden">
                <ProgramAccordionList
                  programs={results}
                  openSlug={openSlug}
                  onToggle={setOpenSlug}
                />
              </div>
            </div>

            {/* RIGHT — selected program preview */}
            {selected ? (
              <div className="hidden xl:col-span-5 xl:block">
                <ProgramPreview
                  program={selected}
                  className="xl:sticky xl:top-[calc(var(--srs-header-height-compact)+2rem)]"
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </Container>
  );
}

function EmptyState({ filtered, onReset }: { filtered: boolean; onReset: () => void }) {
  return (
    <div className="rise-in rounded-[var(--srs-radius-xl)] border border-line p-10 text-center">
      <p className="type-index text-lime">No results</p>
      <p className="type-body-l mt-4 text-primary">
        {filtered
          ? "No programs match these filters."
          : "No programs are listed yet."}
      </p>
      {filtered ? (
        <button
          type="button"
          onClick={onReset}
          className={cn(
            "type-index mt-6 min-h-11 rounded-[var(--srs-radius-sm)] px-3 text-lime",
            "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
            "hover:text-lime-hover",
          )}
        >
          Reset filters
        </button>
      ) : null}
    </div>
  );
}
