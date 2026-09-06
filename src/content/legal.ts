import { routes } from "@/lib/routes";

export type LegalSection = { id: string; label: string; body: string };

export type LegalDocument = {
  slug: string;
  route: string;
  title: string;
  /** Shown under the title; unresolved until the document is published. */
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

/**
 * One template, three instances (Privacy, Terms, Refund Policy — Accessibility
 * has its own real structure below).
 *
 * No legal obligation, window, period, condition or compliance claim is
 * written here. The design set is explicit: "No legal obligation or claim is
 * written until confirmed by counsel/the business." Every section shows the
 * same honest, safe-for-public-display holding message rather than a raw
 * bracket — this is NOT the finished policy, only an interim notice.
 */
const POLICY_PENDING_NOTICE =
  "Policy details are being finalized. Please contact SRS Academy for current information.";

function legalSections(): LegalSection[] {
  return [
    { id: "scope", label: "Scope", body: POLICY_PENDING_NOTICE },
    { id: "details", label: "Details", body: POLICY_PENDING_NOTICE },
    { id: "your-rights", label: "Your rights", body: POLICY_PENDING_NOTICE },
    { id: "contact", label: "Contact", body: POLICY_PENDING_NOTICE },
  ];
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: "privacy",
    route: routes.privacy,
    title: "Privacy Policy",
    lastUpdated: "Not yet published",
    intro: POLICY_PENDING_NOTICE,
    sections: legalSections(),
  },
  {
    slug: "terms",
    route: routes.terms,
    title: "Terms & Conditions",
    lastUpdated: "Not yet published",
    intro: POLICY_PENDING_NOTICE,
    sections: legalSections(),
  },
  {
    slug: "refund-policy",
    route: routes.refundPolicy,
    title: "Refund / Cancellation Policy",
    lastUpdated: "Not yet published",
    intro: POLICY_PENDING_NOTICE,
    sections: legalSections(),
  },
  {
    slug: "accessibility",
    route: routes.accessibility,
    title: "Accessibility",
    /** This document has real content below, unlike the other three — still no fixed date has been confirmed for it. */
    lastUpdated: "Ongoing",
    /*
     * The accessibility statement is the one legal-template instance with a
     * real structure, because the site's own conformance work is known. It
     * still claims nothing that has not been verified: the site targets
     * WCAG 2.2 AA and has not been independently audited, and saying so is
     * more useful than an unverified compliance claim.
     */
    sections: [
      {
        id: "commitment",
        label: "Our commitment",
        body: "SRS Academy aims to meet WCAG 2.2 Level AA across this website. Accessibility is treated as a build requirement rather than a later correction.",
      },
      {
        id: "features",
        label: "Supported features",
        body: "Semantic landmarks and headings, a skip-to-content link as the first tab stop, visible keyboard focus throughout, keyboard-operable navigation and disclosures, text alternatives for meaningful graphics, minimum target sizes, and full support for reduced-motion preferences.",
      },
      {
        id: "limitations",
        label: "Known limitations",
        body: "We continue to review the website for accessibility issues and improve areas where barriers are identified.",
      },
      {
        id: "contact",
        label: "Reporting an issue",
        body: "If you experience difficulty accessing any part of the website, contact SRS Academy at srsinfotechacademy@gmail.com and describe the page or issue you encountered.",
      },
    ],
  },
];

export function legalBySlug(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}
