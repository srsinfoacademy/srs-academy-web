import type { Metadata } from "next";

import { RdButton } from "@/components/redesign/RdButton";
import { RdContainer } from "@/components/redesign/RdContainer";
import { RdEyebrow } from "@/components/redesign/RdEyebrow";
import { RdSiteChrome } from "@/components/redesign/chrome/RdSiteChrome";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Branded 404 for unmatched URLs and for `notFound()` in any public page. */
export default function NotFound() {
  return (
    <RdSiteChrome>
      <section className="rd-lattice bg-rd-muted py-[clamp(64px,10vw,128px)]">
        <RdContainer>
          <RdEyebrow rule>Error 404</RdEyebrow>
          <h1 className="mt-4 max-w-[18ch] font-rd-display text-[clamp(38px,5vw,60px)] font-medium leading-[1.04] tracking-[-0.025em] text-rd-ink">
            We couldn’t find that page.
          </h1>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-rd-body">
            The link may be old, or the page may have moved. Browse the courses or send us an
            enquiry and we’ll point you in the right direction.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <RdButton href="/courses" variant="primary">
              Browse courses
            </RdButton>
            <RdButton href="/" variant="secondary">
              Go to the home page
            </RdButton>
            <RdButton href="/contact" variant="accent">
              Enquire Now
            </RdButton>
          </div>
        </RdContainer>
      </section>
    </RdSiteChrome>
  );
}
