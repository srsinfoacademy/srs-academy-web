import Image from "next/image";

import { Reveal } from "@/components/light/ui/Reveal";
import { lightRoutes } from "@/lib/light/routes";
import { LightButton } from "@/components/light/ui/LightButton";

export function CreativeCareersSpotlight() {
  return (
    <Reveal as="section" variant="mask" className="relative flex min-h-95 items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80"
        alt="Makeup artistry student practicing on a client"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(17,17,17,.74), rgba(17,17,17,.28))" }}
        aria-hidden="true"
      />
      <div className="sl-container relative z-10 max-w-140 py-16 text-[#f8f7f4]">
        <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-pink">
          CREATIVE CAREERS
        </div>
        <h2 className="sl-h2 mb-3.5 text-[1.9rem]">Turn creativity into a career</h2>
        <p className="mb-5.5 text-[15px] leading-relaxed text-white/82">
          Makeup, mehendi and fashion aren&apos;t side hobbies here — they&apos;re taught
          with the same structure and seriousness as any technical program.
        </p>
        <LightButton href={`${lightRoutes.courses}?category=beauty`} variant="primary" className="!bg-sl-coral !text-white">
          Explore creative programs <span aria-hidden="true">→</span>
        </LightButton>
      </div>
    </Reveal>
  );
}
