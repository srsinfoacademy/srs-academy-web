import Image from "next/image";

import { Reveal } from "@/components/light/ui/Reveal";

const photos = [
  "1523240795612-9a054b0db644",
  "1571260899304-425eee4c7efc",
  "1581091226825-a6a2a5aee158",
  "1522337360788-8b13dee7a37e",
  "1610030469983-98e550d6193c",
  "1509062522246-3755977927d7",
];

/** Desktop marquee gallery. Purely decorative — see `light.css` for the animation. */
export function LifeAtSrs() {
  const loop = [...photos, ...photos];

  return (
    <section className="overflow-hidden py-14">
      <Reveal className="sl-container mb-5.5">
        <div className="mb-2.5 font-sl-mono text-[11px] tracking-[0.16em] text-sl-ink/55">
          LIFE AT SRS ACADEMY
        </div>
        <h2 className="sl-h2 text-[1.5rem]">Classrooms, workshops, and hands-on practice</h2>
      </Reveal>
      <div
        className="relative"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
        }}
      >
        <div className="sl-marquee-track flex w-max gap-4.5">
          {loop.map((id, i) => (
            <div
              key={`${id}-${i}`}
              className="relative h-45 w-65 shrink-0 overflow-hidden rounded-[var(--radius-sl-md)]"
              aria-hidden={i >= photos.length}
            >
              <Image
                src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`}
                alt=""
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
