import { Button } from "@/components/ui/Button";
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
      </svg>

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 size-3",
          "-translate-x-1/2 -translate-y-1/2 rounded-full bg-lime",
        )}
      />

      <Container className="relative">
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
      </Container>
    </section>
  );
}
