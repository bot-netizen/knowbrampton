import { Roads, RoadLabels } from "./RoadLayer";
import { MAP_H, MAP_W, type RoadLabel, type RoadPath, type WardShape } from "@/lib/wardmap-shared";

/** Static ward map. `highlight` fills that ward solid and outlines its partner. */
export default function WardMap({
  shapes,
  roads,
  roadLabels,
  highlight,
  partner,
  label,
  width = MAP_W,
}: {
  shapes: WardShape[];
  roads?: RoadPath[];
  roadLabels?: RoadLabel[];
  highlight?: string;
  partner?: string | null;
  label: string;
  width?: number;
}) {
  return (
    <svg
      className="wardmap"
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      style={{ maxWidth: width }}
      role="img"
      aria-label={label}
    >
      <rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#fdfcf9" />
      {roads && <Roads paths={roads} />}
      {shapes.map((s) => {
        const isOn = highlight === s.ward;
        const isPartner = partner === s.ward;
        const muted = highlight && !isOn && !isPartner;
        return (
          <path
            key={s.ward}
            d={s.d}
            fill={muted ? "#8c8472" : s.colour}
            fillOpacity={isOn ? 0.34 : isPartner ? 0.13 : muted ? 0.05 : 0.13}
            stroke={muted ? "#b5ac98" : s.colour}
            strokeWidth={isOn ? 2 : 1.5}
            strokeLinejoin="round"
          />
        );
      })}
      {roadLabels && <RoadLabels labels={roadLabels} />}
      {shapes
        .filter((s) => !highlight || s.ward === highlight || s.ward === partner)
        .map((s) => {
          const isOn = highlight === s.ward;
          return (
            <g key={`l-${s.ward}`}>
              <circle
                cx={s.labelX}
                cy={s.labelY}
                r={15}
                fill={isOn ? s.colour : "#fdfcf9"}
                stroke={s.colour}
                strokeWidth={1.6}
              />
              <text
                x={s.labelX}
                y={s.labelY + 5}
                textAnchor="middle"
                fontFamily="var(--font-archivo), sans-serif"
                fontSize={14}
                fontWeight={700}
                fill={isOn ? "#fff" : s.colour}
              >
                {s.ward}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
