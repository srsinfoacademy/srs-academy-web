import { Reveal } from "@/components/light/ui/Reveal";
import { lightRoutes } from "@/lib/light/routes";
import { LightButton } from "@/components/light/ui/LightButton";

export function FinalCta() {
  return (
    <section className="sl-container pb-20 pt-4">
      <Reveal
        className="relative overflow-hidden rounded-[var(--radius-sl-lg)] px-7 py-14 text-center min-[700px]:px-16"
        style={{ background: "var(--sl-accent)", boxShadow: "var(--sl-shadow-hero)" }}
      >
        <h2 className="sl-h2 mx-auto mb-4 max-w-[24ch] text-[2rem] text-sl-ink">
          Ready to start learning something real?
        </h2>
        <p className="mx-auto mb-8 max-w-105 text-[15px] leading-relaxed text-sl-ink/72">
          Browse the full catalogue, or talk to an advisor about the right path for
          where you&apos;re starting from.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <LightButton href={lightRoutes.courses} variant="dark" size="lg">
            Explore all courses <span aria-hidden="true">→</span>
          </LightButton>
          <LightButton href={lightRoutes.contact} variant="secondary" size="lg" className="!border-sl-ink/25 !bg-white/40">
            Talk to an Advisor
          </LightButton>
        </div>
      </Reveal>
    </section>
  );
}
