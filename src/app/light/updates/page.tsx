import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { updateFilters, updates } from "@/content/updates";

export const metadata: Metadata = { title: "Updates" };

export default function LightUpdatesPage() {
  return (
    <>
      <EditorialHero
        kicker="Updates & Announcements"
        title="Updates"
        intro="Official notices from SRS Academy — academic, admissions and policy updates."
      />
      <section className="sl-container pb-20">
        <div className="mb-8 flex flex-wrap gap-2.5">
          {updateFilters.map((f) => (
            <span
              key={f}
              className="rounded-full border border-sl-ink/15 px-4 py-2 text-sm font-medium text-sl-ink/70"
            >
              {f}
            </span>
          ))}
        </div>
        {updates.length === 0 ? (
          <div className="sl-glass flex flex-col items-center gap-3 rounded-[var(--radius-sl-lg)] px-6 py-16 text-center">
            <span className="text-3xl" aria-hidden="true">
              📣
            </span>
            <p className="text-base font-semibold">No notices published yet</p>
            <p className="max-w-100 text-sm text-sl-ink/60">
              Nothing is invented here — real notices will appear as SRS Academy
              publishes them.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
