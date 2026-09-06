import type { Metadata } from "next";

import { LegalPage } from "@/components/light/LegalPage";
import { legalBySlug } from "@/content/legal";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function LightPrivacyPage() {
  const doc = legalBySlug("privacy")!;
  return <LegalPage doc={doc} />;
}
