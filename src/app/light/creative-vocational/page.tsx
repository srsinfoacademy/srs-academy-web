import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/light/ui/Reveal";
import { LightButton } from "@/components/light/ui/LightButton";
import { courseCategories } from "@/content/light/courses";
import { lightRoutes } from "@/lib/light/routes";

export const metadata: Metadata = {
  title: "Creative & Vocational Learning",
  description: "Makeup, mehendi, fashion and skilled-trades programs taught with the same structure and seriousness as any technical program.",
};

const spotlightCategories: (typeof courseCategories)[number]["id"][] = ["beauty", "creative", "fashion", "trades"];

export default function LightCreativeVocationalPage() {
  const spotlight = courseCategories.filter((c) => spotlightCategories.includes(c.id));

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative h-72 w-full min-[700px]:h-88">
          <Image
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80"
            alt="Makeup and mehendi artistry students practicing"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(17,17,17,.72), rgba(17,17,17,.24))" }}
            aria-hidden="true"
          />
          <div className="sl-container absolute inset-x-0 bottom-0 pb-9 text-white">
            <div className="mb-3 font-sl-mono text-[11px] tracking-[0.16em] text-sl-pink">
              CREATIVE &amp; VOCATIONAL LEARNING
            </div>
            <h1 className="sl-h1 max-w-150 text-[2.4rem] min-[700px]:text-[2.9rem]">
              Turn creativity into a career
            </h1>
          </div>
        </div>
      </section>

      <section className="sl-container py-16">
        <Reveal className="max-w-160">
          <p className="text-[16px] leading-relaxed text-sl-ink/68">
            Makeup, mehendi, fashion and the skilled trades aren&apos;t side hobbies here
            — they&apos;re taught with the same structure and seriousness as any
            technical program: hands-on practice, real client work, and a path to a
            certificate of completion.
          </p>
        </Reveal>
      </section>

      <section className="sl-container pb-16">
        <div className="grid grid-cols-1 gap-5 min-[700px]:grid-cols-2">
          {spotlight.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 70}>
              <a
                href={`${lightRoutes.courses}?category=${cat.id}`}
                className="sl-focus flex h-full flex-col gap-2.5 rounded-[var(--radius-sl-md)] p-7"
                style={{ background: cat.tint }}
              >
                <span className="text-3xl" aria-hidden="true">
                  {cat.emoji}
                </span>
                <div className="text-lg font-semibold">{cat.label}</div>
                <p className="text-sm text-sl-ink/62">
                  Browse {cat.label.toLowerCase()} programs in the course catalogue.
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sl-container pb-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-5 rounded-[var(--radius-sl-lg)] bg-sl-ink px-8 py-10 text-white">
          <h2 className="sl-h2 max-w-100 text-2xl">Ready to build a hands-on creative skill?</h2>
          <LightButton href={lightRoutes.courses} variant="primary" size="lg">
            Browse all creative courses
          </LightButton>
        </Reveal>
      </section>
    </>
  );
}
