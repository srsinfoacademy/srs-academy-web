"use client";

import { useSearchParams } from "next/navigation";
import { useDeferredValue, useId, useMemo, useRef, useState } from "react";

import { RdButton } from "@/components/redesign/RdButton";
import { RdCourseCard } from "@/components/redesign/RdCourseCard";
import { RdDashedPanel } from "@/components/redesign/RdDashedPanel";
import { durationBucket, durationBuckets, isDurationBucketId, type DurationBucketId } from "@/content/courses/duration";
import { buildSearchIndex, rankCourses } from "@/content/courses/search";
import type { CourseCardData } from "@/content/courses/types";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 24;
const ALL = "All";

/** Writes ?q=, ?category= and ?duration= without a navigation, so filters survive reload and sharing. */
function syncUrl(query: string, category: string, duration: DurationBucketId | null) {
  const params = new URLSearchParams(window.location.search);
  if (query.trim()) params.set("q", query.trim());
  else params.delete("q");
  if (category !== ALL) params.set("category", category);
  else params.delete("category");
  if (duration) params.set("duration", duration);
  else params.delete("duration");
  const search = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
}

/**
 * Searchable, filterable catalogue. Receives a slim list from the server
 * page; filtering is in-memory and the list grows in pages of PAGE_SIZE so
 * the full catalogue never renders at once.
 */
export function RdCourseCatalogue({
  courses,
  categories,
  searchPlaceholder,
}: {
  courses: CourseCardData[];
  categories: { category: string; slug?: string; count: number }[];
  searchPlaceholder: string;
}) {
  const params = useSearchParams();
  const initialCategory = params.get("category") ?? ALL;
  const [query, setQuery] = useState(params.get("q") ?? "");
  // ?category= takes the category name or its admin slug.
  const [category, setCategory] = useState(
    categories.find((item) => item.category === initialCategory || item.slug === initialCategory.toLowerCase())?.category ?? ALL,
  );
  // ?duration= takes a bucket id; with none selected, courses whose duration doesn't parse still show.
  const initialDuration = params.get("duration");
  const [duration, setDuration] = useState<DurationBucketId | null>(isDurationBucketId(initialDuration) ? initialDuration : null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();
  const statusId = useId();

  // Tokenise once per course; filtering then runs on every keystroke.
  const indexed = useMemo(
    () =>
      courses.map((course) => ({
        course,
        bucket: durationBucket(course.duration),
        index: buildSearchIndex({ ...course, topics: course.topicText }),
      })),
    [courses],
  );

  // Counts per duration option across the whole catalogue, like the category chip counts.
  const durationCounts = useMemo(() => {
    const counts = new Map<DurationBucketId, number>();
    for (const entry of indexed) if (entry.bucket) counts.set(entry.bucket, (counts.get(entry.bucket) ?? 0) + 1);
    return counts;
  }, [indexed]);

  const { results: filtered, viaTopics } = useMemo(() => {
    const pool = indexed.filter(
      (entry) => (category === ALL || entry.course.category === category) && (duration === null || entry.bucket === duration),
    );
    const ranked = rankCourses(pool, deferredQuery, (entry) => entry.index);
    return { results: ranked.results.map((entry) => entry.course), viaTopics: ranked.viaTopics };
  }, [indexed, category, duration, deferredQuery]);

  const shown = filtered.slice(0, visible);
  const filteredActive = category !== ALL || duration !== null || deferredQuery.trim().length > 0;
  const status =
    filtered.length === 0
      ? "No courses match"
      : viaTopics
        ? `No course names match “${deferredQuery.trim()}”. Showing ${shown.length} of ${filtered.length} courses whose topic lists mention it.`
        : filteredActive
        ? `Showing ${shown.length} of ${filtered.length} matching courses (${courses.length} in total)`
        : `Showing ${shown.length} of ${courses.length} courses`;

  function update(nextQuery: string, nextCategory: string, nextDuration: DurationBucketId | null = duration) {
    setQuery(nextQuery);
    setCategory(nextCategory);
    setDuration(nextDuration);
    setVisible(PAGE_SIZE);
    syncUrl(nextQuery, nextCategory, nextDuration);
  }

  const categoryOptions = [{ category: ALL, count: courses.length }, ...categories];

  return (
    <div>
      <form
        role="search"
        aria-label="Search and filter courses"
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-wrap items-center gap-2 lg:flex-nowrap"
      >
        <label htmlFor={searchId} className="sr-only">
          Search courses
        </label>
        <div className="relative w-full lg:max-w-[440px] lg:flex-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-rd-soft"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m13 13 4 4" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => update(event.target.value, category)}
            placeholder={searchPlaceholder}
            autoComplete="off"
            aria-describedby={statusId}
            className="h-[46px] w-full rounded-full border border-rd-field bg-rd-elevated pl-10 pr-4 text-[16px] text-rd-ink placeholder:text-rd-soft focus:border-rd-accent focus:outline focus:outline-3 focus:outline-rd-accent/35"
          />
        </div>

        <RdFilterSelect
          label="Category"
          value={category === ALL ? "" : category}
          active={category !== ALL}
          onChange={(value) => update(query, value || ALL)}
          options={categoryOptions.map((item) => ({
            value: item.category === ALL ? "" : item.category,
            label: `${item.category === ALL ? "All categories" : item.category} (${item.count})`,
          }))}
        />

        <RdFilterSelect
          label="Duration"
          value={duration ?? ""}
          active={duration !== null}
          onChange={(value) => update(query, category, isDurationBucketId(value) ? value : null)}
          options={[
            { value: "", label: `All durations (${courses.length})` },
            ...durationBuckets.map((bucket) => ({
              value: bucket.id,
              label: `${bucket.label} (${durationCounts.get(bucket.id) ?? 0})`,
            })),
          ]}
        />

        {filteredActive || query.trim() ? (
          <button
            type="button"
            onClick={() => update("", ALL, null)}
            className="inline-flex min-h-[46px] items-center rounded-full px-3 text-[15px] font-semibold text-rd-ink underline decoration-rd-line-strong underline-offset-4 hover:decoration-rd-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
          >
            Clear all
          </button>
        ) : null}
      </form>

      <p id={statusId} aria-live="polite" className="mt-8 text-[15px] font-medium text-rd-soft">
        {status}
      </p>

      {filtered.length === 0 ? (
        <RdDashedPanel className="mt-5 text-center">
          <p className="font-rd-display text-[26px] font-medium text-rd-ink">No courses match</p>
          <p className="mt-2 text-rd-body">Try a broader search, another category or another duration.</p>
          <RdButton variant="primary" className="mt-5" onClick={() => update("", ALL, null)}>
            Show all courses
          </RdButton>
        </RdDashedPanel>
      ) : (
        <>
          <ul data-reveal="stagger" className="mt-5 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
            {shown.map((course) => (
              <li key={course.slug}>
                <RdCourseCard course={course} />
              </li>
            ))}
          </ul>
          {shown.length < filtered.length ? (
            <div className="mt-10 flex justify-center">
              <RdButton variant="secondary" onClick={() => setVisible((value) => value + PAGE_SIZE)}>
                Show more courses
                <span className="sr-only">
                  {" "}
                  ({filtered.length - shown.length} more)
                </span>
              </RdButton>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * Compact filter pill: a visible label plus a native select, so keyboard,
 * screen reader and mobile pickers all work without a custom listbox.
 * Filled (inverse) when a value is set, like an active chip.
 */
function RdFilterSelect({
  label,
  value,
  active,
  options,
  onChange,
}: {
  label: string;
  value: string;
  active: boolean;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  const selectRef = useRef<HTMLSelectElement>(null);

  // Clicking the pill's label opens the picker too, where the browser supports it.
  function openPicker() {
    try {
      selectRef.current?.showPicker();
    } catch {
      selectRef.current?.focus();
    }
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[46px] w-full min-w-0 items-center rounded-full border transition-colors sm:w-auto",
        "focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-rd-accent",
        active
          ? "border-rd-inverse bg-rd-inverse text-rd-inverse-text"
          : "border-rd-line-strong bg-rd-elevated text-rd-ink hover:border-rd-ink",
      )}
    >
      <label
        htmlFor={id}
        onClick={(event) => {
          event.preventDefault();
          openPicker();
        }}
        className={cn("shrink-0 cursor-pointer pl-4 pr-1.5 text-[15px] font-semibold", active ? "text-rd-inverse-muted" : "text-rd-soft")}
      >
        {label}
      </label>
      <select
        ref={selectRef}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[44px] min-w-0 flex-1 cursor-pointer appearance-none truncate bg-transparent pr-9 text-[15px] font-medium text-current focus:outline-none sm:max-w-[260px]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-rd-elevated text-rd-ink">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </div>
  );
}
