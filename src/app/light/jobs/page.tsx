import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Jobs & Careers" };

export default function LightJobsPage() {
  return (
    <>
      <EditorialHero
        kicker="Careers"
        title="Jobs at SRS Academy"
        intro="Roles at SRS Academy and SPRS INFOTECH PVT LTD, when open."
      />
      <section className="sl-container pb-20">
        <div className="sl-glass flex flex-col items-center gap-3 rounded-[var(--radius-sl-lg)] px-6 py-16 text-center">
          <span className="text-3xl" aria-hidden="true">
            💼
          </span>
          <p className="text-base font-semibold">No open roles listed right now</p>
          <p className="max-w-100 text-sm text-sl-ink/60">
            No listings are invented here — real openings will appear on this page as
            they become available. In the meantime, reach out at{" "}
            <a href={`mailto:${site.contact.email}`} className="sl-focus underline">
              {site.contact.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
