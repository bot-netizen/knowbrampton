"""Scrape the City Clerk's certified candidate list.

The field was certified 25 Aug 2026 and is frozen, so this runs rarely - but it
stays a script so the provenance is reproducible rather than hand-typed.
"""
from __future__ import annotations

import html
import re
import unicodedata
from collections import Counter
from typing import Any

from .common import get, write_json

URL = "https://www.brampton.ca/EN/City-Hall/Election/Candidates/Pages/candidateListing.aspx"

# Office headings look like "Councillor, City - Wards 1, 5" or plain "Mayor".
OFFICE_RE = re.compile(
    r"^(Mayor|Councillor,\s*(?:City|Regional)|(?:English|French)\s+(?:Public|Separate)\s+Trustee)",
    re.I,
)
FILING_RE = re.compile(r"Filing Date:\s*([\d/]+)\s*$")


def _text(fragment: str) -> str:
    return html.unescape(re.sub(r"(?s)<[^>]+>", "", fragment)).replace(" ", " ").strip()


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return re.sub(r"-{2,}", "-", value)


def _classify(heading: str) -> dict[str, Any]:
    """Split an office heading into office, body and ward list."""
    wards: list[str] = []
    m = re.search(r"Wards?\s+([\d,\s]+)$", heading)
    body = heading
    if m:
        wards = [w.strip() for w in m.group(1).split(",") if w.strip()]
        body = heading[: m.start()].rstrip(" -–")

    if re.match(r"^Mayor$", body, re.I):
        return {"office": "mayor", "office_label": "Mayor", "board": None, "wards": []}
    if re.match(r"^Councillor,\s*City", body, re.I):
        return {"office": "city_councillor", "office_label": "City Councillor", "board": None, "wards": wards}
    if re.match(r"^Councillor,\s*Regional", body, re.I):
        return {
            "office": "regional_councillor",
            "office_label": "Regional Councillor",
            "board": None,
            "wards": wards,
        }
    board = re.sub(r"^(English|French)\s+(Public|Separate)\s+Trustee,\s*", "", body, flags=re.I).strip()
    return {"office": "trustee", "office_label": "School Trustee", "board": board or body, "wards": wards}


def _split_name(raw: str) -> dict[str, Any]:
    """'Chahal, Taran*' -> court-certified. 'Daljit Singh, -' -> no given name."""
    acclaimed = "(acclaimed)" in raw.lower()
    raw = re.sub(r"\(acclaimed\)", "", raw, flags=re.I).strip()
    court = "*" in raw
    raw = raw.replace("*", "").strip()

    if "," in raw:
        last, first = (part.strip() for part in raw.split(",", 1))
    else:
        last, first = raw.strip(), ""
    if first in {"-", "--", ""}:
        first = ""

    display = f"{first} {last}".strip() if first else last
    return {
        "name": re.sub(r"\s{2,}", " ", display),
        "surname": last,
        "given_name": first or None,
        "acclaimed": acclaimed,
        "court_certified": court,
    }


def run() -> dict[str, Any]:
    print("candidates")
    raw = get(URL).decode("utf-8", errors="replace")
    body = re.sub(r"(?is)<(script|style|nav).*?</\1>", " ", raw)

    records: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    unassigned = 0

    for m in re.finditer(r"(?is)<h3[^>]*>(.*?)</h3>", body):
        text = _text(m.group(1))
        if not text:
            continue

        filing = FILING_RE.search(text)
        if not filing:
            if OFFICE_RE.match(text):
                current = _classify(text)
                current["heading"] = text
            continue

        if current is None:
            unassigned += 1
            continue

        name_part = text[: filing.start()].strip()
        person = _split_name(name_part)
        records.append(
            {
                **person,
                "office": current["office"],
                "office_label": current["office_label"],
                "board": current["board"],
                "wards": current["wards"],
                "pair": "+".join(current["wards"]) if current["wards"] else None,
                "filing_date": filing.group(1),
                "heading": current["heading"],
                # Nothing below is sourced yet. Empty stays visibly empty.
                "positions": [],
                "links": [],
                "sourcing": {"positions_sourced": 0, "contacted": False},
            }
        )

    # Slugs must be unique, stable and readable: two people share a name in this
    # field (Harsimran Singh runs for Regional Councillor and for school trustee),
    # so qualify a collision with the office rather than a bare counter.
    base_counts = Counter(slugify(r["name"]) or slugify(r["surname"]) for r in records)
    used: set[str] = set()
    for rec in records:
        base = slugify(rec["name"]) or slugify(rec["surname"])
        slug = base if base_counts[base] == 1 else f"{base}-{slugify(rec['office'])}"
        stem, n = slug, 2
        while slug in used:
            slug = f"{stem}-{n}"
            n += 1
        used.add(slug)
        rec["slug"] = slug

    counts: dict[str, int] = {}
    for rec in records:
        key = rec["heading"]
        counts[key] = counts.get(key, 0) + 1

    write_json(
        "candidates.json",
        records,
        source=URL,
        note="certified 2026-08-25; field frozen. positions[] intentionally empty until sourced",
    )
    write_json("candidate_counts.json", counts, source=URL, note="sanity check on the scrape")

    dupes = [slug for slug, n in Counter(r["slug"] for r in records).items() if n > 1]
    return {
        "total": len(records),
        "races": len(counts),
        "unassigned": unassigned,
        "duplicate_slugs": dupes,
        "council_seats": sum(1 for r in records if r["office"] != "trustee"),
    }
