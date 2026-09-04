import type { CSSProperties } from "react";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { finalCta, knowledgeNodes } from "@/content/home";
import { routes } from "@/lib/routes";

/**
 * Final CTA — the system converges.
 *
 * Edges draw from the five nodes toward a single point behind the headline,
 * closing the loop the hero opened. Composed static-first: the converged
 * geometry is the design, so the reduced-motion rendering reads as finished
 * rather than unfinished. Nothing crosses the headline's measure.
 *
 * This section leads directly into the global footer and deliberately
 * duplicates none of its content.
 */
export function FinalCta() {
  // Square box keeps the SVG scaling uniform, so the dashed draw-on renders
  // as continuous edges rather than fragments.
  const convergence = { x: 50, y: 50 };

  return (
    <section
      aria-labelledby="final-cta-title"
      className="rule-top relative isolate overflow-hidden py-[var(--srs-section-loose)]"
    >
      {/*
        Timed on first entry into the viewport (Reveal below), not on page
        mount — the section is well below the fold, so a mount-timed sequence
        would have already finished playing by the time it scrolls into view.
      */}
      <Reveal as="div" className="kos-gated pointer-events-none absolute inset-0">
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
            className={cn(
              "absolute left-1/2 top-1/2 aspect-square h-full -translate-x-1/2",
              "-translate-y-1/2 opacity-70",
            )}
          >
            {knowledgeNodes.map((node, i) => (
              <line
                key={node.id}
                x1={node.x}
                y1={node.y}
                x2={convergence.x}
                y2={convergence.y}
                stroke="var(--srs-network-line)"
                strokeWidth={0.2}
                pathLength={1}
                className="kos-line-draw"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
            {/*
              Nodes drift the last stretch inward once the edges have drawn —
              a restrained ~30-40px in an SVG whose box maps to roughly the
              section width, i.e. a few percent of the 0-100 viewBox — then
              hold. No loop.
            */}
            {knowledgeNodes.map((node) => (
              <circle
                key={`node-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={0.9}
                fill="var(--srs-lime)"
                className="kos-converge-node"
                style={
                  {
                    "--kos-from-x": `${(convergence.x - node.x) * 0.28}px`,
                    "--kos-from-y": `${(convergence.y - node.y) * 0.28}px`,
                  } as CSSProperties
                }
              />
            ))}
          </svg>

          <div
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-1/2 size-3",
              "-translate-x-1/2 -translate-y-1/2 rounded-full bg-lime",
            )}
          />
          {/* Convergence ring — expands once after the nodes settle, then stops. */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 100 100"
            className={cn(
              "absolute left-1/2 top-1/2 aspect-square h-full",
              "-translate-x-1/2 -translate-y-1/2",
            )}
          >
            <circle
              cx={convergence.x}
              cy={convergence.y}
              r={5}
              fill="none"
              stroke="var(--srs-lime)"
              strokeWidth={0.3}
              className="kos-converge-ring"
            />
          </svg>
      </Reveal>

      <Container className="relative">
        <Reveal as="div" style={{ transitionDelay: "480ms" }}>
          <IndexLabel index={finalCta.index} as="p">
            {finalCta.eyebrow}
          </IndexLabel>

          <h2 id="final-cta-title" className="type-display-l mt-10 max-w-[14ch]">
            {finalCta.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="mt-12">
            <Button href={routes.programs} size="lg">
              {finalCta.cta} →
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
