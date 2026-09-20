"use client";

import { useState } from "react";
import { MAP_H, MAP_W, type WardShape } from "@/lib/wardmap-shared";

type Ring = [number, number][];

function pointInRing(x: number, y: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-12) + xi) inside = !inside;
  }
  return inside;
}

/** Tap a ward, or use the device location. Both resolve entirely on-device:
 *  no address and no coordinates ever leave the browser. */
export default function WardPicker({
  shapes,
  locale,
  labels,
}: {
  shapes: WardShape[];
  locale: string;
  labels: { locate: string; locating: string; notFound: string; tapMap: string; mapLabel: string };
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = (ward: string) => {
    window.location.href = `/${locale}/my-ward/${ward}/`;
  };

  async function locate() {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError(labels.notFound);
      return;
    }
    setBusy(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10_000 }),
      );
      const geo = (await fetch("/data/wards.geojson").then((r) => r.json())) as {
        features: { properties: { ward: string }; geometry: { coordinates: Ring[][] } }[];
      };
      const { longitude: lng, latitude: lat } = pos.coords;
      const hit = geo.features.find((f) =>
        f.geometry.coordinates.some((poly) => poly.some((ring) => pointInRing(lng, lat, ring))),
      );
      if (hit) go(hit.properties.ward);
      else setError(labels.notFound);
    } catch {
      setError(labels.notFound);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button type="button" className="cta" onClick={locate} disabled={busy}>
        {busy ? labels.locating : labels.locate}
      </button>
      {error && (
        <p role="alert" style={{ margin: 0, fontSize: 13.5, color: "var(--crimson)" }}>
          {error}
        </p>
      )}
      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{labels.tapMap}</p>
      <svg
        className="wardmap"
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        style={{ maxWidth: MAP_W }}
        role="group"
        aria-label={labels.mapLabel}
      >
        {shapes.map((s) => (
          <path
            key={s.ward}
            d={s.d}
            fill={s.colour}
            fillOpacity={0.16}
            stroke={s.colour}
            strokeWidth={1.5}
            strokeLinejoin="round"
            tabIndex={0}
            role="link"
            aria-label={`Ward ${s.ward}`}
            onClick={() => go(s.ward)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                go(s.ward);
              }
            }}
          />
        ))}
        {shapes.map((s) => (
          <g key={`l-${s.ward}`} style={{ pointerEvents: "none" }}>
            <circle cx={s.labelX} cy={s.labelY} r={15} fill="#fdfcf9" stroke={s.colour} strokeWidth={1.6} />
            <text
              x={s.labelX}
              y={s.labelY + 5}
              textAnchor="middle"
              fontFamily="var(--font-archivo), sans-serif"
              fontSize={14}
              fontWeight={700}
              fill={s.colour}
            >
              {s.ward}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
