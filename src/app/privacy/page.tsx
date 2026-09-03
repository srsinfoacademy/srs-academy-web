import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/pages/LegalPage";
import { legalBySlug } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

const document = legalBySlug("privacy");

export const metadata: Metadata = document
  ? pageMetadata({
      title: document.title,
      description: `${document.title} for SRS Academy.`,
      path: document.route,
    })
  : {};

export default function Page() {
  if (!document) notFound();
  return <LegalPage document={document} />;
}
