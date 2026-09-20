import type { RoadLabel, RoadPath } from "@/lib/wardmap-shared";

/** Road context, drawn under the ward fills. Three weights so the eye reads a
 *  hierarchy: highways, arterials, everything else. */
export function Roads({ paths }: { paths: RoadPath[] }) {
  const order: RoadPath["kind"][] = ["minor", "major", "highway"];
  const style: Record<RoadPath["kind"], { stroke: string; width: number; opacity: number }> = {
    minor: { stroke: "#c6bdad", width: 0.6, opacity: 0.4 },
    major: { stroke: "#948b7c", width: 1.6, opacity: 0.95 },
    highway: { stroke: "#6f6658", width: 2.8, opacity: 1 },
  };
  return (
    <g aria-hidden="true">
      {order.map((kind) => (
        <g key={kind} fill="none" strokeLinecap="round" strokeLinejoin="round" {...style[kind]}>
          {paths
            .filter((p) => p.kind === kind)
            .map((p, i) => (
              <path key={`${kind}-${i}`} d={p.d} />
            ))}
        </g>
      ))}
    </g>
  );
}

/** Halo via paint-order so names stay readable over any fill beneath them. */
export function RoadLabels({ labels }: { labels: RoadLabel[] }) {
  return (
    <g aria-hidden="true" style={{ pointerEvents: "none" }}>
      {labels.map((l) => (
        <text
          key={l.name}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          fontFamily="var(--font-archivo), sans-serif"
          fontSize={l.kind === "highway" ? 10.5 : 10}
          fontWeight={l.kind === "highway" ? 700 : 500}
          fill="#514a3d"
          stroke="#f7f4ee"
          strokeWidth={3.2}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {l.name}
        </text>
      ))}
    </g>
  );
}
