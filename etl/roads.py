"""Arterial roads and highways, for map context.

A bare ward polygon tells a resident nothing - people locate themselves by the
big roads. Brampton's own `Roads` layer carries no street names, so the named
arterials come from Peel's regional road network and the highways from the
City's `Highways` layer. Both are clipped to the ward extent.
"""
from __future__ import annotations

import json
import re
from typing import Any

from .common import DATA, PEEL_ARCGIS, arcgis_query, write_json

PAD = 0.004  # a little slack so boundary roads are not clipped mid-stroke

# Peel classifies its centrelines several ways and the big roads are spread
# across all of them: Queen and Steeles carry a REG_ROAD number, the 410 and 407
# are provincial, and Chinguacousy and Sandalwood are "MAJOR ARTERIAL CITY".
# Filtering on any one field silently drops half the road grid.
ARTERIAL_WHERE = (
    "REG_ROAD IS NOT NULL "
    "OR PROVFREEWY IS NOT NULL "
    "OR PROVHIGHWY IS NOT NULL "
    "OR CUR_RDCLS IN ('REGIONAL ARTERIAL', 'MAJOR ARTERIAL CITY', 'MINOR ARTERIAL')"
)

# Road-type abbreviations Peel uses, expanded for display.
ST_TYPES = {
    "RD": "Rd", "ST": "St", "DR": "Dr", "AV": "Ave", "AVE": "Ave", "BV": "Blvd",
    "BLVD": "Blvd", "PY": "Pkwy", "PKY": "Pkwy", "CR": "Cres", "CT": "Crt",
    "LN": "Lane", "TR": "Trail", "WY": "Way", "SR": "Sdrd", "HY": "Hwy",
}


def _road_name(attrs: dict[str, Any]) -> str:
    """'QUEEN' + 'ST' + 'W' -> 'Queen St W'. Highways keep their number."""
    freeway = (attrs.get("PROVFREEWY") or attrs.get("PROVHIGHWY") or "").strip()
    name = (attrs.get("ST_NAME") or "").strip()
    if freeway and (not name or name.isdigit()):
        return f"Hwy {freeway}"
    if not name:
        return ""
    if name.isdigit():
        return f"Hwy {name}"
    # .title() lowercases the L in McLaughlin and McVean.
    pretty = re.sub(r"\bMc([a-z])", lambda m: "Mc" + m.group(1).upper(), name.title())
    st_type = ST_TYPES.get((attrs.get("ST_TYPE") or "").strip().upper(), "")
    direction = (attrs.get("ST_DIR") or "").strip().upper()
    return " ".join(part for part in (pretty, st_type, direction) if part)


def _ward_bbox() -> tuple[float, float, float, float]:
    gj = json.loads((DATA / "wards.geojson").read_text(encoding="utf-8"))
    xs: list[float] = []
    ys: list[float] = []
    for f in gj["features"]:
        for poly in f["geometry"]["coordinates"]:
            for ring in poly:
                for x, y in ring:
                    xs.append(x)
                    ys.append(y)
    return min(xs) - PAD, min(ys) - PAD, max(xs) + PAD, max(ys) + PAD


def _ward_rings() -> list[list[list[float]]]:
    """Every ward ring, for testing whether a road is actually in Brampton."""
    gj = json.loads((DATA / "wards.geojson").read_text(encoding="utf-8"))
    rings: list[list[list[float]]] = []
    for f in gj["features"]:
        for poly in f["geometry"]["coordinates"]:
            rings.extend(poly)
    return rings


def _in_brampton(pt: list[float], rings: list[list[list[float]]]) -> bool:
    x, y = pt[0], pt[1]
    for ring in rings:
        inside = False
        n = len(ring)
        for i in range(n):
            x1, y1 = ring[i][0], ring[i][1]
            x2, y2 = ring[(i + 1) % n][0], ring[(i + 1) % n][1]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / ((y2 - y1) or 1e-12) + x1:
                inside = not inside
        if inside:
            return True
    return False


def _lines(geom: dict[str, Any]) -> list[list[list[float]]]:
    if geom["type"] == "LineString":
        return [geom["coordinates"]]
    if geom["type"] == "MultiLineString":
        return geom["coordinates"]
    return []


def _clip(line: list[list[float]], box: tuple[float, float, float, float]) -> list[list[list[float]]]:
    """Split a line into the runs of points that fall inside the bbox."""
    minx, miny, maxx, maxy = box
    runs: list[list[list[float]]] = []
    current: list[list[float]] = []
    for pt in line:
        x, y = pt[0], pt[1]
        if minx <= x <= maxx and miny <= y <= maxy:
            current.append([round(x, 6), round(y, 6)])
        elif current:
            runs.append(current)
            current = []
    if current:
        runs.append(current)
    return [r for r in runs if len(r) >= 2]


def _simplify(line: list[list[float]], tol: float) -> list[list[float]]:
    if len(line) <= 3:
        return line
    out = [line[0]]
    for pt in line[1:-1]:
        if abs(pt[0] - out[-1][0]) + abs(pt[1] - out[-1][1]) > tol:
            out.append(pt)
    out.append(line[-1])
    return out


def run(tol: float = 0.0006) -> dict[str, Any]:
    print("roads")
    box = _ward_bbox()
    rings = _ward_rings()
    features: list[dict[str, Any]] = []
    dropped = 0

    # Peel's centrelines, filtered to the roads people navigate by.
    raw = arcgis_query(
        "Street_Centre_Line",
        0,
        base=PEEL_ARCGIS,
        where=ARTERIAL_WHERE,
        out_fields="ST_NAME,ST_TYPE,ST_DIR,REG_ROAD,PROVFREEWY,PROVHIGHWY,CUR_RDCLS",
        geometry=True,
        fmt="geojson",
    )
    for f in raw["features"]:
        attrs = f["properties"]
        name = _road_name(attrs)
        if not name:
            continue
        is_hwy = bool(attrs.get("PROVFREEWY") or attrs.get("PROVHIGHWY"))
        major = is_hwy or attrs.get("REG_ROAD") or attrs.get("CUR_RDCLS") in (
            "REGIONAL ARTERIAL",
            "MAJOR ARTERIAL CITY",
        )
        for line in _lines(f["geometry"]):
            for run_ in _clip(line, box):
                simple = _simplify(run_, tol)
                if len(simple) < 2:
                    continue
                if not any(_in_brampton(pt, rings) for pt in simple[:: max(1, len(simple) // 6)]):
                    dropped += 1
                    continue
                if True:
                    features.append(
                        {
                            "type": "Feature",
                            "properties": {
                                "name": name,
                                "kind": "highway" if is_hwy else ("major" if major else "minor"),
                            },
                            "geometry": {"type": "LineString", "coordinates": simple},
                        }
                    )

    write_json(
        "roads.geojson",
        {"type": "FeatureCollection", "features": features},
        source=f"{PEEL_ARCGIS}/Street_Centre_Line",
        note="clipped to the ward extent and simplified; map context only",
    )
    names = sorted({f["properties"]["name"] for f in features})
    return {
        "segments": len(features),
        "named": len(names),
        "dropped_outside_brampton": dropped,
        "roads": names,
    }
