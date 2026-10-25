import type { Metadata } from "next";
import Link from "next/link";

import { RdButton } from "@/components/redesign/RdButton";
import { RdDashedPanel } from "@/components/redesign/RdDashedPanel";
import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdPill } from "@/components/redesign/RdPill";
import { RdSection } from "@/components/redesign/RdSection";
import { resourcesCopy } from "@/content/public-pages";
import { resources } from "@/content/resources";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({ title: "Resources", description: resourcesCopy.intro, path: "/resources" });

export default function ResourcesPage() {
  const published = resources.filter((resource) => resource.body?.length);

  return (
    <>
      <RdPageHero eyebrow={resourcesCopy.eyebrow} title={resourcesCopy.title} intro={resourcesCopy.intro} />
      <RdSection labelledBy="resources-list">
        <h2 id="resources-list" className="sr-only">
          Articles and guides
        </h2>
        {published.length ? (
          <ul data-reveal="stagger" className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))]">
            {published.map((resource) => (
              <li
                key={resource.slug}
                className="flex flex-col rounded-[16px] border border-rd-line bg-rd-elevated p-6 rd-card"
              >
                <RdPill className="self-start">{resource.type}</RdPill>
                <h3 className="mt-4 font-rd-display text-[clamp(22px,2vw,25px)] font-medium leading-tight text-rd-ink">
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="hover:text-rd-accent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
                  >
                    {resource.title}
                  </Link>
                </h3>
                <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{resource.summary}</p>
                <span aria-hidden="true" className="mt-auto pt-4 text-[15px] font-semibold text-rd-link">
                  Read {resource.type.toLowerCase()} →
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <RdDashedPanel>
            <p className="font-rd-display text-[26px] text-rd-ink">No public resources published yet</p>
          </RdDashedPanel>
        )}
        <div className="mt-12 flex flex-wrap gap-3">
          <RdButton href="/courses" variant="accent">
            Explore courses
          </RdButton>
          <RdButton href="/contact" variant="secondary">
            Contact us
          </RdButton>
        </div>
      </RdSection>
    </>
  );
}
