import { Reveal } from "@/components/light/ui/Reveal";

const modes = [
  { emoji: "💻", title: "Online", body: "Learn from anywhere, on your own schedule, with mentor support." },
  { emoji: "🏫", title: "Offline", body: "Hands-on practice at a learning centre near you." },
  { emoji: "🔀", title: "Hybrid", body: "Mix online lessons with in-person practice sessions." },
];

export function LearningModes() {
  return (
    <section className="sl-container py-16">
      <Reveal>
        <h2 className="sl-h2 mb-6.5 text-[1.6rem]">Learn the way that fits your life</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-4.5 min-[700px]:grid-cols-3">
        {modes.map((m, i) => (
          <Reveal key={m.title} delay={i * 80}>
            <div className="sl-glass flex h-full flex-col gap-2 rounded-[var(--radius-sl-md)] p-6">
              <span className="text-[22px]" aria-hidden="true">
                {m.emoji}
              </span>
              <div className="text-base font-semibold">{m.title}</div>
              <p className="text-[13px] leading-relaxed text-sl-ink/62">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
