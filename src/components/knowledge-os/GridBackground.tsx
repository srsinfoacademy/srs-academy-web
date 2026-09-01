import { cn } from "@/lib/cn";

type GridBackgroundProps = {
  /** Cell size in px; the grid is intentionally coarse and structural. */
  size?: number;
  /** Fades the grid out towards the given edge. */
  fade?: "bottom" | "top" | "radial" | "none";
  strong?: boolean;
  className?: string;
};

const fadeMask: Record<NonNullable<GridBackgroundProps["fade"]>, string | undefined> = {
  none: undefined,
  bottom: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
  top: "linear-gradient(to top, black 0%, black 55%, transparent 100%)",
  radial: "radial-gradient(ellipse 80% 70% at 50% 35%, black 30%, transparent 100%)",
};

/**
 * The structural grid underlying Knowledge OS surfaces. Pure CSS gradients —
 * no image, no DOM cost, no layout impact.
 */
export function GridBackground({
  size = 72,
  fade = "bottom",
  strong = false,
  className,
}: GridBackgroundProps) {
  const line = strong ? "var(--srs-grid-line-strong)" : "var(--srs-grid-line)";
  const mask = fadeMask[fade];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
