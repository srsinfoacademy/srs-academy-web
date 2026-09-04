"use client";

import { useState } from "react";

import { Reveal } from "@/components/light/ui/Reveal";
import { pathways } from "@/content/light/pathways";

/** "Who are you?" — learner-pathway selector. */
export function FindYourPath() {
  const [active, setActive] = useState(0);
  const current = pathways[active];

  return (
    <section className="sl-container py-16">
      <Reveal>
        <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          FIND YOUR PATH
        </div>
        <h2 className="sl-h2 mb-6.5 text-[1.9rem]">Who are you?</h2>
      </Reveal>
      <Reveal>
        <div className="mb-5.5 flex flex-wrap gap-2.5" role="tablist" aria-label="Learner pathways">
          {pathways.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`sl-focus rounded-full px-4.5 py-3 text-sm font-semibold transition-colors duration-[var(--sl-dur-fast)] ${
                active === i ? "bg-sl-ink text-sl-paper" : "bg-white text-sl-ink border border-sl-ink/12 hover:border-sl-ink/25"
              }`}
            >
              <span aria-hidden="true">{p.emoji}</span> {p.label}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal
        as="div"
        className="sl-glass max-w-170 rounded-[var(--radius-sl-lg)] px-7 py-6.5"
        key={current.id}
      >
        <div className="sl-h3 mb-2 text-lg">{current.label}</div>
        <p className="text-sm leading-relaxed text-sl-ink/68">{current.body}</p>
      </Reveal>
    </section>
  );
}
