"use client";

import { vibes } from "@/content/light/vibes";
import { useVibe } from "@/components/light/VibeProvider";

/**
 * 🩷 Soft · 🖤 Dark · 💚 Fresh · 💜 Creative · 💙 Chill.
 *
 * Retints `--sl-accent` (hero mood + selected-surface tinting) only — never
 * body text colour or layout. Persisted via VibeProvider.
 */
export function VibePicker({ className }: { className?: string }) {
  const { vibe, setVibe } = useVibe();

  return (
    <div
      className={`sl-glass inline-flex flex-wrap items-center gap-3 rounded-full py-2 pl-4.5 pr-2 ${className ?? ""}`}
    >
      <span className="font-sl-mono text-[10px] tracking-[0.12em] text-sl-ink/55 whitespace-nowrap">
        PICK YOUR VIBE
      </span>
      <div className="flex gap-1.5" role="radiogroup" aria-label="Pick your vibe">
        {vibes.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={vibe === v.id}
            title={v.label}
            onClick={() => setVibe(v.id)}
            className={`sl-focus flex h-9 w-9 items-center justify-center rounded-full text-[17px] transition-[transform,background-color] duration-[var(--sl-dur-fast)] hover:scale-105 ${
              vibe === v.id ? "bg-sl-ink text-sl-paper scale-105" : "bg-white/70"
            }`}
          >
            <span aria-hidden="true">{v.emoji}</span>
            <span className="sr-only">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
