"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";
import {
  catalogueCategories,
  catalogueCourseTypeOptions,
  catalogueDurationOptions,
  catalogueLevelOptions,
  catalogueModeOptions,
} from "@/content/programs";
import type { SharedCategorySlug } from "@/content/catalogue/types";

export type Filters = {
  query: string;
  category: SharedCategorySlug | "all";
  level: string;
  mode: string;
  courseType: string;
  duration: string;
};

export const emptyFilters: Filters = {
  query: "",
  category: "all",
  level: "all",
  mode: "all",
  courseType: "all",
  duration: "all",
};

export function isFiltered(filters: Filters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.category !== "all" ||
    filters.level !== "all" ||
    filters.mode !== "all" ||
    filters.courseType !== "all" ||
    filters.duration !== "all"
  );
}

/**
 * Catalogue search and filters.
 *
 * Native form controls throughout: a search input and two selects, each with
 * a real label. Nothing here needs a library, and native controls come with
 * keyboard behaviour, mobile pickers and screen-reader support already
 * correct.
 */
export function ProgramFilters({
  filters,
  onChange,
  resultCount,
  className,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
  className?: string;
}) {
  const searchId = useId();
  const levelId = useId();
  const modeId = useId();
  const courseTypeId = useId();
  const durationId = useId();

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  const selectClass = cn(
    "h-11 w-full rounded-[var(--srs-radius-md)] border border-line bg-surface-2 px-3",
    "type-body-s text-primary",
    "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
    "hover:border-line-strong",
  );

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col gap-2">
        <label htmlFor={searchId} className="type-index">
          Search programs
        </label>
        <div className="relative">
          <input
            id={searchId}
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="[SEARCH PROGRAMS]"
            className={cn(
              "h-11 w-full rounded-[var(--srs-radius-md)] border border-line bg-surface-2",
              "pl-3 pr-10 type-body-s text-primary placeholder:text-muted",
              "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
              "hover:border-line-strong focus-visible:border-lime",
            )}
          />
          {filters.query ? (
            <button
              type="button"
              onClick={() => set({ query: "" })}
              className={cn(
                "rise-in absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center",
                "rounded-[var(--srs-radius-sm)] text-muted",
                "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                "hover:text-primary",
              )}
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only-srs">Clear search</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="type-index">Category</p>
        <ul className="flex flex-wrap gap-2 xl:flex-col xl:gap-0">
          {[{ id: "all" as const, num: "—", label: "All programs" }, ...catalogueCategories.map((c, i) => ({ id: c.id, num: String(i + 1).padStart(2, "0"), label: c.label }))].map(
            (category) => {
              const active = filters.category === category.id;

              return (
                <li key={category.id} className="xl:w-full">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => set({ category: category.id })}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-3 px-3",
                      "rounded-[var(--srs-radius-md)] border border-line xl:border-transparent",
                      "type-body-s text-left",
                      "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                      active
                        ? "border-line-active bg-[rgb(216_255_94_/_0.07)] text-primary"
                        : "text-secondary hover:bg-[rgb(242_244_239_/_0.03)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        active ? "bg-lime" : "bg-transparent",
                      )}
                    />
                    <span className="type-index shrink-0">{category.num}</span>
                    <span className="flex-1">{category.label}</span>
                  </button>
                </li>
              );
            },
          )}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
        {/* Mode and Level only appear once real, verified data exists for at least one program — never a filter with zero useful options. */}
        {catalogueLevelOptions.length > 0 ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={levelId} className="type-index">
              Level
            </label>
            <select
              id={levelId}
              value={filters.level}
              onChange={(e) => set({ level: e.target.value })}
              className={selectClass}
            >
              <option value="all">All levels</option>
              {catalogueLevelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {catalogueModeOptions.length > 0 ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={modeId} className="type-index">
              Mode
            </label>
            <select
              id={modeId}
              value={filters.mode}
              onChange={(e) => set({ mode: e.target.value })}
              className={selectClass}
            >
              <option value="all">All modes</option>
              {catalogueModeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {catalogueCourseTypeOptions.length > 0 ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={courseTypeId} className="type-index">
              Course type
            </label>
            <select
              id={courseTypeId}
              value={filters.courseType}
              onChange={(e) => set({ courseType: e.target.value })}
              className={selectClass}
            >
              <option value="all">All course types</option>
              {catalogueCourseTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {catalogueDurationOptions.length > 0 ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={durationId} className="type-index">
              Duration
            </label>
            <select
              id={durationId}
              value={filters.duration}
              onChange={(e) => set({ duration: e.target.value })}
              className={selectClass}
            >
              <option value="all">Any duration</option>
              {catalogueDurationOptions.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line-hairline pt-5">
        <p className="type-index" aria-live="polite">
          {resultCount} {resultCount === 1 ? "program" : "programs"}
        </p>
        {isFiltered(filters) ? (
          <button
            type="button"
            onClick={() => onChange(emptyFilters)}
            className={cn(
              "type-index min-h-11 rounded-[var(--srs-radius-sm)] px-2 text-lime",
              "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
              "hover:text-lime-hover",
            )}
          >
            Reset filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
