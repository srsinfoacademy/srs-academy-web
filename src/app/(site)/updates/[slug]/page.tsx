import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RdContainer } from "@/components/redesign/RdContainer";
import { formatUpdateDate, updateBySlug, updates } from "@/content/updates";
import { pageMetadata } from "@/lib/metadata";

/** No pages are generated until real updates exist in updates.ts. */
export function generateStaticParams() {
  return updates.map((update) => ({ slug: update.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/updates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const update = updateBySlug(slug);
  if (!update) return {};
  return pageMetadata({ title: update.title, description: update.summary, path: `/updates/${update.slug}` });
}

export default async function UpdatePage({ params }: PageProps<"/updates/[slug]">) {
  const { slug } = await params;
  const update = updateBySlug(slug);
  if (!update) notFound();

  return (
    <article className="bg-rd-bg py-[clamp(40px,6vw,80px)]">
      <RdContainer width="prose">
        <Link href="/updates" className="text-[15px] text-rd-link hover:text-rd-accent">
          ← All updates
        </Link>
        <p className="mt-8 text-[14.5px] text-rd-soft">
          <time dateTime={update.date}>{formatUpdateDate(update.date)}</time> · {update.category} · {update.referenceNumber}
        </p>
        <h1 className="mt-3 font-rd-display text-[clamp(34px,4.4vw,52px)] font-medium leading-[1.06] text-rd-ink">
          {update.title}
        </h1>
        <div className="mt-8 flex flex-col gap-5">
          {update.body.map((paragraph) => (
            <p key={paragraph} className="text-[17px] leading-[1.75] text-rd-body">
              {paragraph}
            </p>
          ))}
        </div>
      </RdContainer>
    </article>
  );
}
