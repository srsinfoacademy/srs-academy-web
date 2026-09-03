import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page/PageHero";
import { Container } from "@/components/ui/Container";
import { PrintLink } from "@/components/ui/PrintLink";
import { cn } from "@/lib/cn";
import {
  formatUpdateDate,
  relatedUpdates,
  updateBySlug,
  updates,
} from "@/content/updates";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

/**
 * Update detail.
 *
 * Generates no pages while `updates` is empty, which is the design's stated
 * position: notices ship empty until real ones exist. The template is
 * complete and activates as soon as a notice is added.
 */
export function generateStaticParams() {
  return updates.map((update) => ({ slug: update.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/updates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const update = updateBySlug(slug);
  if (!update) return {};

  return pageMetadata({
    title: update.title,
    description: update.summary,
    path: routes.update(update.slug),
  });
}

export default async function UpdateDetailPage({
  params,
}: PageProps<"/updates/[slug]">) {
  const { slug } = await params;
  const update = updateBySlug(slug);
  if (!update) notFound();

  const related = relatedUpdates(slug);

  return (
    <>
      <PageHero
        variant="information"
        index="06"
        eyebrow="Update"
        title={update.title}
        breadcrumb={[{ label: "Updates", href: routes.updates }, { label: update.title }]}
        meta={[
          { label: "Date", value: formatUpdateDate(update.date) },
          { label: "Category", value: update.category },
          { label: "Reference", value: update.referenceNumber },
        ]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <article className="measure">
          {update.body.map((paragraph, i) => (
            <p
              key={i}
              className="type-body mt-5 first:mt-0 leading-[var(--srs-leading-relaxed)]"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {update.attachments?.length ? (
          <section aria-labelledby="attachments-title" className="mt-12">
            <h2 id="attachments-title" className="type-h4">
              Attachments
            </h2>
            <ul className="mt-5 border-t border-line-hairline">
              {update.attachments.map((file) => (
                <li
                  key={file.name}
                  className={cn(
                    "flex min-h-11 flex-wrap items-center justify-between gap-4",
                    "border-b border-line-hairline py-3",
                  )}
                >
                  <span className="type-body-s text-primary">{file.name}</span>
                  <span className="type-index">{file.note}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 print:hidden">
          <PrintLink />
        </div>

        {related.length > 0 ? (
          <section aria-labelledby="related-updates-title" className="mt-16 print:hidden">
            <h2 id="related-updates-title" className="type-h4">
              Related updates
            </h2>
            <ul className="mt-5 border-t border-line-hairline">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-line-hairline">
                  <Link
                    href={routes.update(item.slug)}
                    className="flex min-h-16 flex-col gap-1.5 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="type-index shrink-0 sm:w-28">
                      {formatUpdateDate(item.date)}
                    </span>
                    <span className="type-body-s flex-1 text-primary">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
