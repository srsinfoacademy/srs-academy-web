import { Reveal } from "@/components/light/ui/Reveal";
import { site } from "@/content/site";

export function SprsRelationship() {
  return (
    <section className="sl-container py-16">
      <Reveal className="sl-glass max-w-190 rounded-[var(--radius-sl-lg)] px-7 py-8 min-[700px]:px-10 min-[700px]:py-10">
        <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          SRS ACADEMY &amp; {site.organisation.legalName}
        </div>
        <h2 className="sl-h2 mb-4 text-[1.6rem]">Backed by real technology experience</h2>
        <p className="max-w-135 text-[15px] leading-relaxed text-sl-ink/68">
          {site.organisation.relationship}
        </p>
      </Reveal>
    </section>
  );
}
