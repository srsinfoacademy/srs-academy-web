import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { statistics } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Statistics — deliberately quiet.
 *
 * No section heading, no cards, no icons: a single divided band between two
 * narrative sections, with vertical hairlines and no border on the last cell.
 *
 * Count-up is disabled until real figures exist. Animating a placeholder
 * glyph would present invented data as if it had been measured, so the values
 * render statically and are marked as pending for assistive technology.
 */
export function Statistics() {
  return (
    <section aria-label="Academy at a glance" className="rule-top rule-bottom bg-surface-1">
      <Container>
        <Reveal as="dl" stagger className="grid grid-cols-2 md:grid-cols-4">
          {statistics.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col gap-2 py-12 md:py-14",
                "px-6 first:pl-0 md:px-8",
                // Vertical hairlines only; never on the last cell.
                "border-line-hairline",
                i % 2 === 1 ? "border-l" : "",
                "md:border-l md:first:border-l-0",
                i === 1 ? "md:border-l" : "",
              )}
            >
              <dd className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-primary">
                <span aria-hidden="true">{stat.value}</span>
                <span className="sr-only-srs">Figure to be confirmed</span>
              </dd>
              <dt className="type-index">{stat.label}</dt>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
