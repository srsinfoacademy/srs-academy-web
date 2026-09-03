import { GridBackground } from "@/components/knowledge-os/GridBackground";
import { Wordmark } from "@/components/layout/Wordmark";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { TextLink } from "@/components/ui/TextLink";
import { footerNav } from "@/content/navigation";
import { site } from "@/content/site";

/**
 * Global footer. Server-rendered.
 *
 * Every unresolved business fact is an explicit bracketed placeholder and
 * must be replaced with approved copy before launch.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-site-footer className="relative isolate mt-auto overflow-hidden border-t border-line-hairline bg-surface-1">
      <GridBackground fade="top" size={88} />

      <Container className="relative py-[var(--srs-section)]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex max-w-sm flex-col gap-5">
            <Wordmark />
            <p className="type-body-s text-muted">{site.organisation.relationship}</p>

            <address className="type-body-s flex flex-col gap-1 not-italic text-muted">
              <span>{site.contact.address}</span>
              <span>{site.contact.email}</span>
              <span>{site.contact.phone}</span>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-14">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <IndexLabel as="p" className="mb-4">
                  {group.title}
                </IndexLabel>

                <ul className="-my-1.5 flex flex-col">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <TextLink
                        href={item.href}
                        pending={item.pending}
                        external={item.external}
                        tone="muted"
                        bare
                        className="type-body-s inline-flex min-h-11 items-center"
                      >
                        {item.label}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-index">
            © {year} {site.copyrightHolder}
          </p>
          <p className="type-index">{site.domain}</p>
        </div>
      </Container>
    </footer>
  );
}
