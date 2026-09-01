import { cn } from "@/lib/cn";

export type NodeTone = "lime" | "violet" | "idle";

const toneFill: Record<NodeTone, string> = {
  lime: "var(--srs-node)",
  violet: "var(--srs-violet)",
  idle: "var(--srs-node-idle)",
};

type NetworkNodeProps = {
  cx: number;
  cy: number;
  r?: number;
  tone?: NodeTone;
  /** Draws a concentric ring, marking a primary node in the network. */
  halo?: boolean;
  /** Slow breathing pulse; disabled automatically under reduced motion. */
  pulse?: boolean;
  /** Staggers the pulse so a network does not throb in unison. */
  delay?: number;
  className?: string;
};

/** A single node of the Knowledge OS network. Renders inside an `svg`. */
export function NetworkNode({
  cx,
  cy,
  r = 4,
  tone = "lime",
  halo = false,
  pulse = false,
  delay = 0,
  className,
}: NetworkNodeProps) {
  const fill = toneFill[tone];

  return (
    <g className={className}>
      {halo ? (
        <circle
          cx={cx}
          cy={cy}
          r={r * 2.6}
          fill="none"
          stroke={fill}
          strokeWidth={1}
          opacity={0.28}
        />
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        className={cn(pulse && "kos-node-pulse")}
        style={pulse ? { animationDelay: `${delay}ms` } : undefined}
      />
    </g>
  );
}
