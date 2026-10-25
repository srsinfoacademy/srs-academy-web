import { routes } from "@/lib/routes";
import { publicPhone, site } from "@/content/site";

export type LegalSection = { id: string; label: string; body: string };

export type LegalDocument = {
  slug: string;
  route: string;
  title: string;
  /** Shown under the title. */
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

/**
 * Contact details used across the legal documents below are read from
 * `site.ts` rather than repeated here, so Privacy / Terms / Refund always
 * match the email, phone and address shown on the Contact page.
 */
const CONTACT_EMAIL = site.contact.email;
const CONTACT_ADDRESS = site.contact.address;
const LEGAL_ENTITY = site.organisation.legalName;

/** Phone is omitted while `site.contact.phone` is empty. The rest of the sentence stays. */
function contactSentence(lead: string): string {
  const phone = publicPhone();
  if (phone) {
    return `${lead} at ${CONTACT_EMAIL}, call ${phone}, or write to us at ${CONTACT_ADDRESS}.`;
  }
  return `${lead} at ${CONTACT_EMAIL}, or write to us at ${CONTACT_ADDRESS}.`;
}

const LAST_UPDATED = "25 October 2026";

export const legalDocuments: LegalDocument[] = [
  {
    slug: "privacy",
    route: routes.privacy,
    title: "Privacy Policy",
    lastUpdated: LAST_UPDATED,
    intro:
      "This policy explains what personal information SRS Academy collects through this website, why, and how you can contact us about it.",
    sections: [
      {
        id: "scope",
        label: "Scope",
        body: `This Privacy Policy applies to srstechacademy.com, operated by ${LEGAL_ENTITY} under the name SRS Academy. It covers the information collected when you use this website, including the contact and enquiry form — it does not cover information collected offline, by phone, or through any third-party site this website links to.`,
      },
      {
        id: "information-we-collect",
        label: "Information we collect",
        body: "When you submit the contact or enquiry form, we collect your name, email address, and the message you send us, along with an optional phone number and enquiry subject if you provide them. We also record which page the form was submitted from and the time of submission, to help us respond to the right enquiry. We do not collect any payment or financial information through this website.",
      },
      {
        id: "how-we-use-it",
        label: "How we use your information",
        body: "We use the information you submit to respond to your enquiry, provide information about programs and admissions, and keep a record of our conversation with you. We do not use it for unrelated marketing without your consent, and we do not sell, rent, or trade your personal information to any third party.",
      },
      {
        id: "third-party-services",
        label: "Third-party services",
        body: "We use Resend, a transactional email delivery provider, to send enquiry notifications from this website to SRS Academy's inbox. Resend processes the contents of your submission solely to deliver that email, under its own privacy and security practices, and is not used for marketing, advertising, or analytics.",
      },
      {
        id: "cookies",
        label: "Cookies and local storage",
        body: "This website uses one cookie to remember your light/dark theme preference, and uses your browser's local storage to remember your chosen colour accent on the light theme — neither carries personal information or identifies you. We do not use advertising cookies, and no third-party analytics or tracking script runs on this website.",
      },
      {
        id: "retention",
        label: "Data retention",
        body: "We keep enquiry submissions for as long as reasonably needed to respond to you and maintain a record of admissions-related communication, and we delete them sooner on request. Basic request metadata used only to prevent form abuse (such as submission timing) is held briefly in server memory and is not stored in any database.",
      },
      {
        id: "security",
        label: "Data security",
        body: "We take reasonable technical and organisational measures to protect the information you share with us, including transmitting it over an encrypted connection. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      },
      {
        id: "your-rights",
        label: "Your rights",
        body: `You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it, by emailing ${CONTACT_EMAIL}. We will respond to verified requests within a reasonable time.`,
      },
      {
        id: "children",
        label: "Children's privacy",
        body: "This website is not directed at collecting personal information from children for marketing purposes. Where a program is suitable for a minor, enrollment is handled directly with a parent or guardian rather than through this website's contact form alone.",
      },
      {
        id: "changes",
        label: "Changes to this policy",
        body: "We may update this Privacy Policy from time to time as our practices or services change. The \"Last updated\" date at the top of this page reflects the most recent revision, and continued use of this website after a change means you accept the updated policy.",
      },
      {
        id: "contact",
        label: "Contact us",
        body: contactSentence(
          "For any question about this Privacy Policy or your personal information, contact SRS Academy",
        ),
      },
    ],
  },
  {
    slug: "terms",
    route: routes.terms,
    title: "Terms & Conditions",
    lastUpdated: LAST_UPDATED,
    intro:
      "These terms govern your use of srstechacademy.com and your enquiries and enrollment with SRS Academy.",
    sections: [
      {
        id: "acceptance",
        label: "Acceptance of these terms",
        body: "By using this website or submitting an enquiry through it, you agree to these Terms & Conditions. If you do not agree with them, please do not use this website.",
      },
      {
        id: "about-srs-academy",
        label: "About SRS Academy",
        body: `SRS Academy is the academic and training initiative of ${LEGAL_ENTITY}, offering practical, technology-focused and vocational learning programs online, offline, and in hybrid formats. SRS Academy provides skills-based training and, where stated on a program's page, a certificate of completion — it does not claim to be a degree-granting university or a government-accredited institution unless explicitly stated.`,
      },
      {
        id: "eligibility",
        label: "Using this website",
        body: "This website is intended to help you learn about SRS Academy's programs and to contact us about them. You agree to provide accurate information when you submit the contact or enquiry form, and not to use the form to send spam, unlawful content, or anything intended to disrupt the website or our systems.",
      },
      {
        id: "enrollment",
        label: "Programs, fees, and enrollment",
        body: "Program details shown on this website — including duration, mode, level, and eligibility — are informational and may be refined as programs are finalised. Fees and payment terms are not processed through this website; they are confirmed directly with you, in writing, during the admission process, and those written terms govern your specific enrollment.",
      },
      {
        id: "no-guaranteed-outcomes",
        label: "No guaranteed outcomes",
        body: "Completing a program, where a certificate is offered, does not guarantee employment, a specific skill level, or any particular career outcome. Learning outcomes depend on individual effort, prior experience, and consistent participation.",
      },
      {
        id: "intellectual-property",
        label: "Intellectual property",
        body: `The text, design, graphics, and course descriptions on this website belong to ${LEGAL_ENTITY} unless otherwise credited, and may not be copied, reproduced, or used for a competing commercial purpose without our written permission.`,
      },
      {
        id: "third-party-links",
        label: "Third-party links",
        body: "Where this website links to an external resource or website, that link is provided for convenience. We do not control, and are not responsible for, the content, accuracy, or practices of any third-party site.",
      },
      {
        id: "liability",
        label: "Limitation of liability",
        body: `To the extent permitted by law, ${LEGAL_ENTITY} is not liable for any indirect, incidental, or consequential loss arising from your use of this website or reliance on information published on it. Nothing in these terms limits any liability that cannot be limited under applicable law.`,
      },
      {
        id: "governing-law",
        label: "Governing law",
        body: "These terms are governed by the laws of India, and any dispute arising from them is subject to the courts of Kolkata, West Bengal.",
      },
      {
        id: "changes",
        label: "Changes to these terms",
        body: "We may update these Terms & Conditions from time to time. The \"Last updated\" date at the top of this page reflects the most recent revision, and continued use of this website after a change means you accept the updated terms.",
      },
      {
        id: "contact",
        label: "Contact us",
        body: contactSentence("For any question about these Terms & Conditions, contact SRS Academy"),
      },
    ],
  },
  {
    slug: "refund-policy",
    route: routes.refundPolicy,
    title: "Refund / Cancellation Policy",
    lastUpdated: LAST_UPDATED,
    intro:
      "This policy explains how cancellation and refund requests for SRS Academy programs are generally handled. The specific written confirmation you receive at enrollment always takes precedence over this general policy.",
    sections: [
      {
        id: "scope",
        label: "Scope",
        body: "This policy applies to fees paid directly to SRS Academy for a program. This website does not process payments itself — fees are confirmed with you in writing during the admission process, and that written confirmation is the specific agreement for your enrollment.",
      },
      {
        id: "cancellation-before-start",
        label: "Cancelling before a program starts",
        body: "If you cancel your enrollment at least 3 working days before your program's confirmed start date, you are eligible for a refund of fees paid, less any registration fee, material cost, or third-party cost already incurred on your behalf. Requests made within 3 working days of the start date are considered on a case-by-case basis.",
      },
      {
        id: "cancellation-after-start",
        label: "Cancelling after a program starts",
        body: "Once a program has started, fees already paid are generally non-refundable, as a place has been reserved and instruction has begun. Where exceptional circumstances apply — such as a medical emergency — SRS Academy may, at its discretion, offer a partial refund, a credit toward a future program, or a deferred start date.",
      },
      {
        id: "how-to-request",
        label: "How to request a cancellation or refund",
        body: publicPhone()
          ? `To request a cancellation or refund, email ${CONTACT_EMAIL} or call ${publicPhone()} with your name, the program you enrolled in, and the reason for your request. We will confirm receipt and respond with the next steps.`
          : `To request a cancellation or refund, email ${CONTACT_EMAIL} with your name, the program you enrolled in, and the reason for your request. We will confirm receipt and respond with the next steps.`,
      },
      {
        id: "processing-time",
        label: "Refund processing",
        body: "Approved refunds are processed using the same payment method used for the original payment, where possible, within a reasonable time of approval. Processing times for the funds to reach you may vary depending on your bank or payment provider.",
      },
      {
        id: "program-changes",
        label: "If SRS Academy changes or cancels a program",
        body: "If SRS Academy postpones, reschedules, or cancels a program before it starts, you will be offered a full refund of fees paid for that program, or the option to transfer to another available program or batch.",
      },
      {
        id: "changes",
        label: "Changes to this policy",
        body: "We may update this policy from time to time. The \"Last updated\" date at the top of this page reflects the most recent revision; any enrollment already confirmed in writing continues to follow the terms agreed at the time.",
      },
      {
        id: "contact",
        label: "Contact us",
        body: contactSentence("For any question about cancellations or refunds, contact SRS Academy"),
      },
    ],
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
        body: `If you experience difficulty accessing any part of the website, contact SRS Academy at ${CONTACT_EMAIL} and describe the page or issue you encountered.`,
      },
    ],
  },
];

export function legalBySlug(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}
