import type { Program } from "@/types/home";

/**
 * Structural motifs for the program preview. Each is a small inline SVG in
 * the Knowledge OS language — no imagery, no gradients.
 */
export function ProgramArt({ type }: { type: Program["visualType"] }) {
  const stroke = "var(--srs-network-line)";
  const accent = "var(--srs-lime)";

  return (
    <svg
      viewBox="0 0 160 90"
      aria-hidden="true"
      focusable="false"
      fill="none"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {type === "grid" ? (
        <g stroke={stroke} strokeWidth={1}>
          {[20, 50, 80, 110, 140].map((x) => (
            <line key={x} x1={x} y1={12} x2={x} y2={78} />
          ))}
          {[22, 45, 68].map((y) => (
            <line key={y} x1={12} y1={y} x2={148} y2={y} />
          ))}
          <rect x={50} y={22} width={30} height={23} fill={accent} opacity={0.9} />
        </g>
      ) : null}

      {type === "nodes" ? (
        <g>
          <g stroke={stroke} strokeWidth={1}>
            <line x1={30} y1={30} x2={80} y2={45} />
            <line x1={130} y1={26} x2={80} y2={45} />
            <line x1={44} y1={70} x2={80} y2={45} />
            <line x1={120} y1={68} x2={80} y2={45} />
          </g>
          <circle cx={80} cy={45} r={7} fill={accent} />
          {[
            [30, 30],
            [130, 26],
            [44, 70],
            [120, 68],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.5} fill={accent} opacity={0.55} />
          ))}
        </g>
      ) : null}

      {type === "signals" ? (
        <g stroke={stroke} strokeWidth={1}>
          {[18, 34, 50, 66].map((y, i) => (
            <line key={y} x1={12} y1={y} x2={i % 2 ? 110 : 148} y2={y} />
          ))}
          <line x1={12} y1={82} x2={92} y2={82} stroke={accent} strokeWidth={2} />
        </g>
      ) : null}

      {type === "direction" ? (
        <g stroke={stroke} strokeWidth={1}>
          <path d="M14 74 L58 50 L102 58 L146 20" />
          <circle cx={146} cy={20} r={5} fill={accent} stroke="none" />
          {[14, 58, 102].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={[74, 50, 58][i]}
              r={3}
              fill={accent}
              opacity={0.5}
              stroke="none"
            />
          ))}
        </g>
      ) : null}

      {type === "modular" ? (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={14 + (i % 3) * 46}
              y={20 + Math.floor(i / 3) * 32}
              width={36}
              height={22}
              stroke={stroke}
              strokeWidth={1}
              fill={i === 1 ? accent : "none"}
              opacity={i === 1 ? 0.9 : 1}
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
}
