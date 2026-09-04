import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { ContactForm } from "@/components/light/ContactForm";
import { Reveal } from "@/components/light/ui/Reveal";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function LightContactPage() {
  return (
    <>
      <EditorialHero kicker={contactPage.kicker} title={contactPage.title} intro="Reach SRS Academy using the details below, or send a message." />
      <section className="sl-container grid grid-cols-1 gap-12 pb-20 min-[900px]:grid-cols-[1fr_auto]">
        <Reveal className="flex flex-col gap-8">
          <div>
            <div className="mb-2 font-sl-mono text-[10px] tracking-[0.12em] text-sl-ink/45">EMAIL</div>
            <a href={`mailto:${site.contact.email}`} className="sl-focus text-lg font-semibold">
              {site.contact.email}
            </a>
          </div>
          <div>
            <div className="mb-2 font-sl-mono text-[10px] tracking-[0.12em] text-sl-ink/45">PHONE</div>
            <a href={`tel:${site.contact.phone}`} className="sl-focus text-lg font-semibold">
              {site.contact.phone}
            </a>
          </div>
          <div>
            <div className="mb-2 font-sl-mono text-[10px] tracking-[0.12em] text-sl-ink/45">LOCATIONS</div>
            <p className="text-[15px] leading-relaxed text-sl-ink/70">{site.contact.address}</p>
            <p className="mt-1 text-sm text-sl-ink/55">{site.contact.locationSummary}</p>
          </div>
          <div className="flex flex-col gap-6 border-t border-sl-ink/10 pt-6">
            {contactPage.sections.map((s) => (
              <div key={s.num}>
                <div className="mb-1 text-sm font-semibold">{s.heading}</div>
                <p className="text-sm text-sl-ink/55">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
