import type { Metadata } from "next";
import Link from "next/link";

import { RdButton } from "@/components/redesign/RdButton";
import { RdDashedPanel } from "@/components/redesign/RdDashedPanel";
import { RdPageHero } from "@/components/redesign/RdPageHero";
import { RdSection } from "@/components/redesign/RdSection";
import { updatesCopy } from "@/content/public-pages";
import { enquireHref } from "@/content/redesign-nav";
import { formatUpdateDate, updates } from "@/content/updates";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({ title: "Updates", description: updatesCopy.intro, path: "/updates" });

export default function UpdatesPage() {
  return (
    <>
      <RdPageHero eyebrow={updatesCopy.eyebrow} title={updatesCopy.title} intro={updatesCopy.intro} />
      <RdSection labelledBy="updates-list">
        <h2 id="updates-list" className="sr-only">
          Published updates
        </h2>
        {updates.length ? (
          <ul className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))]">
            {updates.map((update) => (
              <li key={update.slug} className="rounded-[16px] border border-rd-line bg-rd-elevated p-6">
                <p className="text-[14px] text-rd-soft">
                  <time dateTime={update.date}>{formatUpdateDate(update.date)}</time> · {update.category}
                </p>
                <h3 className="mt-2 font-rd-display text-[24px] font-medium text-rd-ink">
                  <Link href={`/updates/${update.slug}`} className="hover:text-rd-accent">
                    {update.title}
                  </Link>
                </h3>
                <p className="mt-2 text-[15.5px] leading-[1.6] text-rd-body">{update.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <RdDashedPanel className="max-w-[720px]">
            <p className="font-rd-display text-[clamp(24px,2.4vw,30px)] font-medium text-rd-ink">{updatesCopy.emptyTitle}</p>
            <p className="mt-2 text-[16px] leading-[1.6] text-rd-body">{updatesCopy.emptyBody}</p>
            <RdButton href={enquireHref()} variant="accent" className="mt-6">
              Enquire Now
            </RdButton>
          </RdDashedPanel>
        )}
      </RdSection>
    </>
  );
}
