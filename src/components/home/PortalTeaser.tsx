import { Button } from "@/components/ui/Button";
import { PortalLayer, PortalLayers } from "@/components/home/PortalLayers";
import { Reveal } from "@/components/motion/Reveal";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { Section } from "@/components/ui/Section";
import { portalTeaser } from "@/content/home";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Student Portal teaser — the only violet-led section on the page.
 *
 * Violet marks "this is the other product". It is used for depth and glow
 * only, never for type: #7C5CFF fails contrast for text, so the text-safe
 * #B9A6FF is used wherever violet has to be read.
 *
 * A teaser and a link. No portal UI, no dashboard, no student data.
 *
 * Depth is composition — three z-steps at 12px offsets, collapsing to two on
 * mobile — so it holds still under reduced motion. The violet glow drops on
 * small screens, where a full-screen repaint is expensive on low-end Android.
 */
export function PortalTeaser() {
  const portal = site.portals.student;

  return (
    <Section spacing="loose" ruled aria-labelledby="portal-title">
      <Reveal as="div" className="grid items-center gap-x-10 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <IndexLabel index={portalTeaser.index} as="p">
            {portalTeaser.eyebrow}
          </IndexLabel>

          <h2 id="portal-title" className="type-h1 mt-8">
            {portalTeaser.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="type-body-l mt-8 max-w-[46ch]">{portalTeaser.lead}</p>
          <p className="type-body-s mt-3 text-muted">{portalTeaser.copyPending}</p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {portalTeaser.chips.map((chip) => (
              <li
                key={chip}
                className="type-label rounded-[var(--srs-radius-sm)] border border-[rgb(185_166_255_/_0.28)] px-3 py-1.5 text-[var(--srs-violet-text)]"
              >
                {chip}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            {portal.href ? (
              <Button href={portal.href} external size="md">
                {portalTeaser.cta}
              </Button>
            ) : (
              <Button pending={portal.pending} size="md">
                {portalTeaser.cta}
              </Button>
            )}
          </div>
        </div>

        {/* Conceptual layers — not a dashboard. Three z-steps, 12px offsets. */}
        <div className="lg:col-span-6">
          <PortalLayers>
            <PortalLayer
              depth={0.6}
              className={cn(
                "absolute inset-0 rounded-[var(--srs-radius-xl)] blur-3xl",
                "bg-[rgb(124_92_255_/_0.12)] md:bg-[rgb(124_92_255_/_0.16)]",
              )}
            />
            {[0, 1, 2].map((layer) => (
              <PortalLayer
                key={layer}
                depth={1 + layer}
                className={cn(
                  "absolute inset-x-0 rounded-[var(--srs-radius-xl)] border",
                  "border-[rgb(185_166_255_/_0.2)] bg-surface-elevated",
                  // Three z-steps from md; the middle layer drops on mobile.
                  layer === 1 && "hidden md:block",
                )}
                style={{
                  top: `${layer * 12}px`,
                  bottom: `${(2 - layer) * 12}px`,
                  left: `${layer * 12}px`,
                  right: `${(2 - layer) * 12}px`,
                }}
              />
            ))}
          </PortalLayers>
        </div>
      </Reveal>
    </Section>
  );
}
