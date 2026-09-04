"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { SearchField } from "@/components/ui/SearchField";
import { cn } from "@/lib/cn";
import { formatUpdateDate, updateFilters, type Update } from "@/content/updates";
import { routes } from "@/lib/routes";

/**
 * Notice list.
 *
 * The design specifies pagination only past roughly twenty notices, with
 * "load more" sufficient below that — so neither is built while the list is
 * empty. Mobile stacks the date above the title without changing what a row
 * means.
 */
export function UpdatesList({ updates }: { updates: Update[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return updates.filter((update) => {
      if (category !== "All" && update.category !== category) return false;
      if (!q) return true;
      return [update.title, update.summary, update.referenceNumber]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [updates, query, category]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-end">
        <SearchField
          label="Search updates"
          placeholder="[SEARCH UPDATES]"
          value={query}
          onChange={setQuery}
        />
        <FilterChips
          label="Category"
          options={updateFilters}
          value={category}
          onChange={setCategory}
        />
      </div>

      <p className="type-index" aria-live="polite">
        {results.length} {results.length === 1 ? "notice" : "notices"}
      </p>

      {results.length === 0 ? (
        updates.length === 0 ? (
          <EmptyState index="No content yet" title="No notices have been published yet.">
            <p className="type-body-s">
              Announcements will appear here once SRS Academy publishes them.
            </p>
          </EmptyState>
        ) : (
          <EmptyState title="No notices match these filters.">
            <p className="type-body-s">Try another category, or clear the search.</p>
          </EmptyState>
        )
      ) : (
        <Reveal as="ul" className="border-t border-line">
            {results.map((update) => (
              <li key={update.slug} className="border-b border-line">
                <Link
                  href={routes.update(update.slug)}
                  className={cn(
                    "group flex min-h-16 flex-col gap-2 py-5",
                    "sm:flex-row sm:items-baseline sm:gap-6",
                    "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                    "hover:bg-[rgb(242_244_239_/_0.03)]",
                  )}
                >
                  <span className="type-index shrink-0 sm:w-28">
                    {formatUpdateDate(update.date)}
                  </span>

                  <span className="flex-1">
                    <span className="type-h4 block text-balance">{update.title}</span>
                    <span className="type-index mt-1.5 block">
                      {update.category} · REF {update.referenceNumber}
                      {update.attachments?.length
                        ? ` · ${update.attachments.length} attachment${
                            update.attachments.length === 1 ? "" : "s"
                          }`
                        : ""}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="type-index shrink-0 text-lime transition-transform duration-[var(--srs-duration-fast)] ease-standard group-hover:translate-x-[3px]"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
        </Reveal>
      )}
    </div>
  );
}
