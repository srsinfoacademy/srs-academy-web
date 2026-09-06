import type { Metadata } from "next";

import { LegalPage } from "@/components/light/LegalPage";
import { legalBySlug } from "@/content/legal";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function LightTermsPage() {
  const doc = legalBySlug("terms")!;
  return <LegalPage doc={doc} />;
}
