import Link from "next/link";

import { RdContainer } from "@/components/redesign/RdContainer";
import { RdSocialIcon } from "@/components/redesign/RdSocialIcon";
import { RdLogo } from "@/components/redesign/chrome/RdLogo";
import { rdFooterNavGroups } from "@/content/redesign-nav";
import { hoursSummary, publicPhone, site, telHref, whatsappHref } from "@/content/site";

const linkClass =
  "inline-flex min-h-9 items-center text-[15px] text-rd-inverse-muted underline-offset-4 transition-colors hover:text-rd-inverse-text hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rd-accent";

/**
 * Public footer on the inverse surface. Facts come from site.ts only.
 * The Student Portal and Admin links render only when their URLs are set.
 */
export function RdFooter() {
  const phone = publicPhone();
  const tel = telHref();
  const whatsapp = whatsappHref();
  const studentHref = site.portals.student.href;
  const adminHref = site.portals.admin.href;
  const year = new Date().getFullYear();

  const groups = rdFooterNavGroups.map((group) =>
    group.heading === "Information" && studentHref
      ? { ...group, links: [...group.links, { label: "Student Portal", href: studentHref }] }
      : group,
  );

  return (
    <footer className="bg-rd-inverse pb-7 pt-[clamp(48px,7vw,80px)] font-rd-sans text-rd-inverse-muted">
      <RdContainer>
        <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
          <div className="flex flex-col gap-4">
            <RdLogo tone="inverse" />
            <p className="max-w-[34ch] text-[15px] leading-relaxed">{site.organisation.relationship}</p>
            <address className="flex flex-col gap-1.5 text-[15px] not-italic leading-relaxed">
              <span>{site.contact.address}</span>
              {phone && tel ? (
                <a href={tel} className={linkClass}>
                  <span className="sr-only">Phone: </span>
                  {phone}
                </a>
              ) : null}
              {phone && whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {phone}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              <a href={`mailto:${site.contact.email}`} className={linkClass}>
                {site.contact.email}
              </a>
              <span>{hoursSummary()}</span>
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
            {adminHref ? (
              <a href={adminHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {site.portals.admin.label}
              </a>
            ) : null}
          </div>
          <ul aria-label="Follow us" className="flex flex-wrap gap-2">
            {site.social.map((item) => (
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
