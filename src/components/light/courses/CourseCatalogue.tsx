"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { LightButton } from "@/components/light/ui/LightButton";
import {
  courseCategories,
  courses,
  durationLabels,
  levelLabels,
  modeLabels,
  type Course,
  type CourseCategoryId,
  type CourseDurationBucket,
  type CourseLevel,
  type CourseMode,
} from "@/content/light/courses";
import { lightRoutes } from "@/lib/light/routes";

type Filters = {
  category: CourseCategoryId | "all";
  mode: CourseMode | "all";
  level: CourseLevel | "all";
  duration: CourseDurationBucket | "all";
};

const chipBase =
  "sl-focus rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[var(--sl-dur-fast)] whitespace-nowrap";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${chipBase} ${
        active ? "bg-sl-ink text-sl-paper" : "border border-sl-ink/15 bg-white/70 text-sl-ink hover:border-sl-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

export function CourseCatalogue({ initialQuery = "", initialCategory = "all" }: { initialQuery?: string; initialCategory?: string }) {
  const [search, setSearch] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    category: (courseCategories.some((c) => c.id === initialCategory) ? initialCategory : "all") as Filters["category"],
    mode: "all",
    level: "all",
    duration: "all",
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      if (filters.category !== "all" && c.category !== filters.category) return false;
      if (filters.mode !== "all" && c.mode !== filters.mode) return false;
      if (filters.level !== "all" && c.level !== filters.level) return false;
      if (filters.duration !== "all" && c.duration !== filters.duration) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.blurb.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, filters]);

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.mode !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.duration !== "all" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  function reset() {
    setSearch("");
    setFilters({ category: "all", mode: "all", level: "all", duration: "all" });
  }

  const filterPanel = (
    <div className="flex flex-col gap-5">
      <FilterGroup
        label="Learning mode"
        options={[{ id: "all", label: "Any mode" }, ...Object.entries(modeLabels).map(([id, label]) => ({ id, label }))]}
        active={filters.mode}
        onSelect={(id) => setFilters((f) => ({ ...f, mode: id as Filters["mode"] }))}
      />
      <FilterGroup
        label="Level"
        options={[{ id: "all", label: "Any level" }, ...Object.entries(levelLabels).map(([id, label]) => ({ id, label }))]}
        active={filters.level}
        onSelect={(id) => setFilters((f) => ({ ...f, level: id as Filters["level"] }))}
      />
      <FilterGroup
        label="Duration"
        options={[{ id: "all", label: "Any duration" }, ...Object.entries(durationLabels).map(([id, label]) => ({ id, label }))]}
        active={filters.duration}
        onSelect={(id) => setFilters((f) => ({ ...f, duration: id as Filters["duration"] }))}
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex max-w-160 items-center gap-3 rounded-full border border-sl-ink/15 bg-white py-2 pl-5 pr-2">
        <span aria-hidden="true" className="text-lg">
          🔍
        </span>
        <label htmlFor="catalogue-search" className="sr-only">
          Search courses
        </label>
        <input
          id="catalogue-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses, skills or careers"
          className="sl-focus min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-sl-ink/45"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5" role="group" aria-label="Category">
        <Chip active={filters.category === "all"} onClick={() => setFilters((f) => ({ ...f, category: "all" }))}>
          ✨ All
        </Chip>
        {courseCategories.map((cat) => (
          <Chip
            key={cat.id}
            active={filters.category === cat.id}
            onClick={() => setFilters((f) => ({ ...f, category: cat.id }))}
          >
            {cat.emoji} {cat.label}
          </Chip>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="sl-focus mb-5 flex w-full items-center justify-between rounded-[var(--radius-sl-md)] border border-sl-ink/15 bg-white px-4 py-3 text-sm font-semibold min-[900px]:hidden"
      >
        <span>Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}</span>
        <span aria-hidden="true">⚙️</span>
      </button>

      <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[220px_1fr]">
        <aside className="hidden min-[900px]:block">
          <div className="sticky top-24">
            {filterPanel}
            {activeFilterCount > 0 ? (
              <button type="button" onClick={reset} className="sl-focus mt-5 text-sm font-semibold underline">
                Clear filters
              </button>
            ) : null}
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-sl-ink/60">
              {filtered.length} {filtered.length === 1 ? "course" : "courses"}
            </p>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="sl-focus text-sm font-semibold min-[900px]:hidden"
                style={{ color: "var(--sl-accent-text)" }}
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="sl-glass flex flex-col items-center gap-3 rounded-[var(--radius-sl-lg)] px-6 py-16 text-center">
              <span className="text-3xl" aria-hidden="true">
                🔍
              </span>
              <p className="text-base font-semibold">No courses match those filters</p>
              <p className="max-w-90 text-sm text-sl-ink/60">
                Try a different search term, or clear your filters to see the full
                catalogue.
              </p>
              <LightButton onClick={reset} variant="dark" size="sm">
                Clear filters
              </LightButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4.5 min-[560px]:grid-cols-2 min-[1250px]:grid-cols-3">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-60 flex items-end min-[900px]:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-[var(--radius-sl-lg)] bg-sl-paper p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="sl-h3 text-lg">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="sl-focus flex h-9 w-9 items-center justify-center rounded-full border border-sl-ink/15"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {filterPanel}
            <div className="mt-6 flex gap-3">
              <LightButton onClick={reset} variant="secondary" block>
                Clear all
              </LightButton>
              <LightButton onClick={() => setMobileOpen(false)} variant="dark" block>
                Show {filtered.length} courses
              </LightButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-2.5 font-sl-mono text-[10px] tracking-[0.12em] text-sl-ink/50">
        {label.toUpperCase()}
      </div>
      <div className="flex flex-wrap gap-2 min-[900px]:flex-col min-[900px]:items-start">
        {options.map((o) => (
          <Chip key={o.id} active={active === o.id} onClick={() => onSelect(o.id)}>
            {o.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={lightRoutes.course(course.slug)}
      className="sl-focus group block overflow-hidden rounded-[var(--radius-sl-md)] border bg-white transition-[transform,box-shadow] duration-[var(--sl-dur-med)] ease-[var(--sl-ease)] hover:-translate-y-1.5 hover:shadow-[var(--sl-shadow-card)]"
      style={{ borderColor: "rgba(17,17,17,.08)" }}
    >
      <div className="relative h-36 w-full">
        <Image
          src={course.photo}
          alt=""
          fill
          sizes="(min-width: 1250px) 33vw, (min-width: 560px) 50vw, 100vw"
          className="object-cover"
        />
        {course.status === "placeholder" ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 font-sl-mono text-[9px] tracking-[0.06em] text-sl-ink/70">
            COMING SOON
          </span>
        ) : null}
      </div>
      <div className="p-4.5">
        <div className="mb-1 font-sl-mono text-[10px] tracking-[0.08em] text-sl-ink/45">
          {courseCategories.find((c) => c.id === course.category)?.label.toUpperCase()}
        </div>
        <div className="mb-2.5 text-[15px] font-semibold">{course.title}</div>
        <p className="mb-3 text-[13px] leading-relaxed text-sl-ink/62">{course.blurb}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full px-2 py-1 font-sl-mono text-[9px]" style={{ background: "var(--sl-accent-soft)" }}>
            {modeLabels[course.mode].toUpperCase()}
          </span>
          <span className="rounded-full bg-sl-ink/6 px-2 py-1 font-sl-mono text-[9px]">
            {levelLabels[course.level].toUpperCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}
