import type { Metadata } from "next";

import { LegalPage } from "@/components/light/LegalPage";
import { legalBySlug } from "@/content/legal";

export const metadata: Metadata = { title: "Refund Policy" };

export default function LightRefundPolicyPage() {
  const doc = legalBySlug("refund-policy")!;
  return <LegalPage doc={doc} />;
}
