import Image from "next/image";

import { VibePicker } from "@/components/light/VibePicker";
import { Reveal } from "@/components/light/ui/Reveal";
import { lightRoutes } from "@/lib/light/routes";
import { LightButton } from "@/components/light/ui/LightButton";
import { CourseSearch } from "@/components/light/home/CourseSearch";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="sl-float pointer-events-none absolute -right-16 -top-16 h-85 w-85 rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, var(--sl-accent-strong), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="sl-float pointer-events-none absolute bottom-4 right-64 hidden h-36 w-36 rounded-full opacity-60 min-[900px]:block"
        style={{
          background: "radial-gradient(circle, rgba(255,90,95,.2), transparent 70%)",
          animationDirection: "reverse",
        }}
        aria-hidden="true"
      />

      <div className="sl-container relative z-10 flex flex-wrap items-center gap-12 pb-6 pt-14 min-[900px]:pt-22">
        <div className="max-w-160 flex-1 basis-130">
          <div className="mb-5.5 inline-flex items-center gap-2 rounded-full border border-sl-ink/15 px-3.5 py-1.5 font-sl-mono text-[11px] tracking-[0.14em]">
            <span className="h-1.5 w-1.5 rounded-full bg-sl-lime" aria-hidden="true" />
            MULTI-SKILL LEARNING, FOR EVERY AMBITION
          </div>
          <h1 className="sl-h1 mb-5 text-[2.75rem] min-[900px]:text-[3.6rem]">
            Learn a skill.
            <br />
            <span style={{ color: "var(--sl-accent-text)" }}>Build your next chapter.</span>
          </h1>
          <p className="mb-7 max-w-115 text-[17px] leading-relaxed text-sl-ink/68">
            Whether you&apos;re in school, chasing a promotion, or building a mehendi
            business on the side — SRS Academy has a path built around where you&apos;re
            starting, not where you&apos;re expected to be.
          </p>
          <div className="mb-7 flex flex-wrap gap-3.5">
            <LightButton href={lightRoutes.courses} size="lg" variant="dark">
              Explore Learning Worlds <span aria-hidden="true">→</span>
            </LightButton>
            <LightButton href={lightRoutes.contact} size="lg" variant="secondary">
              Talk to an Advisor
            </LightButton>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {["ONLINE · OFFLINE · HYBRID", "BEGINNER-FRIENDLY", "CERTIFICATE ON COMPLETION"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-sl-ink/15 px-3 py-1.5 font-sl-mono text-[10px] tracking-[0.08em] text-sl-ink/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="hero-settle relative min-h-110 min-w-80 flex-1 basis-95 overflow-hidden rounded-[var(--radius-sl-lg)]"
          style={{ boxShadow: "var(--sl-shadow-hero)" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
            alt="Learners studying together at SRS Academy"
            fill
            sizes="(min-width: 900px) 420px, 90vw"
            className="object-cover"
            priority
          />
          <div className="sl-glass absolute inset-x-5 bottom-5 rounded-[var(--radius-sl-md)] px-4 py-3.5">
            <p className="text-[13px] font-semibold">
              &ldquo;I didn&apos;t know where to start. Now I know exactly what I&apos;m
              learning and why.&rdquo;
            </p>
            <p className="mt-1 font-sl-mono text-[9px] tracking-[0.06em] text-sl-ink/50">
              ILLUSTRATIVE STUDENT VOICE — PLACEHOLDER
            </p>
          </div>
        </div>
      </div>

      <Reveal className="sl-container pb-7">
        <VibePicker />
      </Reveal>

      <Reveal className="sl-container pb-14">
        <CourseSearch />
      </Reveal>
    </section>
  );
}
