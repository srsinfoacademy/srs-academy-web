import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipToContent } from "@/components/layout/SkipToContent";

/**
 * Layout for the primary "Knowledge OS" (dark theme) route group. Scoping
 * the shared header/footer here — rather than in the true root layout —
 * lets sibling route groups (e.g. `/light`) render their own header/footer
 * without doubling up: the root layout only owns `<html>`/`<body>`/fonts.
 */
export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SkipToContent />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
