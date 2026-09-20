/** Project the real ward polygons to SVG paths at build time.
 *  Equirectangular with a cos(lat) correction — fine at city scale. */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { MAP_H, MAP_W, PAIR_COLOURS, type WardShape } from "./wardmap-shared";

export { MAP_H, MAP_W, PAIR_COLOURS };
export type { WardShape };

type Ring = [number, number][];

export function wardShapes(): WardShape[] {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "..", "data", "wards.geojson"), "utf-8"),
  ) as {
    features: {
      properties: { ward: string; pair: string; label_point: [number, number] };
      geometry: { coordinates: Ring[][] };
    }[];
  };

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const f of raw.features) {
    for (const poly of f.geometry.coordinates) {
      for (const ring of poly) {
        for (const [x, y] of ring) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }
  const latm = Math.cos((((minY + maxY) / 2) * Math.PI) / 180);
  const scale = Math.min((MAP_W / ((maxX - minX) * latm)), MAP_H / (maxY - minY));
  const offX = (MAP_W - (maxX - minX) * latm * scale) / 2;
  const offY = (MAP_H - (maxY - minY) * scale) / 2;
  const px = (x: number, y: number): [number, number] => [
    (x - minX) * latm * scale + offX,
    MAP_H - offY - (y - minY) * scale,
  ];

  return raw.features.map((f) => {
    const parts: string[] = [];
    for (const poly of f.geometry.coordinates) {
      for (const ring of poly) {
        if (ring.length < 4) continue;
        parts.push(
          "M" + ring.map(([x, y]) => px(x, y).map((n) => n.toFixed(1)).join(",")).join(" L") + "Z",
        );
      }
    }
    const [lx, ly] = px(f.properties.label_point[0], f.properties.label_point[1]);
    return {
      ward: f.properties.ward,
      pair: f.properties.pair,
      colour: PAIR_COLOURS[f.properties.pair] ?? "#5c564b",
      d: parts.join(" "),
      labelX: Number(lx.toFixed(1)),
      labelY: Number(ly.toFixed(1)),
    };
  });
}
