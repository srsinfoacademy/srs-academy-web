"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { resourceCategories, type Resource } from "@/content/resources";
import { lightRoutes } from "@/lib/light/routes";

/** Light-theme resource card grid, filterable by category — mirrors the FAQ accordion's chip pattern. */
export function ResourceList({ resources }: { resources: Resource[] }) {
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(
    () => resources.filter((r) => category === "All" || r.category === category),
    [resources, category],
  );

  const categoriesInUse = resourceCategories.filter(
    (c) => c === "All" || resources.some((r) => r.category === c),
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2.5" role="tablist" aria-label="Resource category">
        {categoriesInUse.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`sl-focus rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[var(--sl-dur-fast)] ${
              category === c
                ? "bg-sl-ink text-sl-paper"
                : "border border-sl-ink/15 bg-white text-sl-ink hover:border-sl-ink/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2">
        {filtered.map((resource) => {
          const isDownload = resource.type === "Download";
          const card = (
            <div className="sl-glass flex h-full flex-col gap-2.5 rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-sl-ink/50">
                {resource.type}
              </span>
              <h3 className="text-[17px] font-semibold text-sl-ink">{resource.title}</h3>
              <p className="text-sm leading-relaxed text-sl-ink/68">{resource.summary}</p>
              <span className="mt-auto pt-2 text-sm font-semibold text-sl-ink">
                {isDownload ? "Download ↓" : "Read →"}
              </span>
            </div>
          );

          return resource.body ? (
            <Link key={resource.slug} href={lightRoutes.resource(resource.slug)} className="sl-focus block">
              {card}
            </Link>
          ) : (
            <div key={resource.slug}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
