import type { Metadata } from "next";

import { ContactForm } from "@/components/pages/ContactForm";
import { PageHero } from "@/components/page/PageHero";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: contactPage.intro,
  path: routes.contact,
});

export default function ContactPage() {
  const details = [
    { label: "Address", value: site.contact.address },
    { label: "Email", value: site.contact.email },
    { label: "Phone", value: site.contact.phone },
    { label: "Working hours", value: "[WORKING HOURS]" },
  ];

  return (
    <>
      <PageHero
        variant="information"
        index="08"
        eyebrow={contactPage.kicker}
        title="Contact SRS Academy"
        lead={contactPage.intro}
        breadcrumb={[{ label: "Contact" }]}
      />

      <Container className="pb-[var(--srs-section-loose)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="sr-only-srs">Contact details</h2>

            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {details.map((row) => (
                <div key={row.label} className="flex flex-col gap-1.5">
                  <dt className="type-index">{row.label}</dt>
                  <dd className="type-body-s text-primary">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 flex flex-col gap-8">
              {contactPage.sections.map((section) => (
                <section key={section.num} aria-labelledby={`contact-${section.num}`}>
                  <IndexLabel index={section.num} as="p">
                    {section.heading}
                  </IndexLabel>
                  <h3 id={`contact-${section.num}`} className="type-h4 mt-3">
                    {section.heading}
                  </h3>
                  <p className="type-body-s mt-2">{section.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="type-h3">Send a message</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
