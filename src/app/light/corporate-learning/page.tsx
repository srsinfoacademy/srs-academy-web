import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/light/ui/Reveal";
import { LightButton } from "@/components/light/ui/LightButton";
import { lightRoutes } from "@/lib/light/routes";

export const metadata: Metadata = {
  title: "Professional & Corporate Learning",
  description: "Upskill your team, or advance your own career, with practical, business-relevant learning tracks.",
};

const tracks = [
  { emoji: "🧭", title: "Team upskilling", body: "Cohort-based workshops built around a team's real workload, not a generic curriculum." },
  { emoji: "📈", title: "Individual career growth", body: "For working professionals aiming at the next role — flexible, evening- and weekend-friendly formats." },
  { emoji: "🤝", title: "Custom engagements", body: "Scope and pacing discussed directly with your organisation — talk to an advisor to explore fit." },
];

export default function LightCorporateLearningPage() {
  return (
    <>
      <section className="bg-sl-ink py-16 text-[#f8f7f4] min-[700px]:py-22">
        <Reveal className="sl-container flex flex-wrap items-center gap-10">
          <div className="max-w-140 flex-1 basis-105">
            <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-blue">
              PROFESSIONAL &amp; CORPORATE LEARNING
            </div>
            <h1 className="sl-h1 mb-4 text-[2.5rem]">Upskill your team, or advance your own career</h1>
            <p className="mb-7 text-[16px] leading-relaxed text-white/70">
              For managers building stronger teams and professionals aiming for the next
              role — practical, business-relevant learning tracks, delivered on your
              timeline.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <LightButton href={lightRoutes.contact} variant="primary">
                Talk about corporate training <span aria-hidden="true">→</span>
              </LightButton>
              <LightButton href={`${lightRoutes.courses}?category=corporate`} variant="secondary" className="!border-white/30 !text-white hover:!bg-white/8">
                Browse corporate courses
              </LightButton>
            </div>
          </div>
          <div className="sl-glass relative min-h-65 min-w-70 flex-1 basis-80 overflow-hidden rounded-[var(--radius-sl-lg)]">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80"
              alt="Working professionals in a corporate training session"
              fill
              sizes="(min-width: 900px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="sl-container py-16">
        <Reveal>
          <h2 className="sl-h2 mb-8 text-2xl">Three ways to work with SRS Academy</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 min-[700px]:grid-cols-3">
          {tracks.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <div className="h-full rounded-[var(--radius-sl-md)] border border-sl-ink/10 bg-white p-6">
                <span className="mb-3 block text-2xl" aria-hidden="true">
                  {t.emoji}
                </span>
                <div className="mb-2 text-base font-semibold">{t.title}</div>
                <p className="text-sm leading-relaxed text-sl-ink/62">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sl-container pb-20">
        <Reveal
          className="rounded-[var(--radius-sl-lg)] px-7 py-12 text-center min-[700px]:px-16"
          style={{ background: "var(--sl-accent)" }}
        >
          <h2 className="sl-h2 mx-auto mb-4 max-w-[26ch] text-[1.9rem] text-sl-ink">
            Building a training plan for your organisation?
          </h2>
          <LightButton href={lightRoutes.contact} variant="dark" size="lg">
            Talk to an advisor
          </LightButton>
        </Reveal>
      </section>
    </>
  );
}
