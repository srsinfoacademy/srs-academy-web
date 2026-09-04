import { Reveal } from "@/components/light/ui/Reveal";

const steps = [
  { num: "01", title: "Choose a program", body: "Browse by interest, not jargon." },
  { num: "02", title: "Talk to us", body: "A short call, in your language, no pressure." },
  { num: "03", title: "Enroll", body: "Simple registration, flexible payment options." },
  { num: "04", title: "Start learning", body: "Begin classes with mentors who get it." },
];

export function HowToJoin() {
  return (
    <section id="join" className="bg-sl-ink py-16 text-[#f8f7f4]">
      <div className="sl-container">
        <Reveal>
          <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-lime">HOW TO JOIN</div>
          <h2 className="sl-h2 mb-10 max-w-[26ch] text-[1.75rem]">
            Four steps — no paperwork maze, no jargon.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 min-[700px]:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 90}>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-sl-lime bg-[#1c1c15] font-sl-display text-lg font-bold text-sl-lime">
                {s.num}
              </div>
              <div className="mb-1.5 text-base font-semibold">{s.title}</div>
              <p className="text-[13px] leading-relaxed text-white/62">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
