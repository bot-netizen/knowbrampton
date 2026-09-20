"""Street address -> ward index.

Full six-character Canadian postal codes are licensed by Canada Post and are not
freely redistributable, and OpenStreetMap carries them for under 1% of Brampton
addresses. So the lookup is built on street addresses instead, from Peel's
Address_Points layer: 207k points that already carry the municipal ward.

The browser cannot download 207k points, so this compresses to one entry per
street. Most Brampton streets sit entirely inside one ward, which collapses to a
single number; the rest carry house-number ranges.
"""
from __future__ import annotations

import json
import re
import urllib.parse
from collections import defaultdict
from typing import Any

from .common import PEEL_ARCGIS, get, write_json

SERVICE = "Address_Points"
PAGE = 2000
WHERE = "MUNICIPALITY='Brampton' AND WARD IS NOT NULL"
FIELDS = "STREETNUM,STREETNAME,STREETTYPE,STREETDIRECTION,WARD,LATITUDE,LONGITUDE"

# Peel writes 39 street types, and its own spellings are canonical here: the
# index keys come from this layer, so user input has to fold onto Peel's codes,
# not onto some tidier set of our own. PKY, not PKWY. LANE, not LN.
TYPE_ALIASES = {
    "AV": "AVE", "AVENUE": "AVE",
    "BV": "BLVD", "BOULEVARD": "BLVD",
    "CIRCLE": "CIR",
    "CR": "CRES", "CRESCENT": "CRES",
    "CT": "CRT", "COURT": "CRT",
    "DRIVE": "DR",
    "GARDEN": "GDNS", "GARDENS": "GDNS",
    "HEIGHTS": "HTS",
    "HIGHWAY": "HWY", "HY": "HWY",
    "LANDING": "LANDNG",
    "LN": "LANE",
    "LOOKOUT": "LKOUT",
    "PARKWAY": "PKY", "PKWY": "PKY", "PY": "PKY",
    "PLACE": "PL",
    "POINT": "PT", "POINTE": "PT",
    "ROAD": "RD",
    "SQUARE": "SQ",
    "STREET": "ST",
    "TERRACE": "TERR", "TER": "TERR",
    "TR": "TRAIL",
    "GT": "GATE",
}

LONG_DIRECTIONS = {"NORTH": "N", "SOUTH": "S", "EAST": "E", "WEST": "W"}
SHORT_DIRECTIONS = {"N", "S", "E", "W", "NE", "NW", "SE", "SW"}


def normalise(street: str) -> str:
    """Fold a typed street to a lookup key: 'Sandalwood Pky E.' -> 'SANDALWOOD PKWY E'.

    The direction has to come off first: with it attached, the street type sits
    second-to-last and never gets expanded, so Peel's 'SANDALWOOD PY E' and a
    reader's 'Sandalwood Pkwy E' hash to different keys and the lookup misses.
    """
    s = re.sub(r"[^A-Za-z0-9 ]+", " ", (street or "").upper())
    parts = [p for p in s.split() if p]
    if not parts:
        return ""

    direction = ""
    last = parts[-1]
    if last in LONG_DIRECTIONS:
        direction = LONG_DIRECTIONS[last]
        parts.pop()
    elif last in SHORT_DIRECTIONS and len(parts) > 1:
        direction = last
        parts.pop()

    if parts:
        parts[-1] = TYPE_ALIASES.get(parts[-1], parts[-1])
    if direction:
        parts.append(direction)
    return " ".join(parts)


def _page(offset: int) -> dict[str, Any]:
    params = {
        "where": WHERE,
        "outFields": FIELDS,
        "returnGeometry": "false",
        "resultOffset": str(offset),
        "resultRecordCount": str(PAGE),
        "orderByFields": "OBJECTID",
        "f": "json",
    }
    url = f"{PEEL_ARCGIS}/{SERVICE}/FeatureServer/0/query?" + urllib.parse.urlencode(params)
    return json.loads(get(url))


def fetch_points() -> list[dict[str, Any]]:
    """Every Brampton address point, once. Both the street index and the postal
    table are built from this, so it is pulled a single time."""
    out: list[dict[str, Any]] = []
    offset = 0

    while True:
        data = _page(offset)
        if "error" in data:
            raise RuntimeError(f"Address_Points page {offset}: {data['error']}")
        feats = data.get("features", [])
        if not feats:
            break
        for f in feats:
            a = f["attributes"]
            ward = str(a.get("WARD") or "").strip()
            if not ward.isdigit():
                continue
            name = " ".join(
                str(p).strip()
                for p in (a.get("STREETNAME"), a.get("STREETTYPE"), a.get("STREETDIRECTION"))
                if p and str(p).strip()
            )
            key = normalise(name)
            if not key:
                continue
            num = re.sub(r"\D", "", str(a.get("STREETNUM") or ""))
            out.append(
                {
                    "key": key,
                    "num": int(num) if num else -1,
                    "ward": ward,
                    "lat": a.get("LATITUDE"),
                    "lng": a.get("LONGITUDE"),
                }
            )
        offset += len(feats)
        if len(feats) < PAGE:
            break
        if offset % 40000 == 0:
            print(f"    {offset:,} points")
    return out


def run(points: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    print("addresses")
    pts = points if points is not None else fetch_points()

    seen: dict[str, dict[str, list[int]]] = defaultdict(lambda: defaultdict(list))
    for p in pts:
        seen[p["key"]][p["ward"]].append(p["num"])
    total = len(pts)

    index: dict[str, Any] = {}
    split = 0
    for street, wards in seen.items():
        if len(wards) == 1:
            index[street] = int(next(iter(wards)))
            continue
        # A street crossing a ward line: store the house-number span per ward so
        # the browser can pick the right side. Ranges can overlap where a street
        # is split mid-block; the first containing range wins, which is why they
        # are sorted by how tight they are.
        split += 1
        ranges = []
        for ward, nums in wards.items():
            real = [n for n in nums if n >= 0]
            if not real:
                continue
            ranges.append([min(real), max(real), int(ward)])
        ranges.sort(key=lambda r: r[1] - r[0])
        index[street] = ranges

    write_json(
        "address_index.json",
        index,
        source=f"{PEEL_ARCGIS}/{SERVICE}/FeatureServer/0",
        note=f"{total} Brampton address points folded into {len(index)} streets; {split} cross a ward line",
    )
    return {"points": total, "streets": len(index), "split_across_wards": split}
