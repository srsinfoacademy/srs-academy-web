"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { usePointerProximity } from "@/lib/usePointerProximity";

/**
 * Wraps the Student Portal teaser's conceptual layers with a restrained
 * pointer-proximity shift. Desktop (>1024px) only, and the hook itself never
 * attaches under reduced motion or on touch — see usePointerProximity. Each
 * layer moves at most ±3px, preserving z-order and never rotating.
 */
export function PortalLayers({ children }: { children: ReactNode }) {
  const ref = usePointerProximity<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "relative mx-auto h-[220px] w-full max-w-md sm:h-[300px] lg:h-[340px]",
      )}
      style={{ "--proximity-x": 0, "--proximity-y": 0 } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** One layer of the teaser stack; `depth` scales how far it answers the pointer. */
export function PortalLayer({
  depth,
  className,
  style,
}: {
  depth: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "transition-transform duration-[var(--srs-duration-fast)] ease-standard",
        className,
      )}
      style={{
        ...style,
        transform:
          "translate3d(calc(var(--proximity-x, 0) * " +
          depth +
          "px), calc(var(--proximity-y, 0) * " +
          depth +
          "px), 0)",
      }}
    />
  );
}
