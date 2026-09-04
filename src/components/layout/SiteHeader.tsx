"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { HeaderNav } from "@/components/layout/HeaderNav";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { portalNav } from "@/content/navigation";
import { cn } from "@/lib/cn";

/** Scroll distance after which the header compacts. */
const COMPACT_AT = 24;

/**
 * Global header.
 *
 * Two states: an 88px default and a 64px compact state that engages on
 * scroll and becomes a restrained translucent surface. The scroll listener is
 * the only reason this is a client component; the navigation content itself
 * is static.
 */
export function SiteHeader() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    function onScroll() {
      /*
       * While the mobile navigation holds the scroll lock the document sits at
       * offset zero, which would otherwise expand the header and shift the
       * page by the difference between its two heights. The state is frozen
       * until the lock is released.
       */
      if (document.body.dataset.scrollLocked === "true") return;
      setCompact(window.scrollY > COMPACT_AT);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-site-header
      data-compact={compact}
      style={
        {
          "--srs-header-current": compact
            ? "var(--srs-header-height-compact)"
            : "var(--srs-header-height)",
        } as CSSProperties
      }
      className={cn(
        "sticky top-0 z-[var(--srs-z-header)] w-full",
        "border-b transition-[height,background-color,border-color,backdrop-filter,box-shadow]",
        "duration-[var(--srs-duration-base)] ease-standard",
        "h-[var(--srs-header-current)]",
        compact
          ? "border-line-hairline bg-bg/85 shadow-[0_1px_0_0_var(--srs-border-hairline),0_16px_32px_-24px_rgb(0_0_0_/_0.55)] backdrop-blur-md"
          : "border-transparent bg-bg shadow-none",
      )}
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <Wordmark />

        <div className="flex items-center gap-2">
          <HeaderNav />

          <div className="hidden lg:block">
            {portalNav.href ? (
              <Button href={portalNav.href} external variant="secondary" size="sm">
                {portalNav.label}
              </Button>
            ) : (
              <Button pending={portalNav.pending ?? ""} variant="secondary" size="sm">
                {portalNav.label}
              </Button>
            )}
          </div>

          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
