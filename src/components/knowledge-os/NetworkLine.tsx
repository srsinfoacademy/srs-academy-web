import { cn } from "@/lib/cn";

type NetworkLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tone?: "line" | "lime" | "violet";
  /** Draws the connection on load, tracing the network into existence. */
  draw?: boolean;
  delay?: number;
  className?: string;
};

const toneStroke = {
  line: "var(--srs-network-line)",
  lime: "var(--srs-node)",
  violet: "var(--srs-violet)",
} as const;

/** A connection between two nodes. Renders inside an `svg`. */
export function NetworkLine({
  x1,
  y1,
  x2,
  y2,
  tone = "line",
  draw = false,
  delay = 0,
  className,
}: NetworkLineProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={toneStroke[tone]}
      strokeWidth={1}
      strokeLinecap="square"
      pathLength={1}
      className={cn(draw && "kos-line-draw", className)}
      style={draw ? { animationDelay: `${delay}ms` } : undefined}
    />
  );
}
