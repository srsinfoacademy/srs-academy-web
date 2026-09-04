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
    default: `${site.name} — Light Theme Preview`,
    template: `%s — ${site.name} (Light Preview)`,
  },
  description:
    "A visual preview of the SRS Academy light theme — a separate, parallel design exploration alongside the live site.",
  robots: { index: false, follow: false },
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
