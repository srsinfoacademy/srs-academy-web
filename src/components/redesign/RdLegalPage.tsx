import Link from "next/link";

import { RdContainer } from "@/components/redesign/RdContainer";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { legalDocuments, type LegalDocument } from "@/content/legal";
import { cn } from "@/lib/cn";

/**
 * One template for Privacy, Terms, Refund and Accessibility. Restyles the
 * approved text in legal.ts; it never rewrites it.
 */
export function RdLegalPage({ document }: { document: LegalDocument }) {
  return (
    <div className="bg-rd-bg py-[clamp(40px,6vw,80px)]">
      <RdContainer width="prose">
        <nav aria-label="Policies">
          <ul className="flex flex-wrap gap-2">
            {legalDocuments.map((doc) => {
              const active = doc.slug === document.slug;
              return (
                <li key={doc.slug}>
                  <Link
                    href={doc.route}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-10 items-center rounded-full border px-4 text-[14.5px] font-medium transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent",
                      active
                        ? "border-rd-inverse bg-rd-inverse text-rd-inverse-text"
                        : "border-rd-line-strong bg-rd-elevated text-rd-ink hover:border-rd-ink",
                    )}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <RdEyebrow className="mt-10">Policies</RdEyebrow>
        <h1 className="mt-3 font-rd-display text-[clamp(34px,4.4vw,52px)] font-medium leading-[1.06] tracking-[-0.025em] text-rd-ink">
          {document.title}
        </h1>
        <p className="mt-3 text-[15px] text-rd-soft">Last updated: {document.lastUpdated}</p>
        {document.intro ? (
          <p className="mt-6 text-[18px] leading-[1.65] text-rd-body">{document.intro}</p>
        ) : null}

        <div className="mt-10 flex flex-col">
          {document.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-24 border-t border-rd-line py-8"
            >
              <h2 id={`${section.id}-title`} className="font-rd-display text-[clamp(22px,2.2vw,27px)] font-medium text-rd-ink">
                {section.label}
              </h2>
              <p className="mt-3 text-[16.5px] leading-[1.7] text-rd-body">{section.body}</p>
            </section>
          ))}
        </div>
      </RdContainer>
    </div>
  );
}
