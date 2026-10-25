import { Suspense } from "react";

import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdSection } from "@/components/redesign/RdSection";
import { RdEnquiryForm } from "@/components/redesign/enquiry/RdEnquiryForm";
import { getAllCourses } from "@/content/courses";
import { enquiryCopy } from "@/content/public-pages";
import { contactFacts, site } from "@/content/site";

/**
 * The global "Tell us what you'd like to learn" section: contact facts on
 * the left, the enquiry form on the right. Anchor: #enquire.
 */
export function RdEnquirySection({ tone = "plain" }: { tone?: "plain" | "muted" }) {
  const courses = getAllCourses().map(({ slug, name, code }) => ({ slug, name, code }));

  return (
    <RdSection id="enquire" tone={tone} labelledBy="enquire-title" className="scroll-mt-20">
      <div data-reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <RdEyebrow>{enquiryCopy.eyebrow}</RdEyebrow>
          <h2
            id="enquire-title"
            className="mt-3 font-rd-display text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-rd-ink"
          >
            {enquiryCopy.title}
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-rd-body">{enquiryCopy.intro}</p>
          <dl className="mt-8 flex flex-col gap-5 border-t border-rd-line pt-6">
            {contactFacts().map((fact) => (
              <div key={fact.label}>
                <dt className="text-[13.5px] text-rd-soft">{fact.label}</dt>
                <dd className="mt-1 text-[16.5px] text-rd-ink">
                  {fact.href ? (
                    <a
                      href={fact.href}
                      {...(fact.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-rd-link underline underline-offset-4 hover:text-rd-accent"
                    >
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
            <div>
              <dt className="text-[13.5px] text-rd-soft">Follow</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {site.social.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center text-[16px] text-rd-link underline underline-offset-4 hover:text-rd-accent"
                  >
                    {item.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative rounded-[20px] border border-rd-line bg-rd-elevated p-[clamp(20px,3vw,36px)]">
          <Suspense
            fallback={
              <p className="text-rd-body">
                Loading the enquiry form… You can also email{" "}
                <a href={`mailto:${site.contact.email}`} className="text-rd-link underline">
                  {site.contact.email}
                </a>
                .
              </p>
            }
          >
            <RdEnquiryForm courses={courses} formats={enquiryCopy.formats} consent={enquiryCopy.consent} />
          </Suspense>
        </div>
      </div>
    </RdSection>
  );
}
