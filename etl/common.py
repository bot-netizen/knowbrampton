"""Shared helpers: HTTP with retry, ArcGIS queries, atomic writes, manifest."""
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

# City of Brampton's public ArcGIS org. No key required.
BRAMPTON_ARCGIS = "https://services3.arcgis.com/rl7ACuZkiFsmDA2g/arcgis/rest/services"
PEEL_ARCGIS = "https://services6.arcgis.com/ONZht79c8QWuX759/arcgis/rest/services"

UA = "KnowBrampton/0.1 (civic information project; contact: hello@knowbrampton.ca)"

_MANIFEST: list[dict[str, Any]] = []


def get(url: str, *, tries: int = 4, timeout: int = 60) -> bytes:
    """GET with linear backoff. Raises on final failure."""
    last: Exception | None = None
    for attempt in range(1, tries + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except Exception as exc:  # noqa: BLE001 - want to retry on anything transient
            last = exc
            if attempt < tries:
                time.sleep(attempt * 2)
    raise RuntimeError(f"GET failed after {tries} tries: {url}") from last


def arcgis_query(
    service: str,
    layer: int = 0,
    *,
    base: str = BRAMPTON_ARCGIS,
    where: str = "1=1",
    out_fields: str = "*",
    geometry: bool = False,
    fmt: str = "json",
    order_by: str | None = None,
) -> dict[str, Any]:
    """Query an ArcGIS FeatureServer layer, paging until the server stops truncating."""
    params = {
        "where": where,
        "outFields": out_fields,
        "returnGeometry": "true" if geometry else "false",
        "f": fmt,
    }
    if order_by:
        params["orderByFields"] = order_by

    url = f"{base}/{service}/FeatureServer/{layer}/query?" + urllib.parse.urlencode(params)
    first = json.loads(get(url))
    if "error" in first:
        raise RuntimeError(f"ArcGIS error on {service}/{layer}: {first['error']}")

    key = "features"
    # Page only when the server says it held records back.
    offset = len(first.get(key, []))
    while first.get("exceededTransferLimit") and offset:
        page_url = url + f"&resultOffset={offset}"
        page = json.loads(get(page_url))
        got = page.get(key, [])
        if not got:
            break
        first[key].extend(got)
        offset += len(got)
        if not page.get("exceededTransferLimit"):
            break
    first.pop("exceededTransferLimit", None)
    return first


def write_json(name: str, payload: Any, *, source: str, note: str = "") -> Path:
    """Write data/<name> atomically and record it in the run manifest."""
    DATA.mkdir(parents=True, exist_ok=True)
    path = DATA / name
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1, sort_keys=False)
        fh.write("\n")
    tmp.replace(path)

    if isinstance(payload, list):
        count = len(payload)
    elif isinstance(payload, dict) and isinstance(payload.get("features"), list):
        count = len(payload["features"])
    elif isinstance(payload, dict):
        count = len(payload)
    else:
        count = 1

    _MANIFEST.append(
        {
            "file": name,
            "records": count,
            "bytes": path.stat().st_size,
            "source": source,
            "note": note,
            "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        }
    )
    print(f"  wrote data/{name:28} {count:>5} records  {path.stat().st_size:>8,} bytes")
    return path


def flush_manifest() -> None:
    """Write the audit trail last, so a partial run is visible as a partial manifest."""
    DATA.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "election_day": "2026-10-26",
        "advance_voting_days": ["2026-10-09", "2026-10-10", "2026-10-11", "2026-10-16", "2026-10-17"],
        "outputs": _MANIFEST,
    }
    with (DATA / "manifest.json").open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    print(f"\n  manifest: {len(_MANIFEST)} outputs")
