"use client";

import { useSearchParams } from "next/navigation";
import { useDeferredValue, useId, useMemo, useState } from "react";

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
  const durationLabelId = useId();

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

  // Counts per duration bucket across the whole catalogue, like the category chip counts.
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

  const chipClass = (active: boolean) =>
    cn(
      "inline-flex min-h-[42px] items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors",
      "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
      active
        ? "border-rd-inverse bg-rd-inverse text-rd-inverse-text"
        : "border-rd-line-strong bg-rd-elevated text-rd-ink hover:border-rd-ink",
    );

  const chips = [{ category: ALL, count: courses.length }, ...categories];

  return (
    <div>
      <form role="search" onSubmit={(event) => event.preventDefault()} className="max-w-[720px]">
        <label htmlFor={searchId} className="text-[15px] font-semibold text-rd-ink">
          Search courses
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => update(event.target.value, category)}
          placeholder={searchPlaceholder}
          autoComplete="off"
          aria-describedby={statusId}
          className="mt-2 h-[54px] w-full rounded-[12px] border border-rd-field bg-rd-elevated px-4 text-[17px] text-rd-ink placeholder:text-rd-soft focus:border-rd-accent focus:outline focus:outline-3 focus:outline-rd-accent/35"
        />
      </form>

      <div role="group" aria-label="Filter by category" className="mt-5 flex flex-wrap gap-2">
        {chips.map((item) => {
          const active = item.category === category;
          return (
            <button
              key={item.category}
              type="button"
              aria-pressed={active}
              onClick={() => update(query, item.category)}
              className={chipClass(active)}
            >
              {item.category === ALL ? "All courses" : item.category}
              <span className={active ? "text-rd-inverse-muted" : "text-rd-soft"}>{item.count}</span>
            </button>
          );
        })}
      </div>

      <div role="group" aria-labelledby={durationLabelId} className="mt-3 flex flex-wrap items-center gap-2">
        <span id={durationLabelId} className="mr-1 text-[14px] font-semibold text-rd-soft">
          Duration
        </span>
        {durationBuckets.map((bucket) => {
          const active = bucket.id === duration;
          return (
            <button
              key={bucket.id}
              type="button"
              aria-pressed={active}
              onClick={() => update(query, category, active ? null : bucket.id)}
              className={chipClass(active)}
            >
              {bucket.label}
              <span className={active ? "text-rd-inverse-muted" : "text-rd-soft"}>{durationCounts.get(bucket.id) ?? 0}</span>
            </button>
          );
        })}
      </div>

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
