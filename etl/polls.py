"""Voting locations: election-day polls, advance polls, and poll subdivisions."""
from __future__ import annotations

from .common import BRAMPTON_ARCGIS, arcgis_query, write_json


def _clean(value):
    return value.strip() if isinstance(value, str) else value


def run() -> None:
    print("polls")

    # Election day: 148 locations, voters must attend their assigned one.
    raw = arcgis_query("2026VotingDayLocations_PRD", 0, geometry=True, fmt="geojson")
    day = []
    for f in raw["features"]:
        p = f["properties"]
        coords = (f.get("geometry") or {}).get("coordinates")
        day.append(
            {
                "name": _clean(p.get("LOCATION_NAME")),
                "address": _clean(p.get("ADDRESS")),
                "ward": _clean(p.get("WARD")),
                "facility_type": _clean(p.get("FACILITY_TYPE")),
                "accessible": p.get("ACCESSIBLE"),
                "lng": round(coords[0], 6) if coords else None,
                "lat": round(coords[1], 6) if coords else None,
            }
        )
    day.sort(key=lambda r: (int(r["ward"] or 0), r["name"] or ""))
    write_json(
        "polls_voting_day.json",
        day,
        source=f"{BRAMPTON_ARCGIS}/2026VotingDayLocations_PRD/FeatureServer/0",
        note="election day 2026-10-26; assigned poll only",
    )

    # Advance: 10 locations, any voter may use any of them.
    raw = arcgis_query("2026AdvanceVotingLocations_PRD", 0, geometry=True, fmt="geojson")
    advance = []
    for f in raw["features"]:
        p = f["properties"]
        coords = (f.get("geometry") or {}).get("coordinates")
        sessions = [
            _clean(p.get(f"DATE_AND_TIME_{i}")) for i in range(1, 6) if _clean(p.get(f"DATE_AND_TIME_{i}"))
        ]
        advance.append(
            {
                "name": _clean(p.get("FACILITY_NAME")),
                "address": _clean(p.get("ADDRESS")),
                "ward": _clean(p.get("WARD")),
                "sessions": sessions,
                # WAIT_TIME is populated by the City only while polls are open.
                "wait_time": _clean(p.get("WAIT_TIME")),
                "lng": round(coords[0], 6) if coords else None,
                "lat": round(coords[1], 6) if coords else None,
            }
        )
    advance.sort(key=lambda r: int(r["ward"] or 0))
    write_json(
        "polls_advance.json",
        advance,
        source=f"{BRAMPTON_ARCGIS}/2026AdvanceVotingLocations_PRD/FeatureServer/0",
        note="advance voting 9,10,11,16,17 Oct 2026; any location, any ward. WAIT_TIME is live only on voting days",
    )

    # Poll subdivisions - lets us map 2018 results onto geography later.
    raw = arcgis_query("Brampton_Elections", 0)
    subs = [
        {
            "poll_id": _clean(f["attributes"].get("POLL_ID")),
            "ward": f["attributes"].get("WARD"),
            "subdivision": _clean(f["attributes"].get("SUBDIVISION")),
            "name": _clean(f["attributes"].get("LOCATION_NAME")),
            "address": _clean(f["attributes"].get("ADDRESS")),
        }
        for f in raw["features"]
    ]
    write_json(
        "poll_subdivisions.json",
        subs,
        source=f"{BRAMPTON_ARCGIS}/Brampton_Elections/FeatureServer/0",
    )
