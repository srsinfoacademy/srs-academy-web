import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateBySlug, updates } from "@/content/updates";
import { lightRoutes } from "@/lib/light/routes";

export function generateStaticParams() {
  return updates.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/light/updates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const update = updateBySlug(slug);
  if (!update) return { title: "Update" };

  // Updates are one fully shared list (same slugs, same content) on both
  // themes — always safe to canonicalize to the dark URL.
  return { title: update.title, alternates: { canonical: `/updates/${slug}` } };
}

export default async function LightUpdateDetailPage({
  params,
}: PageProps<"/light/updates/[slug]">) {
  const { slug } = await params;
  const update = updateBySlug(slug);
  if (!update) notFound();

  return (
    <div className="sl-container max-w-160 py-16">
      <Link href={lightRoutes.updates} className="sl-focus mb-6 inline-block text-sm font-semibold text-sl-ink/60">
        ← All updates
      </Link>
      <h1 className="sl-h1 mb-4 text-3xl">{update.title}</h1>
      <p className="text-sl-ink/60">{update.summary}</p>
    </div>
  );
}
