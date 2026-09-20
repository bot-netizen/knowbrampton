"""Run the whole pipeline. Safe to re-run; every output is rewritten atomically."""
from __future__ import annotations

import sys

from . import candidates, council, polls, wards
from .common import flush_manifest


def main() -> int:
    print("Know Brampton ETL\n")
    summary = {}
    failed = []

    for name, fn in (
        ("wards", wards.run),
        ("polls", polls.run),
        ("council", council.run),
        ("candidates", candidates.run),
    ):
        try:
            summary[name] = fn() or {}
        except Exception as exc:  # noqa: BLE001 - one bad source must not kill the rest
            failed.append(name)
            print(f"  !! {name} FAILED: {exc}")

    flush_manifest()

    print("\nsummary")
    for name, info in summary.items():
        if info:
            print(f"  {name}: {info}")
    if failed:
        print(f"\n  FAILED: {', '.join(failed)}")
        return 1
    print("\n  all sources ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
