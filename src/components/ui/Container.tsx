import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ContainerWidth = "default" | "narrow" | "wide" | "full";

const widthClass: Record<ContainerWidth, string> = {
  default: "max-w-[var(--srs-content-max)]",
  narrow: "max-w-[var(--srs-content-narrow)]",
  wide: "max-w-[var(--srs-content-wide)]",
  full: "max-w-none",
};

type ContainerProps = {
  as?: ElementType;
  width?: ContainerWidth;
  /** Drops the fluid gutter, for nested containers that already have one. */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * The single horizontal measure of the site. One max width, one fluid gutter
 * that scales from 20px on a 360px phone to 56px on desktop.
 */
export function Container({
  as: Component = "div",
  width = "default",
  bleed = false,
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        widthClass[width],
        !bleed && "px-[var(--srs-gutter)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
