import { NetworkLine } from "@/components/knowledge-os/NetworkLine";
import { NetworkNode, type NodeTone } from "@/components/knowledge-os/NetworkNode";
import { cn } from "@/lib/cn";

export type NetworkPoint = {
  id: string;
  x: number;
  y: number;
  tone?: NodeTone;
  r?: number;
  halo?: boolean;
};

export type NetworkEdge = [from: string, to: string];

type KnowledgeNetworkBaseProps = {
  points: NetworkPoint[];
  edges: NetworkEdge[];
  /** SVG user-space dimensions; the graphic scales to its container. */
  width?: number;
  height?: number;
  animate?: boolean;
  className?: string;
};

/**
 * Composable base for every Knowledge OS network graphic. Server-rendered
 * SVG with CSS-driven entrance — no client JavaScript, no canvas, no WebGL.
 *
 * Purely decorative, so the graphic is hidden from assistive technology; any
 * meaning it carries must also exist in the surrounding text.
 */
export function KnowledgeNetworkBase({
  points,
  edges,
  width = 400,
  height = 300,
  animate = false,
  className,
}: KnowledgeNetworkBaseProps) {
  const byId = new Map(points.map((point) => [point.id, point]));

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={cn("pointer-events-none h-full w-full", className)}
    >
      <g>
        {edges.map(([fromId, toId], i) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;

          return (
            <NetworkLine
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              tone={from.tone === "violet" || to.tone === "violet" ? "violet" : "line"}
              draw={animate}
              delay={i * 90}
            />
          );
        })}
      </g>

      <g>
        {points.map((point, i) => (
          <NetworkNode
            key={point.id}
            cx={point.x}
            cy={point.y}
            r={point.r}
            tone={point.tone}
            halo={point.halo}
            pulse={animate}
            delay={i * 260}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * The canonical five-node constellation from the approved design: a central
 * hub with four satellites, one of them violet.
 */
export const constellation: { points: NetworkPoint[]; edges: NetworkEdge[] } = {
  points: [
    { id: "hub", x: 200, y: 150, r: 7, tone: "lime", halo: true },
    { id: "nw", x: 140, y: 120, r: 4, tone: "lime" },
    { id: "ne", x: 260, y: 120, r: 4, tone: "violet" },
    { id: "sw", x: 140, y: 180, r: 4, tone: "lime" },
    { id: "se", x: 260, y: 180, r: 4, tone: "lime" },
  ],
  edges: [
    ["nw", "hub"],
    ["ne", "hub"],
    ["sw", "hub"],
    ["se", "hub"],
  ],
};
