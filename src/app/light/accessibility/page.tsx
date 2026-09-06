import type { Metadata } from "next";

import { LegalPage } from "@/components/light/LegalPage";
import { legalBySlug } from "@/content/legal";

export const metadata: Metadata = { title: "Accessibility", alternates: { canonical: "/accessibility" } };

export default function LightAccessibilityPage() {
  const doc = legalBySlug("accessibility")!;
  return <LegalPage doc={doc} />;
}
