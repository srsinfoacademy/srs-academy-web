import type { ElementType, ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type SectionSpacing = "tight" | "default" | "loose" | "none";
type SectionSurface = "base" | "surface-1" | "surface-2";

const spacingClass: Record<SectionSpacing, string> = {
  none: "",
  tight: "py-[var(--srs-section-tight)]",
  default: "py-[var(--srs-section)]",
  loose: "py-[var(--srs-section-loose)]",
};

const surfaceClass: Record<SectionSurface, string> = {
  base: "bg-bg",
  "surface-1": "bg-surface-1",
  "surface-2": "bg-surface-2",
};

type SectionProps = {
  as?: ElementType;
  spacing?: SectionSpacing;
  surface?: SectionSurface;
  /** Hairline rule above the section, used to articulate structural bands. */
  ruled?: boolean;
  /** Renders children without a Container, for full-bleed compositions. */
  bleed?: boolean;
  containerWidth?: "default" | "narrow" | "wide";
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  children: ReactNode;
};

/**
 * Vertical rhythm primitive. Sections own their spacing and surface so that
 * page compositions never hand-roll padding.
 */
export function Section({
  as: Component = "section",
  spacing = "default",
  surface = "base",
  ruled = false,
  bleed = false,
  containerWidth = "default",
  id,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn(
        "relative",
        spacingClass[spacing],
        surfaceClass[surface],
        ruled && "rule-top",
        className,
      )}
      {...aria}
    >
      {bleed ? children : <Container width={containerWidth}>{children}</Container>}
    </Component>
  );
}
