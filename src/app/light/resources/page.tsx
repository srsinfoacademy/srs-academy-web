import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { ResourceList } from "@/components/light/ResourceList";
import { resources } from "@/content/resources";

export const metadata: Metadata = { title: "Resources", alternates: { canonical: "/resources" } };

export default function LightResourcesPage() {
  return (
    <>
      <EditorialHero
        kicker="Resources"
        title="Resources"
        intro="Articles, guides and downloads for learners and prospective learners. This section is provisioned and ready — real resources will appear here as SRS Academy publishes them."
      />
      <section className="sl-container pb-20">
        {resources.length === 0 ? (
          <div className="sl-glass flex flex-col items-center gap-3 rounded-[var(--radius-sl-lg)] px-6 py-16 text-center">
            <span className="text-3xl" aria-hidden="true">
              📚
            </span>
            <p className="text-base font-semibold">No resources published yet</p>
            <p className="max-w-100 text-sm text-sl-ink/60">
              Nothing is invented here — this page will list real articles, guides and
              downloads as SRS Academy publishes them.
            </p>
          </div>
        ) : (
          <ResourceList resources={resources} />
        )}
      </section>
    </>
  );
}
