"use client";

import { Reveal } from "@/components/light/ui/Reveal";
import { useReveal } from "@/lib/light/useReveal";

const steps = [
  { emoji: "🧭", title: "Explore", body: "Find the world and program that fits your goal." },
  { emoji: "🛠️", title: "Learn", body: "Hands-on lessons, not just theory or slides." },
  { emoji: "🤝", title: "Get mentored", body: "Real feedback from people who've done the work." },
  { emoji: "📜", title: "Get certified", body: "Finish with proof of what you can actually do." },
];

export function HowLearningWorks() {
  const lineRef = useReveal<SVGSVGElement>();

  return (
    <section className="sl-container py-16">
      <Reveal>
        <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          HOW LEARNING WORKS
        </div>
        <h2 className="sl-h2 mb-10 text-[1.75rem]">A simple rhythm, whatever you&apos;re learning</h2>
      </Reveal>
      <div className="relative">
        <svg
          ref={lineRef}
          viewBox="0 0 1000 4"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 top-6.5 hidden h-1 w-full min-[700px]:block"
          aria-hidden="true"
        >
          <line x1="0" y1="2" x2="1000" y2="2" stroke="rgba(17,17,17,.1)" strokeWidth="2" />
          <line
            x1="0"
            y1="2"
            x2="1000"
            y2="2"
            stroke="var(--sl-accent-text)"
            strokeWidth="2"
            className="sl-line-draw"
          />
        </svg>
        <div className="relative grid grid-cols-1 gap-6 min-[700px]:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div
                className="mb-4 flex h-13 w-13 items-center justify-center rounded-full border-2 bg-sl-paper text-xl"
                style={{ borderColor: "var(--sl-accent-text)" }}
                aria-hidden="true"
              >
                {s.emoji}
              </div>
              <div className="mb-1.5 text-base font-semibold">{s.title}</div>
              <p className="text-[13px] leading-relaxed text-sl-ink/62">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
