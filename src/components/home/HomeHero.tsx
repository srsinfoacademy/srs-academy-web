import { GridBackground } from "@/components/knowledge-os/GridBackground";
import { HeroNetwork } from "@/components/home/HeroNetwork";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IndexLabel } from "@/components/ui/IndexLabel";
import { heroCopy } from "@/content/home";
import { routes } from "@/lib/routes";

/**
 * Homepage hero. Server-rendered apart from the network, which is the only
 * interactive part of the composition.
 */
export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-[var(--srs-section-loose)] pt-[var(--srs-section)]"
    >
      <GridBackground fade="radial" size={88} />

      <Container className="relative">
        <div className="grid items-start gap-x-8 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-6 xl:col-span-6">
            <IndexLabel index={heroCopy.index} as="p" className="hero-enter">
              {heroCopy.eyebrow}
            </IndexLabel>

            <p
              className="type-index hero-enter mt-6 text-secondary"
              style={{ animationDelay: "60ms" }}
            >
              {heroCopy.organisation}
            </p>

            <h1
              id="hero-title"
              className="type-display-xl hero-enter mt-3 max-w-[16ch]"
              style={{ animationDelay: "120ms" }}
            >
              {heroCopy.headline}
            </h1>

            <p
              className="type-body-l hero-enter mt-8 max-w-[52ch]"
              style={{ animationDelay: "220ms" }}
            >
              {heroCopy.lead}
            </p>
            <p
              className="type-body-s hero-enter mt-3 max-w-[52ch] text-muted"
              style={{ animationDelay: "260ms" }}
            >
              {heroCopy.positioning}
            </p>

            <div className="hero-enter mt-10 flex flex-wrap gap-4" style={{ animationDelay: "320ms" }}>
              <Button href={routes.programs} size="md">
                {heroCopy.primaryCta}
              </Button>
              <Button href={routes.about} size="md" variant="ghost">
                {heroCopy.secondaryCta}
              </Button>
            </div>

            <p
              className="type-index hero-enter mt-12 text-muted"
              style={{ animationDelay: "380ms" }}
            >
              Scroll — {heroCopy.scrollNote}
            </p>
          </div>

          {/*
            The network holds its own column on large screens. Below 1024 it
            moves under the copy and keeps a shorter box, so the headline is
            always the first thing read. It settles in after the copy column,
            per its own internal stagger — see HeroNetwork.
          */}
          <div className="lg:col-span-6">
            <HeroNetwork className="w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
