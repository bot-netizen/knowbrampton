/** Address and postal-code resolution. Pure functions, no I/O, so the browser
 *  can run them against the shipped tables and nothing leaves the device. */

export type StreetIndex = Record<string, number | [number, number, number][]>;
export interface FsaEntry {
  wards: number[];
  pairs: string[];
  decisive: boolean;
  share: Record<string, number>;
  addresses: number;
}
export type FsaTable = Record<string, FsaEntry>;

/** Must match etl/addresses.py normalise(): Peel's own codes are canonical. */
const TYPE_ALIASES: Record<string, string> = {
  AV: "AVE", AVENUE: "AVE",
  BV: "BLVD", BOULEVARD: "BLVD",
  CIRCLE: "CIR",
  CR: "CRES", CRESCENT: "CRES",
  CT: "CRT", COURT: "CRT",
  DRIVE: "DR",
  GARDEN: "GDNS", GARDENS: "GDNS",
  HEIGHTS: "HTS",
  HIGHWAY: "HWY", HY: "HWY",
  LANDING: "LANDNG",
  LN: "LANE",
  LOOKOUT: "LKOUT",
  PARKWAY: "PKY", PKWY: "PKY", PY: "PKY",
  PLACE: "PL",
  POINT: "PT", POINTE: "PT",
  ROAD: "RD",
  SQUARE: "SQ",
  STREET: "ST",
  TERRACE: "TERR", TER: "TERR",
  TR: "TRAIL",
  GT: "GATE",
};
const LONG_DIR: Record<string, string> = { NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W" };
const SHORT_DIR = new Set(["N", "S", "E", "W", "NE", "NW", "SE", "SW"]);

export function normaliseStreet(street: string): string {
  const parts = (street || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "";

  let direction = "";
  const last = parts[parts.length - 1];
  if (LONG_DIR[last]) {
    direction = LONG_DIR[last];
    parts.pop();
  } else if (SHORT_DIR.has(last) && parts.length > 1) {
    direction = last;
    parts.pop();
  }
  if (parts.length) {
    parts[parts.length - 1] = TYPE_ALIASES[parts[parts.length - 1]] ?? parts[parts.length - 1];
  }
  if (direction) parts.push(direction);
  return parts.join(" ");
}

/** Index keys are SHOUTED because that is how Peel stores them. Title-case for
 *  display, keeping the direction suffix and Mc names right. */
export function prettyStreet(key: string): string {
  return key
    .split(" ")
    .map((w) =>
      w.length <= 2 && /^[NSEW]{1,2}$/.test(w)
        ? w
        : w.charAt(0) + w.slice(1).toLowerCase(),
    )
    .join(" ")
    .replace(/\bMc([a-z])/g, (_, c: string) => "Mc" + c.toUpperCase());
}

const POSTAL_RE = /^([A-Z]\d[A-Z])\s*\d?[A-Z]?\d?$/i;

/** "L6P", "L6P 1A1", "l6p1a1" -> "L6P". Anything else -> null. */
export function parseFsa(input: string): string | null {
  const cleaned = (input || "").trim().replace(/\s+/g, " ");
  const m = POSTAL_RE.exec(cleaned);
  return m ? m[1].toUpperCase() : null;
}

/** Split "12 Hanover Rd" into its number and street. A leading number is
 *  optional; without one we can still answer for streets in a single ward. */
export function parseAddress(input: string): { num: number | null; street: string } {
  const trimmed = (input || "").trim().replace(/,.*$/, "");
  const m = /^(\d+)\s*[-\s]\s*(.+)$/.exec(trimmed);
  if (m) return { num: Number(m[1]), street: normaliseStreet(m[2]) };
  return { num: null, street: normaliseStreet(trimmed) };
}

export type Result =
  | { kind: "ward"; ward: number; street?: string; via: "address" | "postal" }
  | { kind: "pair"; fsa: string; pairs: string[]; wards: number[]; share: Record<string, number> }
  | { kind: "ambiguous-street"; street: string; wards: number[] }
  | { kind: "suggest"; suggestions: string[] }
  | { kind: "unknown" };

export function lookupStreet(index: StreetIndex, num: number | null, street: string): Result {
  if (!street) return { kind: "unknown" };
  const entry = index[street];
  if (entry === undefined) {
    return { kind: "suggest", suggestions: suggest(index, street) };
  }
  if (typeof entry === "number") return { kind: "ward", ward: entry, street, via: "address" };

  if (num !== null) {
    // Ranges are sorted tightest-first, so the most specific claim wins where a
    // street is split mid-block and spans overlap.
    const hit = entry.find(([lo, hi]) => num >= lo && num <= hi);
    if (hit) return { kind: "ward", ward: hit[2], street, via: "address" };
  }
  return { kind: "ambiguous-street", street, wards: [...new Set(entry.map((r) => r[2]))].sort((a, b) => a - b) };
}

export function lookupFsa(table: FsaTable, fsa: string): Result {
  const e = table[fsa];
  if (!e) return { kind: "unknown" };
  if (e.decisive && e.wards.length === 1) {
    return { kind: "ward", ward: e.wards[0], via: "postal" };
  }
  return { kind: "pair", fsa, pairs: e.pairs, wards: e.wards, share: e.share };
}

/** Cheap near-miss help: prefix and substring hits, shortest first. */
export function suggest(index: StreetIndex, street: string, limit = 6): string[] {
  const q = street.split(" ")[0];
  if (q.length < 3) return [];
  const keys = Object.keys(index);
  const starts = keys.filter((k) => k.startsWith(q));
  const contains = starts.length >= limit ? [] : keys.filter((k) => !k.startsWith(q) && k.includes(q));
  return [...starts, ...contains].sort((a, b) => a.length - b.length).slice(0, limit);
}

export function resolve(index: StreetIndex, table: FsaTable, input: string): Result {
  const fsa = parseFsa(input);
  if (fsa) return lookupFsa(table, fsa);
  const { num, street } = parseAddress(input);
  return lookupStreet(index, num, street);
}
