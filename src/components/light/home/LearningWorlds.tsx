import Link from "next/link";

import { Reveal } from "@/components/light/ui/Reveal";
import { courseCategories } from "@/content/light/courses";
import { lightRoutes } from "@/lib/light/routes";

/** "What do you want to learn?" — discovery entry into the course catalogue. */
export function LearningWorlds() {
  return (
    <section id="worlds" className="sl-container py-16">
      <Reveal>
        <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          LEARNING WORLDS
        </div>
        <h2 className="sl-h2 mb-7 max-w-[22ch] text-[1.9rem]">What do you want to learn?</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 min-[700px]:grid-cols-3 min-[1100px]:grid-cols-4">
        {courseCategories
          .filter((c) => c.id !== "corporate")
          .map((cat, i) => (
            <Reveal key={cat.id} delay={i * 60}>
              <Link
                href={`${lightRoutes.courses}?category=${cat.id}`}
                className="sl-focus group flex min-h-42 flex-col gap-2.5 rounded-[var(--radius-sl-md)] p-6 transition-transform duration-[var(--sl-dur-med)] ease-[var(--sl-ease)] hover:-translate-y-1"
                style={{ background: cat.tint }}
              >
                <span className="text-2xl" aria-hidden="true">
                  {cat.emoji}
                </span>
                <span className="text-base font-semibold">{cat.label}</span>
                <span className="text-xs leading-snug text-sl-ink/62">
                  Explore programs in {cat.label.toLowerCase()}.
                </span>
              </Link>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
