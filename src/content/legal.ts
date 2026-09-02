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
 * One template, four instances.
 *
 * No legal obligation, window, period, condition or compliance claim is
 * written here. The design set is explicit: "No legal obligation or claim is
 * written until confirmed by counsel/the business."
 */
function legalSections(token: string): LegalSection[] {
  return [
    { id: "scope", label: "Scope", body: `[${token} — SCOPE.]` },
    { id: "details", label: "Details", body: `[${token} — DETAILED TERMS.]` },
    { id: "your-rights", label: "Your rights", body: `[${token} — RIGHTS AND OPTIONS.]` },
    { id: "contact", label: "Contact", body: `[${token} — HOW TO CONTACT US ABOUT THIS DOCUMENT.]` },
  ];
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: "privacy",
    route: routes.privacy,
    title: "Privacy Policy",
    lastUpdated: "[DATE]",
    intro: "[OPTIONAL INTRO — one paragraph, placeholder.]",
    sections: legalSections("PRIVACY POLICY CONTENT"),
  },
  {
    slug: "terms",
    route: routes.terms,
    title: "Terms & Conditions",
    lastUpdated: "[DATE]",
    intro: "[OPTIONAL INTRO — one paragraph, placeholder.]",
    sections: legalSections("TERMS CONTENT"),
  },
  {
    slug: "refund-policy",
    route: routes.refundPolicy,
    title: "Refund / Cancellation Policy",
    lastUpdated: "[DATE]",
    intro: "[OPTIONAL INTRO — one paragraph, placeholder.]",
    sections: legalSections("REFUND POLICY CONTENT"),
  },
  {
    slug: "accessibility",
    route: routes.accessibility,
    title: "Accessibility",
    lastUpdated: "[DATE]",
    intro: "[OPTIONAL INTRO — one paragraph, placeholder.]",
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
        body: "[KNOWN LIMITATIONS — to be listed once content is complete. This site has not yet been independently audited, and no external conformance certification is claimed.]",
      },
      {
        id: "contact",
        label: "Reporting an issue",
        body: "[ACCESSIBILITY CONTACT ROUTE — placeholder. Reports should reach a named owner with a stated response time.]",
      },
    ],
  },
];

export function legalBySlug(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}
