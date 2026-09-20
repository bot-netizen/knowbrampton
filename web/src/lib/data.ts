/** Build-time data access. These files come from `python -m etl.run` and are
 *  committed, so a build is reproducible from the repo alone. */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "..", "data");

function read<T>(file: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, file), "utf-8")) as T;
}

export type Office = "mayor" | "regional_councillor" | "city_councillor" | "trustee";

export interface Candidate {
  name: string;
  surname: string;
  given_name: string | null;
  acclaimed: boolean;
  court_certified: boolean;
  office: Office;
  office_label: string;
  board: string | null;
  wards: string[];
  pair: string | null;
  filing_date: string;
  heading: string;
  positions: unknown[];
  links: unknown[];
  sourcing: { positions_sourced: number; contacted: boolean };
  slug: string;
}

export interface CouncilMember {
  name: string;
  role: string;
  wards: string[];
  pair: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  page_url: string | null;
}

export interface Poll {
  name: string;
  address: string;
  ward: string;
  facility_type?: string | null;
  accessible?: string | null;
  sessions?: string[];
  wait_time?: string | null;
  lng: number | null;
  lat: number | null;
}

export interface Manifest {
  generated_at: string;
  election_day: string;
  advance_voting_days: string[];
  outputs: { file: string; records: number; source: string; note: string; retrieved_at: string }[];
}

export const candidates = () => read<Candidate[]>("candidates.json");
export const council = () => read<CouncilMember[]>("council_current.json");
export const advancePolls = () => read<Poll[]>("polls_advance.json");
export const votingDayPolls = () => read<Poll[]>("polls_voting_day.json");
export const wardPairs = () => read<Record<string, string[]>>("ward_pairs.json");
export const manifest = () => read<Manifest>("manifest.json");

/** The pair a ward belongs to, and the other ward in it. */
export function pairFor(ward: string): { pair: string; partner: string | null } {
  const pairs = wardPairs();
  for (const [pair, members] of Object.entries(pairs)) {
    if (members.includes(ward)) {
      return { pair, partner: members.find((w) => w !== ward) ?? null };
    }
  }
  return { pair: ward, partner: null };
}

export interface WardRace {
  key: Office;
  /** Distinguishes the two trustee races a single ward can sit in. */
  id: string;
  board: string | null;
  candidates: Candidate[];
  holder: string | null;
  scope: string;
}

/** The races a ward actually votes in.
 *
 *  Trustee is deliberately NOT one race: a ward sits inside both an English
 *  public board area and an English separate (Catholic) board area, which have
 *  different boundaries and different candidates. Which one appears on your
 *  ballot depends on how you are registered, so we list them separately rather
 *  than summing them into a single misleading count. */
export function racesForWard(ward: string): {
  ward: string;
  pair: string;
  partner: string | null;
  races: WardRace[];
} {
  const all = candidates();
  const { pair, partner } = pairFor(ward);
  const inPair = (c: Candidate) => c.pair === pair;
  const sitting = council();
  const holder = (role: string) =>
    sitting.find((m) => m.role === role && m.wards.includes(ward))?.name ?? null;

  const races: WardRace[] = [
    {
      key: "mayor",
      id: "mayor",
      board: null,
      candidates: all.filter((c) => c.office === "mayor"),
      holder: sitting.find((m) => m.role === "Mayor")?.name ?? null,
      scope: "city-wide",
    },
    {
      key: "regional_councillor",
      id: "regional",
      board: null,
      candidates: all.filter((c) => c.office === "regional_councillor" && inPair(c)),
      holder: holder("Regional Councillor"),
      scope: pair,
    },
    {
      key: "city_councillor",
      id: "city",
      board: null,
      candidates: all.filter((c) => c.office === "city_councillor" && inPair(c)),
      holder: holder("City Councillor"),
      scope: pair,
    },
  ];

  const trustees = all.filter((c) => c.office === "trustee" && c.wards.includes(ward));
  const boards = [...new Set(trustees.map((c) => c.board ?? "School board"))].sort();
  for (const board of boards) {
    const group = trustees.filter((c) => (c.board ?? "School board") === board);
    races.push({
      key: "trustee",
      id: `trustee-${board.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      board,
      candidates: group,
      holder: null,
      // Trustee areas do not follow council ward pairs.
      scope: [...new Set(group.flatMap((c) => c.wards))].sort((a, b) => +a - +b).join("+"),
    });
  }

  return { ward, pair, partner, races };
}

/** Whole-number days from today (Toronto) to a date, floored at 0. */
export function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00-04:00`).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / 86_400_000));
}
