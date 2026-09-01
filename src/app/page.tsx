import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/ui/Section";
import { IndexLabel } from "@/components/ui/IndexLabel";

/**
 * Phase 1 placeholder.
 *
 * The homepage composition — hero, manifesto, programs explorer, learning
 * journey, statistics, portal teaser and final CTA — is deliberately not
 * built yet. This page exists only so the global foundation can be reviewed
 * in place.
 */
export default function HomePage() {
  return (
    <>
      <PageHero
        variant="editorial"
        eyebrow="Foundation review"
        title="Knowledge OS foundation"
        lead="Phase 1 establishes the design tokens, typography, layout system, accessibility and motion foundations, global header, mobile navigation, footer and page hero architecture. Page content follows after approval."
      />

      <Section spacing="tight" ruled>
        <IndexLabel as="p" node>
          Development placeholder — no page content in Phase 1
        </IndexLabel>
      </Section>
    </>
  );
}
