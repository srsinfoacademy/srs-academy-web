import { Suspense } from "react";

import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdSection } from "@/components/redesign/RdSection";
import { RdEnquiryForm } from "@/components/redesign/enquiry/RdEnquiryForm";
import { enquiryCopy } from "@/content/public-pages";
import { site } from "@/content/site";
import { contactFactsFrom, contactSocialLinks, getPublicContact } from "@/lib/data/contact";
import { getPublicCourses } from "@/lib/data/courses";

/**
 * The global "Tell us what you'd like to learn" section: contact facts on
 * the left, the enquiry form on the right. Anchor: #enquire. Facts come
 * from the admin Contact Page; `showMap` adds its Google Maps embed.
 */
export async function RdEnquirySection({ tone = "plain", showMap = false }: { tone?: "plain" | "muted"; showMap?: boolean }) {
  const [contact, publicCourses] = await Promise.all([getPublicContact(), getPublicCourses()]);
  const courses = publicCourses.map(({ slug, name, code }) => ({ slug, name, code }));
  const facts = contactFactsFrom(contact, site.contact.locationSummary);
  const social = contactSocialLinks(contact);

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
            {facts.map((fact) => (
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
            {social.length ? (
              <div>
                <dt className="text-[13.5px] text-rd-soft">Follow</dt>
                <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {social.map((item) => (
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
            ) : null}
          </dl>
          {showMap && contact.mapEmbedUrl ? (
            <iframe
              title={`Map: ${contact.address}`}
              src={contact.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-8 aspect-[4/3] w-full rounded-[16px] border border-rd-line"
            />
          ) : null}
        </div>

        <div className="relative rounded-[20px] border border-rd-line bg-rd-elevated p-[clamp(20px,3vw,36px)]">
          <Suspense
            fallback={
              <p className="text-rd-body">
                Loading the enquiry form… You can also email{" "}
                <a href={`mailto:${contact.email}`} className="text-rd-link underline">
                  {contact.email}
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
