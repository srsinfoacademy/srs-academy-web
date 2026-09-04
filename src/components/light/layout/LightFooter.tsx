import Link from "next/link";

import { site } from "@/content/site";
import { lightRoutes } from "@/lib/light/routes";

const footerCols = [
  {
    title: "LEARNING",
    links: [
      { label: "All Courses", href: lightRoutes.courses },
      { label: "Corporate Learning", href: lightRoutes.corporateLearning },
      { label: "Creative & Vocational", href: lightRoutes.creativeVocational },
    ],
  },
  {
    title: "ADMISSIONS",
    links: [
      { label: "How to Join", href: lightRoutes.admissions },
      { label: "Talk to an Advisor", href: lightRoutes.contact },
      { label: "FAQ", href: lightRoutes.faq },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: lightRoutes.about },
      { label: "Life at SRS", href: lightRoutes.gallery },
      { label: "Jobs", href: lightRoutes.jobs },
      { label: "Contact", href: lightRoutes.contact },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", href: lightRoutes.privacy },
      { label: "Terms & Conditions", href: lightRoutes.terms },
      { label: "Refund Policy", href: lightRoutes.refundPolicy },
      { label: "Accessibility", href: lightRoutes.accessibility },
    ],
  },
];

/** The single sitewide `/light` footer — used unchanged on every page. */
export function LightFooter() {
  return (
    <footer className="mt-auto bg-sl-ink text-[#f2f4ef]">
      <div className="sl-container grid grid-cols-1 gap-10 py-16 min-[900px]:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-sl-lime" aria-hidden="true" />
            <span className="font-sl-display text-xl font-bold tracking-tight">SRS Academy</span>
          </div>
          <p className="max-w-[30ch] text-sm leading-relaxed text-white/60">
            A multi-skill academy for every starting point and every ambition.
          </p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <div className="font-sl-mono text-[10px] tracking-[0.16em] text-sl-lime">{col.title}</div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="sl-focus text-sm text-white/62 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="sl-container flex flex-wrap items-center justify-between gap-3 border-t border-white/8 py-5">
        <span className="font-sl-mono text-[10px] text-white/40">
          © {new Date().getFullYear()} {site.name.toUpperCase()} · LIGHT THEME PREVIEW
        </span>
        <span className="flex flex-wrap gap-4 font-sl-mono text-[10px] text-white/40">
          <Link href={lightRoutes.privacy} className="sl-focus hover:text-white/70">
            PRIVACY
          </Link>
          <Link href={lightRoutes.terms} className="sl-focus hover:text-white/70">
            TERMS
          </Link>
          <Link href={lightRoutes.refundPolicy} className="sl-focus hover:text-white/70">
            REFUND POLICY
          </Link>
          <Link href={lightRoutes.accessibility} className="sl-focus hover:text-white/70">
            ACCESSIBILITY
          </Link>
        </span>
      </div>
    </footer>
  );
}
