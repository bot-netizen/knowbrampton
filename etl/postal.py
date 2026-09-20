"""Postal code -> ward, as far as public data allows.

Full six-character postal codes are licensed by Canada Post and are not
redistributable, so there is no free code-to-point table. What IS public is
StatCan's Forward Sortation Area boundaries - the first three characters, e.g.
L6P. So the lookup answers at FSA level, honestly labelled.

In Brampton that is often enough to be useful anyway, because wards are paired:
if an FSA sits inside a single ward pair, the postal code alone already settles
every race on the ballot, since both councillors are elected by the pair.

The share per ward is weighted by real address points, not by area, so a sliver
of an FSA crossing a ward line does not read as an even split.
"""
from __future__ import annotations

import json
import urllib.parse
from collections import defaultdict
from typing import Any

from .common import DATA, get, write_json

FSA_SERVICE = (
    "https://services.arcgis.com/wjcPoefzjpzCgffS/arcgis/rest/services/"
    "Forward_Sortation_Area_(FSA)_Boundaries_2021/FeatureServer/0"
)
# Brampton sits in the L6 and L7 ranges; the point test decides what actually counts.
FSA_WHERE = "CFSAUID LIKE 'L6%' OR CFSAUID LIKE 'L7%'"
# Below this share of an FSA's addresses, a ward is boundary noise rather than a
# real part of it.
MIN_SHARE = 0.02
# An FSA with a handful of Brampton addresses is a neighbouring one grazing the
# border (L7C is Caledon), not a Brampton postal code.
MIN_ADDRESSES = 250


def _fsa_polygons() -> list[tuple[str, list[list[list[float]]], tuple[float, float, float, float]]]:
    params = {"where": FSA_WHERE, "outFields": "CFSAUID", "returnGeometry": "true", "f": "geojson"}
    data = json.loads(get(f"{FSA_SERVICE}/query?" + urllib.parse.urlencode(params)))
    out = []
    for f in data.get("features", []):
        code = f["properties"].get("CFSAUID")
        geom = f.get("geometry") or {}
        polys = [geom["coordinates"]] if geom.get("type") == "Polygon" else geom.get("coordinates", [])
        rings = [ring for poly in polys for ring in poly]
        if not code or not rings:
            continue
        xs = [p[0] for r in rings for p in r]
        ys = [p[1] for r in rings for p in r]
        out.append((code, rings, (min(xs), min(ys), max(xs), max(ys))))
    return out


def _inside(x: float, y: float, ring: list[list[float]]) -> bool:
    inside = False
    n = len(ring)
    for i in range(n):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1:
            inside = not inside
    return inside


def _pairs() -> dict[str, str]:
    data = json.loads((DATA / "ward_pairs.json").read_text(encoding="utf-8"))
    return {w: pair for pair, members in data.items() for w in members}


def run(points: list[dict[str, Any]]) -> dict[str, Any]:
    print("postal (FSA)")
    fsas = _fsa_polygons()
    ward_pair = _pairs()

    counts: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    matched = 0
    for p in points:
        lat, lng = p.get("lat"), p.get("lng")
        if lat is None or lng is None:
            continue
        for code, rings, (minx, miny, maxx, maxy) in fsas:
            if not (minx <= lng <= maxx and miny <= lat <= maxy):
                continue
            if any(_inside(lng, lat, ring) for ring in rings):
                counts[code][p["ward"]] += 1
                matched += 1
                break

    table: dict[str, Any] = {}
    for code, wards in sorted(counts.items()):
        total = sum(wards.values())
        if total < MIN_ADDRESSES:
            continue
        keep = {w: n for w, n in wards.items() if n / total >= MIN_SHARE}
        if not keep:
            continue
        ordered = sorted(keep, key=lambda w: -keep[w])
        pairs = sorted({ward_pair.get(w, w) for w in ordered})
        table[code] = {
            "wards": [int(w) for w in ordered],
            "pairs": pairs,
            # One pair means the postal code already settles the whole ballot.
            "decisive": len(pairs) == 1,
            "share": {w: round(keep[w] / total, 3) for w in ordered},
            "addresses": total,
        }

    write_json(
        "fsa_wards.json",
        table,
        source=FSA_SERVICE,
        note=f"{matched} address points assigned to {len(table)} FSAs; wards under {MIN_SHARE:.0%} share dropped as boundary noise",
    )
    decisive = sum(1 for v in table.values() if v["decisive"])
    return {
        "fsas": len(table),
        "decisive_on_pair": decisive,
        "ambiguous": len(table) - decisive,
        "assigned": matched,
    }
