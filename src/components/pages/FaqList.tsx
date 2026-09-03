"use client";

import { useMemo, useState } from "react";

import { Disclosure } from "@/components/ui/Disclosure";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { SearchField } from "@/components/ui/SearchField";
import { faqCategories, type FaqEntry } from "@/content/faq";

/**
 * FAQ. Reuses the single-open disclosure shared with the program pages, as
 * the design specifies one accordion component across the site.
 */
export function FaqList({ entries }: { entries: FaqEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (category !== "All" && entry.category !== category) return false;
      if (!q) return true;
      return `${entry.question} ${entry.answer}`.toLowerCase().includes(q);
    });
  }, [entries, query, category]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-end">
        <SearchField
          label="Search questions"
          placeholder="[SEARCH FAQ]"
          value={query}
          onChange={setQuery}
        />
        <FilterChips
          label="Category"
          options={faqCategories}
          value={category}
          onChange={setCategory}
        />
      </div>

      <p className="type-index" aria-live="polite">
        {results.length} {results.length === 1 ? "question" : "questions"}
      </p>

      {results.length === 0 ? (
        <EmptyState title={`No results for "${query || category}".`}>
          <p className="type-body-s">
            Try a different word, or browse by category above.
          </p>
        </EmptyState>
      ) : (
        <Disclosure
          items={results.map((entry, i) => ({
            key: `${entry.category}-${i}`,
            title: entry.question,
            content: (
              <>
                <p className="type-index">{entry.category}</p>
                <p className="type-body-s measure mt-2">{entry.answer}</p>
              </>
            ),
          }))}
        />
      )}
    </div>
  );
}
