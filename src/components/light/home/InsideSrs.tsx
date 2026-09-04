import Image from "next/image";

import { Reveal } from "@/components/light/ui/Reveal";
import { reelCards } from "@/content/light/inside-srs";

/**
 * "Inside SRS" — vertical 9:16 media/reel. Desktop: a premium row of
 * cards; mobile: a native-feeling horizontal swipe with scroll-snap. Static
 * poster imagery with a play affordance, isolated to this section only.
 */
export function InsideSrs() {
  return (
    <section className="sl-container py-16">
      <Reveal>
        <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          INSIDE SRS
        </div>
        <h2 className="sl-h2 mb-6.5 text-[1.6rem]">A closer look, in motion</h2>
      </Reveal>
      <Reveal
        className="sl-scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
        aria-label="Inside SRS media"
      >
        {reelCards.map((card) => (
          <div
            key={card.id}
            className="sl-glass group relative aspect-[9/16] w-45 shrink-0 snap-start overflow-hidden rounded-[var(--radius-sl-md)] transition-transform duration-[var(--sl-dur-med)] ease-[var(--sl-ease)] hover:-translate-y-1.5 min-[700px]:w-52"
          >
            <Image
              src={card.photo}
              alt=""
              fill
              sizes="(min-width: 700px) 208px, 180px"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.6))" }}
              aria-hidden="true"
            />
            <span
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-sl-ink opacity-0 transition-opacity duration-[var(--sl-dur-fast)] group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden="true"
            >
              ▶
            </span>
            <span className="absolute inset-x-2.5 bottom-2.5 rounded-[var(--radius-sl-sm)] bg-black/35 px-2.5 py-1.5 text-xs font-bold text-white">
              {card.label}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
