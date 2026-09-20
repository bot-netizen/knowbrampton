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

// ── roads ───────────────────────────────────────────────────────────────────
// A ward outline on its own is unreadable: nobody navigates Brampton by shape.
// These are the arterials and highways, drawn underneath the wards so people
// can find themselves by the roads they actually drive.

import type { RoadLabel, RoadPath } from "./wardmap-shared";

interface RoadFeature {
  properties: { name: string; kind: "highway" | "major" | "minor" };
  geometry: { coordinates: [number, number][] };
}

/** Same projection as wardShapes(), derived from the WARD extent so the wards
 *  still fill the frame. Roads reaching past it are clipped by the viewBox. */
function projector() {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "..", "data", "wards.geojson"), "utf-8"),
  ) as { features: { geometry: { coordinates: [number, number][][][] } }[] };

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const f of raw.features)
    for (const poly of f.geometry.coordinates)
      for (const ring of poly)
        for (const [x, y] of ring) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }

  const latm = Math.cos((((minY + maxY) / 2) * Math.PI) / 180);
  const scale = Math.min(MAP_W / ((maxX - minX) * latm), MAP_H / (maxY - minY));
  const offX = (MAP_W - (maxX - minX) * latm * scale) / 2;
  const offY = (MAP_H - (maxY - minY) * scale) / 2;
  return (x: number, y: number): [number, number] => [
    (x - minX) * latm * scale + offX,
    MAP_H - offY - (y - minY) * scale,
  ];
}

/** "Queen St E" and "Queen St W" are one road to a reader. Strip the trailing
 *  direction so the map carries one label per road, not three. */
function labelName(name: string): string {
  return name.replace(/\s+[NSEW]$/, "");
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LABEL_H = 13;
/** Archivo at 10px averages a bit over 5px per character. */
const labelW = (name: string) => name.length * 5.3 + 8;

function overlaps(a: Box, b: Box): boolean {
  return Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
}

export function roadPaths(wards?: WardShape[]): { paths: RoadPath[]; labels: RoadLabel[] } {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "..", "data", "roads.geojson"), "utf-8"),
  ) as { features: RoadFeature[] };
  const px = projector();

  const paths: RoadPath[] = [];
  const roads = new Map<string, { pts: [number, number][]; kind: "highway" | "major"; len: number }>();

  for (const f of raw.features) {
    const pts = f.geometry.coordinates.map(([x, y]) => px(x, y));
    if (pts.length < 2) continue;
    paths.push({
      name: f.properties.name,
      kind: f.properties.kind,
      d: "M" + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L"),
    });

    if (f.properties.kind === "minor") continue;
    const key = labelName(f.properties.name);
    const entry = roads.get(key) ?? { pts: [], kind: f.properties.kind as "highway" | "major", len: 0 };
    entry.pts.push(...pts);
    for (let i = 1; i < pts.length; i++) {
      entry.len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    }
    if (f.properties.kind === "highway") entry.kind = "highway";
    roads.set(key, entry);
  }

  // Ward number badges are placed first and must not be written over.
  const taken: Box[] = (wards ?? []).map((w) => ({ x: w.labelX, y: w.labelY, w: 40, h: 34 }));
  const placed: RoadLabel[] = [];

  const ranked = [...roads.entries()].sort(
    (a, b) => b[1].len * (b[1].kind === "highway" ? 1.25 : 1) - a[1].len * (a[1].kind === "highway" ? 1.25 : 1),
  );

  for (const [name, road] of ranked) {
    if (placed.length >= 22) break;

    // Segments arrive in arbitrary order, so sort along the road's own axis to
    // get a coherent run; otherwise "40% along" is meaningless.
    const xs = road.pts.map((p) => p[0]);
    const ys = road.pts.map((p) => p[1]);
    const horizontal = Math.max(...xs) - Math.min(...xs) >= Math.max(...ys) - Math.min(...ys);
    const ordered = [...road.pts].sort((a, b) => (horizontal ? a[0] - b[0] : a[1] - b[1]));

    const w = labelW(name);
    // Try several points along the road rather than only the middle - otherwise
    // every road that crosses the city stacks its label at the city centre.
    for (const frac of [0.5, 0.34, 0.66, 0.2, 0.8, 0.42, 0.58]) {
      const [x, y] = ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * frac))];
      if (x < w / 2 + 6 || x > MAP_W - w / 2 - 6 || y < 16 || y > MAP_H - 10) continue;
      const box: Box = { x, y, w, h: LABEL_H };
      if (taken.some((t) => overlaps(box, t))) continue;
      taken.push(box);
      placed.push({ name, x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), kind: road.kind });
      break;
    }
  }

  return { paths, labels: placed };
}
