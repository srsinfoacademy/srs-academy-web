import type { Metadata } from "next";
import Image from "next/image";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { Reveal } from "@/components/light/ui/Reveal";

export const metadata: Metadata = {
  title: "Gallery — Life at SRS",
  description: "Classrooms, workshops, and hands-on practice at SRS Academy.",
};

const photoIds = [
  "1523240795612-9a054b0db644",
  "1571260899304-425eee4c7efc",
  "1581091226825-a6a2a5aee158",
  "1522337360788-8b13dee7a37e",
  "1610030469983-98e550d6193c",
  "1509062522246-3755977927d7",
  "1531482615713-2afd69097998",
  "1573497019940-1c28c88b4f3e",
  "1556905055-8f358a7a47b2",
];

export default function LightGalleryPage() {
  return (
    <>
      <EditorialHero
        kicker="Gallery"
        title="Life at SRS Academy"
        intro="Classrooms, workshops, and hands-on practice — illustrative imagery representing the kinds of learning environments SRS Academy programs use."
      />
      <section className="sl-container pb-20">
        <div className="grid grid-cols-2 gap-3.5 min-[700px]:grid-cols-3">
          {photoIds.map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 60} className={i % 5 === 0 ? "min-[700px]:col-span-2" : ""}>
              <div className="sl-glass relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sl-md)]">
                <Image
                  src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`}
                  alt=""
                  fill
                  sizes="(min-width: 700px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
