import { RdFloatingControls } from "@/components/redesign/chrome/RdFloatingControls";
import { RdFooter } from "@/components/redesign/chrome/RdFooter";
import { RdHeader } from "@/components/redesign/chrome/RdHeader";
import { RdMobileBar } from "@/components/redesign/chrome/RdMobileBar";
import { RdRevealObserver } from "@/components/redesign/chrome/RdRevealObserver";
import { RdSkipLink } from "@/components/redesign/chrome/RdSkipLink";

/**
 * Header, main landmark, footer, the mobile action bar and the floating
 * theme / back-to-top controls. Shared by the
 * (site) route-group layout and the root not-found page, which renders
 * outside every route group.
 */
export function RdSiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-rd-bg pb-[calc(70px+env(safe-area-inset-bottom))] font-rd-sans text-rd-body nav:pb-0">
      <RdSkipLink />
      <RdHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <RdFooter />
      <RdMobileBar />
      <RdFloatingControls />
      <RdRevealObserver />
    </div>
  );
}
