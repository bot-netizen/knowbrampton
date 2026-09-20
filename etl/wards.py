"""Ward polygons: pull, derive the pairings, simplify for the browser."""
from __future__ import annotations

import math
import re
from typing import Any

from .common import BRAMPTON_ARCGIS, arcgis_query, write_json

SERVICE = "Planning_Local_Government"
LAYER = 3
SOURCE = f"{BRAMPTON_ARCGIS}/{SERVICE}/FeatureServer/{LAYER}"


def _ward_number(text: str) -> str:
    m = re.search(r"(\d+)", text or "")
    return m.group(1) if m else ""


def _pair_from_electoral_area(ward: str, electoral_area: str) -> str:
    """'WARD 5 IS COMBINED WITH WARD 1...' -> '1+5'. Derived, never hardcoded."""
    others = [n for n in re.findall(r"WARD\s+(\d+)", electoral_area or "") if n != ward]
    members = sorted({ward, *others}, key=int)
    return "+".join(members)


def _simplify(ring: list[list[float]], tolerance_deg: float) -> list[list[float]]:
    """Cheap vertex decimation. Keeps first/last so the ring stays closed."""
    if len(ring) <= 5:
        return ring
    out = [ring[0]]
    for pt in ring[1:-1]:
        prev = out[-1]
        if abs(pt[0] - prev[0]) + abs(pt[1] - prev[1]) > tolerance_deg:
            out.append(pt)
    out.append(ring[0])
    return out


def _rings(geom: dict[str, Any]) -> list[list[list[list[float]]]]:
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    return geom["coordinates"]


def _point_in_ring(x: float, y: float, ring: list[list[float]]) -> bool:
    inside = False
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
        if (y1 > y) != (y2 > y):
            if x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1:
                inside = not inside
    return inside


def _label_point(rings: list[list[list[float]]]) -> list[float]:
    """Pole-of-inaccessibility-ish: grid scan the biggest ring, take the point
    furthest from any edge. A plain centroid lands outside these ward shapes."""
    ring = max(rings, key=len)
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    best: tuple[float, list[float]] | None = None
    steps = 36
    for i in range(steps):
        for j in range(steps):
            px = min(xs) + (max(xs) - min(xs)) * (i + 0.5) / steps
            py = min(ys) + (max(ys) - min(ys)) * (j + 0.5) / steps
            if not _point_in_ring(px, py, ring):
                continue
            d = min(
                math.dist((px, py), (ring[k][0], ring[k][1])) for k in range(0, len(ring), 3)
            )
            if best is None or d > best[0]:
                best = (d, [round(px, 6), round(py, 6)])
    return best[1] if best else [round(sum(xs) / len(xs), 6), round(sum(ys) / len(ys), 6)]


def run(tolerance_deg: float = 0.00035) -> dict[str, str]:
    print("wards")
    raw = arcgis_query(SERVICE, LAYER, geometry=True, fmt="geojson")

    features = []
    pairs: dict[str, list[str]] = {}
    for feat in raw["features"]:
        props = feat["properties"]
        ward = _ward_number(props.get("WARD", ""))
        if not ward:
            continue
        pair = _pair_from_electoral_area(ward, props.get("ELECTORAL_AREA", ""))
        pairs.setdefault(pair, []).append(ward)

        geom = feat["geometry"]
        simplified = [
            [_simplify(ring, tolerance_deg) for ring in poly] for poly in _rings(geom)
        ]
        flat = [r for poly in simplified for r in poly]
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "ward": ward,
                    "pair": pair,
                    "label_point": _label_point(flat),
                },
                "geometry": {"type": "MultiPolygon", "coordinates": simplified},
            }
        )

    features.sort(key=lambda f: int(f["properties"]["ward"]))
    write_json(
        "wards.geojson",
        {"type": "FeatureCollection", "features": features},
        source=SOURCE,
        note=f"simplified at {tolerance_deg} degrees for browser point-in-polygon",
    )

    pair_index = {p: sorted(set(w), key=int) for p, w in sorted(pairs.items())}
    write_json(
        "ward_pairs.json",
        pair_index,
        source=SOURCE,
        note="derived from the ELECTORAL_AREA text, not hardcoded",
    )
    return {"pairs": ", ".join(pair_index)}
