import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdPill } from "@/components/redesign/RdPill";
import { relatedResources, resourceBySlug, resources } from "@/content/resources";
import { pageMetadata } from "@/lib/metadata";

/** Only resources with a body have a readable page. */
export function generateStaticParams() {
  return resources.filter((resource) => resource.body?.length).map((resource) => ({ slug: resource.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource) return {};
  return pageMetadata({ title: resource.title, description: resource.summary, path: `/resources/${resource.slug}` });
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource?.body?.length) notFound();
  const related = relatedResources(resource.slug).filter((item) => item.body?.length);

  return (
    <div className="bg-rd-bg py-[clamp(40px,6vw,80px)]">
      <RdContainer>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-x-2 text-[14.5px] text-rd-soft">
            <li>
              <Link href="/" className="text-rd-link hover:text-rd-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/resources" className="text-rd-link hover:text-rd-accent">
                Resources
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-rd-ink">
              {resource.title}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <article className="max-w-[72ch]">
            <RdPill>{resource.type}</RdPill>
            <h1 className="mt-4 font-rd-display text-[clamp(34px,4.4vw,52px)] font-medium leading-[1.06] tracking-[-0.025em] text-rd-ink">
              {resource.title}
            </h1>
            <p className="mt-5 text-[19px] leading-[1.6] text-rd-body">{resource.summary}</p>
            <div className="mt-8 flex flex-col gap-5 border-t border-rd-line pt-8">
              {resource.body.map((paragraph) => (
                <p key={paragraph} className="text-[17px] leading-[1.75] text-rd-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside aria-label="Next steps" className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[18px] border border-rd-line bg-rd-elevated p-6">
              <p className="font-rd-display text-[23px] font-medium text-rd-ink">Ready to choose a course?</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <RdButton href="/courses" variant="primary">
                  Explore courses
                </RdButton>
                <RdButton href="/contact#enquire" variant="accent">
                  Enquire Now
                </RdButton>
              </div>
            </div>
            {related.length ? (
              <section aria-labelledby="related-resources">
                <h2 id="related-resources" className="font-rd-display text-[23px] font-medium text-rd-ink">
                  More resources
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/resources/${item.slug}`}
                        className="text-[16px] text-rd-link underline underline-offset-4 hover:text-rd-accent"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </RdContainer>
    </div>
  );
}
