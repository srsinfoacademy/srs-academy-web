"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { SearchField } from "@/components/ui/SearchField";
import { cn } from "@/lib/cn";
import { resourceCategories, type Resource } from "@/content/resources";

/**
 * Resource list. Downloads carry a distinct action label and the violet
 * accent the design reserves for them; articles and guides read through.
 */
export function ResourcesList({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((resource) => {
      if (category !== "All" && resource.category !== category) return false;
      if (!q) return true;
      return [resource.title, resource.summary, resource.type]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [resources, query, category]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-end">
        <SearchField
          label="Search resources"
          placeholder="[SEARCH RESOURCES]"
          value={query}
          onChange={setQuery}
        />
        <FilterChips
          label="Category"
          options={resourceCategories}
          value={category}
          onChange={setCategory}
        />
      </div>

      <p className="type-index" aria-live="polite">
        {results.length} {results.length === 1 ? "resource" : "resources"}
      </p>

      {results.length === 0 ? (
        resources.length === 0 ? (
          <EmptyState index="No content yet" title="No resources have been published yet.">
            <p className="type-body-s">
              Articles, guides and downloads will appear here once they are available.
            </p>
          </EmptyState>
        ) : (
          <EmptyState title="No resources match this filter yet.">
            <p className="type-body-s">Try another category, or clear the search.</p>
          </EmptyState>
        )
      ) : (
        <ul className="border-t border-line">
          {results.map((resource) => {
            const isDownload = resource.type === "Download";

            return (
              <li
                key={resource.slug}
                className={cn(
                  "flex min-h-16 flex-col gap-2 border-b border-line py-5",
                  "sm:flex-row sm:items-baseline sm:gap-6",
                )}
              >
                <span className="type-index shrink-0 sm:w-28">{resource.type}</span>
                <span className="flex-1">
                  <span className="type-h4 block text-balance">{resource.title}</span>
                  <span className="type-body-s mt-1.5 block">{resource.summary}</span>
                </span>
                <span
                  className={cn(
                    "type-index shrink-0",
                    isDownload ? "text-[var(--srs-violet-text)]" : "text-lime",
                  )}
                >
                  {isDownload ? "Download ↓" : "Read →"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
