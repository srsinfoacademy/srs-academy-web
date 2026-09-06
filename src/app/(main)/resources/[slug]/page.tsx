import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page/PageHero";
import { Container } from "@/components/ui/Container";
import { PrintLink } from "@/components/ui/PrintLink";
import {
  relatedResources,
  resourceBySlug,
  resources,
} from "@/content/resources";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

/**
 * Resource detail.
 *
 * Generates a page only for resources that carry a `body` — a Download-type
 * resource (none exist yet) has nothing to read inline, so it stays a
 * list-only entry until it has real body content or a real file to link to.
 */
export function generateStaticParams() {
  return resources.filter((r) => r.body).map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource) return {};

  return pageMetadata({
    title: resource.title,
    description: resource.summary,
    path: routes.resource(resource.slug),
  });
}

export default async function ResourceDetailPage({
  params,
}: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource || !resource.body) notFound();

  const related = relatedResources(slug);

  return (
    <>
      <PageHero
        variant="information"
        index="07"
        eyebrow="Resource"
        title={resource.title}
        breadcrumb={[{ label: "Resources", href: routes.resources }, { label: resource.title }]}
        meta={[
          { label: "Type", value: resource.type },
          { label: "Category", value: resource.category },
        ]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <article className="measure">
          {resource.body.map((paragraph, i) => (
            <p
              key={i}
              className="type-body mt-5 first:mt-0 leading-[var(--srs-leading-relaxed)]"
            >
              {paragraph}
            </p>
          ))}
        </article>

        <div className="mt-10 print:hidden">
          <PrintLink />
        </div>

        {related.length > 0 ? (
          <section aria-labelledby="related-resources-title" className="mt-16 print:hidden">
            <h2 id="related-resources-title" className="type-h4">
              Related resources
            </h2>
            <ul className="mt-5 border-t border-line-hairline">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-line-hairline">
                  <Link
                    href={routes.resource(item.slug)}
                    className="flex min-h-16 flex-col gap-1.5 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="type-index shrink-0 sm:w-28">{item.type}</span>
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
