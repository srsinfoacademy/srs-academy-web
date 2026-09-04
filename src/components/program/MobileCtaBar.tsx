"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Mobile sticky call to action.
 *
 * Appears once the hero CTA has scrolled away, so it never duplicates a
 * button already on screen, and hides again at the foot of the page so it
 * cannot sit over the footer.
 *
 * It is inert to the keyboard while hidden (`hidden` removes it from the tab
 * order), and the page carries bottom padding equal to the bar's height, so
 * it never obscures content or a focused element.
 */
export function MobileCtaBar({
  label,
  href,
  pending,
}: {
  label: string;
  /** Real destination once admissions exists. */
  href?: string;
  /** Placeholder token shown while the destination is unresolved. */
  pending: string;
}) {
  const [visible, setVisible] = useState(false);

  // Publishes this bar's footprint so the floating theme-toggle/back-to-top
  // stack (mounted separately in the route-group layout) can clear it
  // instead of rendering on top of it — see FloatingUtilityControls.tsx.
  // The value matches the h-20 bottom spacer this page already reserves
  // for the same bar; the >=xl clamp lives in globals.css since `xl:!hidden`
  // is what actually removes the bar at that breakpoint.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--srs-mobile-cta-offset",
      visible ? "5rem" : "0px",
    );
    return () => {
      document.documentElement.style.setProperty("--srs-mobile-cta-offset", "0px");
    };
  }, [visible]);

  useEffect(() => {
    const sentinel = document.getElementById("hero-cta-sentinel");
    const end = document.getElementById("program-cta");
    if (!sentinel) return;

    let pastHero = false;
    let atEnd = false;
    const sync = () => setVisible(pastHero && !atEnd);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        sync();
      },
      { threshold: 0 },
    );
    heroObserver.observe(sentinel);

    let endObserver: IntersectionObserver | undefined;
    if (end) {
      endObserver = new IntersectionObserver(
        ([entry]) => {
          // In view, or already scrolled past it — either way the closing CTA
          // has been reached, so the bar stands down rather than floating
          // over the footer.
          atEnd = entry.isIntersecting || entry.boundingClientRect.top < 0;
          sync();
        },
        { threshold: 0 },
      );
      endObserver.observe(end);
    }

    return () => {
      heroObserver.disconnect();
      endObserver?.disconnect();
    };
  }, []);

  return (
    <div
      hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[var(--srs-z-sticky)] xl:!hidden",
        "border-t border-line bg-surface-elevated px-4 py-3 backdrop-blur-md",
      )}
    >
      {href ? (
        <Button href={href} size="md" block>
          {label}
        </Button>
      ) : (
        <Button pending={pending} size="md" block>
          {label}
        </Button>
      )}
    </div>
  );
}
