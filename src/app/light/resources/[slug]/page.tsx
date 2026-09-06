import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { resourceBySlug, resources } from "@/content/resources";
import { lightRoutes } from "@/lib/light/routes";

export function generateStaticParams() {
  return resources.filter((r) => r.body).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/light/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  return { title: resource ? resource.title : "Resource" };
}

export default async function LightResourceDetailPage({
  params,
}: PageProps<"/light/resources/[slug]">) {
  const { slug } = await params;
  const resource = resourceBySlug(slug);
  if (!resource || !resource.body) notFound();

  return (
    <div className="sl-container max-w-160 py-16">
      <Link href={lightRoutes.resources} className="sl-focus mb-6 inline-block text-sm font-semibold text-sl-ink/60">
        ← All resources
      </Link>
      <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.08em] text-sl-ink/50">
        {resource.type} · {resource.category}
      </span>
      <h1 className="sl-h1 mb-4 text-3xl">{resource.title}</h1>
      <div className="flex flex-col gap-4">
        {resource.body.map((paragraph, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-sl-ink/72">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
