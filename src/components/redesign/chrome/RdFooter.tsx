import Link from "next/link";

import { RdContainer } from "@/components/redesign/RdContainer";
import { RdSocialIcon } from "@/components/redesign/RdSocialIcon";
import { RdLogo } from "@/components/redesign/chrome/RdLogo";
import { PHOTO_CREDITS_PATH } from "@/content/courses/photos";
import { rdFooterNavGroups } from "@/content/redesign-nav";
import { site } from "@/content/site";
import {
  contactHoursSummary,
  contactPhone,
  contactSocialLinks,
  contactTelHref,
  contactWhatsappHref,
  getPublicContact,
} from "@/lib/data/contact";

const linkClass =
  "inline-flex min-h-9 items-center text-[15px] text-rd-inverse-muted underline-offset-4 transition-colors hover:text-rd-inverse-text hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent";

/**
 * Public footer on the inverse surface. Contact facts and socials come from
 * the admin Contact Page (seeded from site.ts). The Student Portal link
 * renders only when its URL is set; Admin / Staff Login goes to the
 * external admin URL when set, otherwise to /admin/login.
 */
export async function RdFooter() {
  const contact = await getPublicContact();
  const phone = contactPhone(contact);
  const tel = contactTelHref(contact);
  const whatsapp = contactWhatsappHref(contact);
  const hours = contactHoursSummary(contact);
  const social = contactSocialLinks(contact);
  const studentHref = site.portals.student.href;
  const adminHref = site.portals.admin.href ?? "/admin/login";
  const year = new Date().getFullYear();

  const groups = rdFooterNavGroups.map((group) =>
    group.heading === "Information" && studentHref
      ? { ...group, links: [...group.links, { label: "Student Portal", href: studentHref }] }
      : group,
  );

  return (
    <footer className="print:hidden bg-rd-inverse pb-7 pt-[clamp(48px,7vw,80px)] font-rd-sans text-rd-inverse-muted">
      <RdContainer>
        <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          <div className="flex flex-col gap-4">
            <RdLogo tone="inverse" />
            <p className="max-w-[34ch] text-[15px] leading-relaxed">{site.organisation.relationship}</p>
            <address className="flex flex-col gap-1.5 text-[15px] not-italic leading-relaxed">
              {contact.address ? <span>{contact.address}</span> : null}
              {phone && tel ? (
                <a href={tel} className={linkClass}>
                  <span className="sr-only">Phone: </span>
                  {phone}
                </a>
              ) : null}
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {phone ?? `+${contact.whatsapp.replace(/\D/g, "")}`}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              ) : null}
              {hours ? <span>{hours}</span> : null}
            </address>
          </div>

          {groups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-rd-inverse-text">
                {group.heading}
              </h2>
              <ul className="mt-3 flex flex-col gap-1">
                {group.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={linkClass}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-rd-inverse-line pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span>
              © {year} {site.copyrightHolder}
            </span>
            {adminHref.startsWith("/") ? (
              <Link href={adminHref} prefetch={false} rel="nofollow" className={`${linkClass} text-[13px]`}>
                {site.portals.admin.label}
              </Link>
            ) : (
              <a href={adminHref} target="_blank" rel="noopener noreferrer nofollow" className={`${linkClass} text-[13px]`}>
                {site.portals.admin.label}
              </a>
            )}
            <a href={PHOTO_CREDITS_PATH} className={`${linkClass} text-[13px]`}>
              Photo credits
            </a>
          </div>
          <ul aria-label="Follow us" className="flex flex-wrap gap-2">
            {social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                  className="inline-flex size-11 items-center justify-center rounded-full border border-rd-inverse-line text-rd-inverse-text transition-colors hover:border-rd-inverse-text focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent"
                >
                  <RdSocialIcon id={item.icon} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </RdContainer>
    </footer>
  );
}
