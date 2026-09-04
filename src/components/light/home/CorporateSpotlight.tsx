import Image from "next/image";

import { Reveal } from "@/components/light/ui/Reveal";
import { lightRoutes } from "@/lib/light/routes";
import { LightButton } from "@/components/light/ui/LightButton";

/**
 * A restrained teaser for `/light/corporate-learning` — a static image, no
 * reel behaviour, per the Master Consolidation ("professional-learning
 * panels stay calm — a single restrained static image, no feed, no
 * autoscroll").
 */
export function CorporateSpotlight() {
  return (
    <section id="corporate" className="bg-sl-ink py-16 text-[#f8f7f4]">
      <Reveal className="sl-container flex flex-wrap items-center gap-10">
        <div className="max-w-140 flex-1 basis-105">
          <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-blue">
            PROFESSIONAL &amp; CORPORATE LEARNING
          </div>
          <h2 className="sl-h2 mb-4 text-[1.9rem]">Upskill your team, or advance your own career</h2>
          <p className="mb-5.5 text-[15px] leading-relaxed text-white/68">
            For managers building stronger teams and professionals aiming for the next
            role — practical, business-relevant learning tracks, delivered on your
            timeline.
          </p>
          <LightButton href={lightRoutes.corporateLearning} variant="secondary" className="!border-sl-blue !text-white hover:!bg-white/8">
            Talk about corporate training <span aria-hidden="true">→</span>
          </LightButton>
        </div>
        <div className="sl-glass relative min-h-65 min-w-70 flex-1 basis-80 overflow-hidden rounded-[var(--radius-sl-lg)]">
          <Image
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
            alt="Working professionals in a corporate training session"
            fill
            sizes="(min-width: 900px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
