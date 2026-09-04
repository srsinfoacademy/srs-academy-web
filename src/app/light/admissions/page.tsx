import type { Metadata } from "next";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { EditorialSections } from "@/components/light/ui/EditorialSections";
import { Reveal } from "@/components/light/ui/Reveal";
import { LightButton } from "@/components/light/ui/LightButton";
import { admissionsJourney, admissionsPage } from "@/content/pages";

export const metadata: Metadata = { title: "Admissions" };

export default function LightAdmissionsPage() {
  return (
    <>
      <EditorialHero kicker={admissionsPage.kicker} title={admissionsPage.title} intro={admissionsPage.intro}>
        <div className="mt-6">
          <LightButton pending={admissionsPage.ctaLabel ?? "[START APPLICATION]"} variant="dark">
            Start application
          </LightButton>
        </div>
      </EditorialHero>

      <section className="sl-container pb-14 min-[700px]:pb-18">
        <Reveal>
          <h2 className="sl-h2 mb-8 text-2xl">The admissions journey</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 min-[700px]:grid-cols-5">
          {admissionsJourney.map((step, i) => (
            <Reveal key={step.num} delay={i * 80}>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-sl-ink font-sl-mono text-sm font-bold text-sl-lime">
                {step.num}
              </div>
              <div className="mb-1 text-sm font-semibold text-sl-ink/40">{step.title}</div>
              <p className="text-[13px] leading-relaxed text-sl-ink/55">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <EditorialSections sections={admissionsPage.sections} />
    </>
  );
}
