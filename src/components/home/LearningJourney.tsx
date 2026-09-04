import { IndexLabel } from "@/components/ui/IndexLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { journeyStages } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * The learning journey — the system assembling.
 *
 * Same node language as the hero, with no arrows: the edge does the work.
 * Horizontal spine from 768 up, vertical rail below. This describes a public
 * education pathway, not a student's actual progress.
 */
export function LearningJourney() {
  return (
    <Section spacing="loose" ruled aria-labelledby="journey-title">
      <IndexLabel index="05" as="p">
        Journey
      </IndexLabel>

      <h2 id="journey-title" className="type-h2 mt-8 max-w-[20ch]">
        One system, five stages
      </h2>

      <Reveal as="ol" stagger className={cn("mt-16 grid gap-x-6 gap-y-10", "md:grid-cols-5")}>
        {journeyStages.map((stage, i) => (
          <li key={stage.id} className="relative flex gap-5 md:flex-col md:gap-0">
            {/* Vertical rail below md, horizontal spine at md and above. */}
            <div className="relative flex shrink-0 flex-col items-center md:h-auto md:w-full md:flex-row">
              <span
                aria-hidden="true"
                className="relative z-10 size-3 shrink-0 rounded-full bg-lime"
              />
              {i < journeyStages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-line",
                    "w-px flex-1 md:h-px md:w-full md:flex-1",
                  )}
                />
              ) : null}
            </div>

            <div className="pb-2 md:pt-6">
              <p className="type-index text-lime">{stage.num}</p>
              <h3 className="type-h4 mt-2">{stage.title}</h3>
              <p className="type-body-s mt-2 max-w-[28ch] md:pr-4">{stage.body}</p>
              <p className="type-index mt-3">{stage.meta}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
