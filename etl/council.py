"""Sitting council (2022-2026) and the 2018 poll-level results baseline."""
from __future__ import annotations

from .common import BRAMPTON_ARCGIS, arcgis_query, write_json

SERVICE = "Term_of_Council_Elected_Officials_2022_to_2026"


def run() -> None:
    print("council + history")

    raw = arcgis_query(SERVICE, 0, order_by="District_ID")
    by_person: dict[tuple[str, str], dict] = {}
    for f in raw["features"]:
        a = f["attributes"]
        first = (a.get("First_name") or "").strip()
        last = (a.get("Last_name") or "").strip()
        role = (a.get("Primary_role") or "").strip()
        if not last:
            continue
        key = (f"{first} {last}".strip(), role)
        entry = by_person.setdefault(
            key,
            {
                "name": key[0],
                "role": role,
                "wards": [],
                "email": (a.get("Email") or "").strip() or None,
                "phone": (a.get("Phone") or "").strip() or None,
                "photo_url": (a.get("Photo_URL") or "").strip() or None,
                "page_url": (a.get("Source_URL") or "").strip() or None,
            },
        )
        # The layer repeats a councillor once per ward; collapse to the pair.
        district = a.get("District_ID")
        if district and str(district) not in entry["wards"]:
            entry["wards"].append(str(district))

    council = sorted(
        by_person.values(),
        key=lambda r: (0 if r["role"] == "Mayor" else 1, int(r["wards"][0]) if r["wards"] else 0, r["role"]),
    )
    for row in council:
        row["wards"].sort(key=int)
        row["pair"] = "+".join(row["wards"]) if row["wards"] else None

    write_json(
        "council_current.json",
        council,
        source=f"{BRAMPTON_ARCGIS}/{SERVICE}/FeatureServer/0",
        note="2022-2026 term; layer repeats each councillor per ward, collapsed here to ward pairs",
    )

    # 2018 results, per candidate per voting location. Our turnout/swing baseline.
    raw = arcgis_query("2018_Election_Results", 0)
    rows = [
        {
            "office": (f["attributes"].get("Office") or "").strip(),
            "candidate": (f["attributes"].get("Candidate_Name") or "").strip(),
            "poll_id": (f["attributes"].get("Voting_Location_ID") or "").strip(),
            "poll_name": (f["attributes"].get("Voting_Location_Name") or "").strip(),
            "votes": f["attributes"].get("Number_of_Votes"),
        }
        for f in raw["features"]
    ]
    write_json(
        "results_2018.json",
        rows,
        source=f"{BRAMPTON_ARCGIS}/2018_Election_Results/FeatureServer/0",
        note="poll-level results; 2022 official results are PDF only and not yet parsed",
    )
