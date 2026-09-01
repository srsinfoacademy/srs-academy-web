import { IndexLabel } from "@/components/ui/IndexLabel";
import { Section } from "@/components/ui/Section";
import { journeyStages, systemStages } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * LEARN / BUILD / ADVANCE.
 *
 * Explicitly not cards: these are three nodes of the page-wide five-stage
 * system, lifted out and enlarged. The spine above them keeps all five nodes
 * so the relationship to the journey stays legible.
 */
export function SystemStages() {
  const lifted = new Set(systemStages.map((stage) => stage.id));

  return (
    <Section spacing="loose" ruled aria-labelledby="stages-title">
      <IndexLabel index="03" as="p">
        System stages
      </IndexLabel>

      <h2 id="stages-title" className="type-h2 mt-8 max-w-[20ch]">
        Three nodes of one system
      </h2>

      {/* The five-node spine. Labels for the two unlifted nodes drop below 1024. */}
      <ol className="mt-14 flex items-center gap-3" aria-label="Five-stage system">
        {journeyStages.map((stage) => {
          const isLifted = lifted.has(stage.id);

          return (
            <li key={stage.id} className="flex flex-1 items-center gap-3 last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 rounded-full",
                    isLifted ? "size-2.5 bg-lime" : "size-1.5 bg-lime/40",
                  )}
                />
                <span
                  className={cn(
                    "type-index whitespace-nowrap",
                    isLifted ? "text-primary" : "text-muted",
                    !isLifted && "hidden lg:inline",
                  )}
                >
                  {stage.title}
                </span>
              </div>
              <span aria-hidden="true" className="h-px flex-1 bg-line last:hidden" />
            </li>
          );
        })}
      </ol>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {systemStages.map((stage) => (
          <article
            key={stage.id}
            className={cn(
              "flex flex-col gap-4 rounded-[var(--srs-radius-xl)] p-8",
              "border border-line bg-[rgb(242_244_239_/_0.03)]",
              // Hover lifts on pointer devices only; mobile uses tint alone,
              // because the lift eats the gap between stacked stages.
              "transition-[border-color,background-color,transform] duration-[var(--srs-duration-fast)] ease-standard",
              "md:hover:-translate-y-1 md:hover:border-line-strong",
              "md:hover:bg-[rgb(242_244_239_/_0.05)]",
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="type-index text-lime">{stage.name}</span>
              <span className="type-index">{stage.num}</span>
            </div>

            <h3 className="type-h3">{stage.title}</h3>
            <p className="type-body-s">{stage.body}</p>

            <ul className="mt-auto flex flex-wrap gap-2 pt-2">
              {stage.tags.map((tag) => (
                <li
                  key={tag}
                  className="type-label rounded-[var(--srs-radius-sm)] border border-line px-2.5 py-1.5"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <p className="type-index text-muted">{stage.relation}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
