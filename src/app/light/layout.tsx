import type { Metadata } from "next";

import { LightFooter } from "@/components/light/layout/LightFooter";
import { LightHeader } from "@/components/light/layout/LightHeader";
import { LightSkipToContent } from "@/components/light/layout/LightSkipToContent";
import { VibeProvider } from "@/components/light/VibeProvider";
import { FloatingUtilityControls } from "@/components/shared/FloatingUtilityControls";
import { site } from "@/content/site";
import "./light.css";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  /**
   * The dark "Knowledge OS" routes are the canonical, indexed website —
   * `/light` is an alternate visual theme of the same content, not a
   * second site competing for the same search results. `follow: true`
   * (not `false`) is deliberate: crawlers still need to reach each page to
   * see its `alternates.canonical` pointing back at the matching dark URL.
   */
  robots: { index: false, follow: true },
};

/**
 * Root layout for the `/light` route group. Deliberately does not touch
 * `src/app/layout.tsx` — it reuses the fonts that layout already loads onto
 * `<html>` (via the `--srs-typeface-*` CSS variables) but renders its own
 * header/footer/stylesheet, entirely independent of the dark "Knowledge OS"
 * component tree.
 */
export default function LightLayout({ children }: LayoutProps<"/light">) {
  return (
    <VibeProvider>
      <LightSkipToContent />
      <LightHeader />
      <main id="light-main-content" className="flex-1">
        {children}
      </main>
      <LightFooter />
      <FloatingUtilityControls variant="light" />
    </VibeProvider>
  );
}
