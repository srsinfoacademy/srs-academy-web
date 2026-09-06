import type { Metadata } from "next";
import Image from "next/image";

import { EditorialHero } from "@/components/light/ui/EditorialHero";
import { Reveal } from "@/components/light/ui/Reveal";

export const metadata: Metadata = {
  title: "Gallery — Life at SRS",
  description: "Classrooms, workshops, and hands-on practice at SRS Academy.",
};

/**
 * Editorial/decorative imagery only — no real SRS Academy photos exist in
 * this repository yet. Each tile carries a neutral, safe category label
 * (never a student name, event, or date) so nothing here reads as a claim
 * about a specific real activity — see the intro copy below for the same
 * disclaimer in words.
 */
const photos = [
  { id: "1523240795612-9a054b0db644", label: "Learning environments" },
  { id: "1571260899304-425eee4c7efc", label: "Creative practice" },
  { id: "1581091226825-a6a2a5aee158", label: "Technology learning" },
  { id: "1522337360788-8b13dee7a37e", label: "Creative practice" },
  { id: "1610030469983-98e550d6193c", label: "Creative practice" },
  { id: "1509062522246-3755977927d7", label: "Professional learning" },
  { id: "1531482615713-2afd69097998", label: "Technology learning" },
  { id: "1573497019940-1c28c88b4f3e", label: "Professional learning" },
  { id: "1556905055-8f358a7a47b2", label: "Learning environments" },
];

export default function LightGalleryPage() {
  return (
    <>
      <EditorialHero
        kicker="Gallery"
        title="Life at SRS Academy"
        intro="Illustrative imagery representing the kinds of learning environments SRS Academy programs use — not photos of specific classes, students, or events."
      />
      <section className="sl-container pb-20">
        <div className="grid grid-cols-2 gap-3.5 min-[700px]:grid-cols-3">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} delay={(i % 3) * 60} className={i % 5 === 0 ? "min-[700px]:col-span-2" : ""}>
              <div className="sl-glass relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sl-md)]">
                <Image
                  src={`https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=800&q=80`}
                  alt=""
                  fill
                  sizes="(min-width: 700px) 33vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.45))" }}
                  aria-hidden="true"
                />
                <span className="absolute bottom-2.5 left-2.5 rounded-[var(--radius-sl-sm)] bg-black/35 px-2.5 py-1.5 text-xs font-bold text-white">
                  {photo.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
