import { IndexLabel } from "@/components/ui/IndexLabel";
import { Section } from "@/components/ui/Section";
import { manifesto } from "@/content/home";

/**
 * Editorial positioning statement.
 *
 * The design specifies a two-step reveal tied to scroll position — no
 * per-word staggering. It is composed here in its resolved state; the reveal
 * is a CSS-only enhancement, so the section reads correctly with no script
 * and under reduced motion.
 */
export function Manifesto() {
  return (
    <Section
      spacing="loose"
      surface="surface-1"
      ruled
      aria-labelledby="manifesto-title"
    >
      <IndexLabel index={manifesto.index} as="p">
        {manifesto.eyebrow}
      </IndexLabel>

      <h2 id="manifesto-title" className="type-h2 mt-8 max-w-[22ch]">
        <span className="text-muted">{manifesto.leadSentence}</span>{" "}
        <span className="text-primary">{manifesto.resolve}</span>{" "}
        <span className="text-lime">{manifesto.emphasis}</span>
      </h2>
    </Section>
  );
}
