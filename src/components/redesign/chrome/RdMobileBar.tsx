import { RdButton } from "@/components/redesign/RdButton";
import { rdEnquireHref } from "@/content/redesign-nav";

/**
 * Fixed Courses / Enquire Now bar below the `nav:` breakpoint. The site
 * layout pads the page by the same height so the footer is never hidden.
 */
export function RdMobileBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2.5 border-t border-rd-line-strong bg-rd-bg/95 px-[clamp(12px,3vw,24px)] pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-sm nav:hidden"
    >
      <RdButton href="/courses" variant="secondary">
        Courses
      </RdButton>
      <RdButton href={rdEnquireHref} variant="accent">
        Enquire Now
      </RdButton>
    </nav>
  );
}
