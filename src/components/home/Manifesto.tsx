import { ManifestoReveal } from "@/components/home/ManifestoReveal";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { Section } from "@/components/ui/Section";
import { manifesto } from "@/content/home";

/**
 * Editorial positioning statement.
 *
 * The design specifies a two-step reveal tied to scroll position — no
 * per-word staggering. Runs once, on first entry into the viewport; see
 * ManifestoReveal, which composes the same three clauses in their resolved
 * state so the section reads correctly with no script and under reduced
 * motion.
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

      <ManifestoReveal
        lead={manifesto.leadSentence}
        resolve={manifesto.resolve}
        emphasis={manifesto.emphasis}
      />
    </Section>
  );
}
