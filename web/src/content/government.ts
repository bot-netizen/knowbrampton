import type { Bi, Source } from "./types";

const CITY_PAY: Source = {
  name: "City of Brampton — Council remuneration and expenses, 2024",
  url: "https://www.brampton.ca/EN/City-Hall/Council-Committees/Accountability-and-Transparency/Pages/Expenses-Members-of-Council.aspx",
  retrieved: "2026-09-20",
};
const TRUSTEE_SRC: Source = {
  name: "The Local — on the Ford government's changes to trustees",
  url: "https://thelocal.to/peel-school-board-trustee-election-2026/",
  retrieved: "2026-09-20",
};
const MPP_SRC: Source = {
  name: "Legislative Assembly of Ontario / reported 2026 salary",
  url: "https://www.ola.org/en/members/expense-disclosure/list",
  retrieved: "2026-09-20",
};
const MP_SRC: Source = {
  name: "Parliament of Canada — Indemnities, Salaries and Allowances",
  url: "https://lop.parl.ca/sites/ParlInfo/default/en_CA/People/Salaries",
  retrieved: "2026-09-20",
};

export interface Role {
  slug: string;
  onBallot: boolean;
  colour: string;
  title: Bi;
  electedBy: Bi;
  decides: Bi;
  cannot: Bi;
  term: Bi;
  pay: Bi;
  paidBy: Bi;
  whyRun: Bi;
  source: Source;
}

export const ROLES: Role[] = [
  {
    slug: "mayor",
    onBallot: true,
    colour: "var(--crimson)",
    title: { en: "Mayor", pa: "ਮੇਅਰ" },
    electedBy: { en: "The whole city — one vote per resident.", pa: "ਪੂਰਾ ਸ਼ਹਿਰ — ਹਰ ਵਾਸੀ ਦੀ ਇੱਕ ਵੋਟ।" },
    decides: {
      en: "Chairs council and holds strong-mayor powers: proposes the budget, which council needs a two-thirds vote to amend, appoints the chief administrative officer, and can veto bylaws that touch provincial priorities. Also sits on Peel Regional Council.",
      pa: "ਕੌਂਸਲ ਦੀ ਪ੍ਰਧਾਨਗੀ ਕਰਦਾ ਹੈ ਅਤੇ ਸਟਰਾਂਗ-ਮੇਅਰ ਅਧਿਕਾਰ ਰੱਖਦਾ ਹੈ: ਬਜਟ ਪੇਸ਼ ਕਰਦਾ ਹੈ, ਜਿਸ ਨੂੰ ਬਦਲਣ ਲਈ ਕੌਂਸਲ ਦੀਆਂ ਦੋ-ਤਿਹਾਈ ਵੋਟਾਂ ਚਾਹੀਦੀਆਂ ਹਨ, ਮੁੱਖ ਪ੍ਰਸ਼ਾਸਕੀ ਅਫ਼ਸਰ ਨਿਯੁਕਤ ਕਰਦਾ ਹੈ, ਅਤੇ ਸੂਬਾਈ ਤਰਜੀਹਾਂ ਨਾਲ ਜੁੜੇ ਬਾਈਲਾਅ ਵੀਟੋ ਕਰ ਸਕਦਾ ਹੈ। ਪੀਲ ਰੀਜਨਲ ਕੌਂਸਲ ਵਿੱਚ ਵੀ ਬੈਠਦਾ ਹੈ।",
    },
    cannot: {
      en: "Cannot change provincial law, run schools or hospitals, or set the police budget alone — that sits at the Region.",
      pa: "ਸੂਬਾਈ ਕਾਨੂੰਨ ਨਹੀਂ ਬਦਲ ਸਕਦਾ, ਸਕੂਲ ਜਾਂ ਹਸਪਤਾਲ ਨਹੀਂ ਚਲਾ ਸਕਦਾ, ਅਤੇ ਇਕੱਲਾ ਪੁਲਿਸ ਬਜਟ ਨਹੀਂ ਤੈਅ ਕਰ ਸਕਦਾ — ਉਹ ਰੀਜਨ ਕੋਲ ਹੈ।",
    },
    term: { en: "4 years, fixed", pa: "4 ਸਾਲ, ਤੈਅ" },
    pay: { en: "$154,312 salary + $58,718 benefits (2024)", pa: "$154,312 ਤਨਖ਼ਾਹ + $58,718 ਲਾਭ (2024)" },
    paidBy: { en: "City of Brampton", pa: "ਸਿਟੀ ਆਫ਼ ਬਰੈਂਪਟਨ" },
    whyRun: {
      en: "The only city-wide mandate, and since strong-mayor powers arrived, by a distance the most powerful seat on the ballot. One person proposes the budget for a $1.38 billion organisation.",
      pa: "ਇੱਕੋ-ਇੱਕ ਪੂਰੇ ਸ਼ਹਿਰ ਦਾ ਫ਼ਤਵਾ, ਅਤੇ ਸਟਰਾਂਗ-ਮੇਅਰ ਅਧਿਕਾਰਾਂ ਤੋਂ ਬਾਅਦ, ਬੈਲਟ ਦੀ ਸਭ ਤੋਂ ਤਾਕਤਵਰ ਸੀਟ। ਇੱਕ ਵਿਅਕਤੀ 1.38 ਬਿਲੀਅਨ ਡਾਲਰ ਦੀ ਸੰਸਥਾ ਦਾ ਬਜਟ ਪੇਸ਼ ਕਰਦਾ ਹੈ।",
    },
    source: CITY_PAY,
  },
  {
    slug: "regional-councillor",
    onBallot: true,
    colour: "var(--teal)",
    title: { en: "Regional Councillor", pa: "ਰੀਜਨਲ ਕੌਂਸਲਰ" },
    electedBy: { en: "Your ward pair — two wards voting together.", pa: "ਤੁਹਾਡਾ ਵਾਰਡ ਜੋੜਾ — ਦੋ ਵਾਰਡ ਇਕੱਠੇ।" },
    decides: {
      en: "Sits on two councils at once. At the Region: drinking water and wastewater, garbage and recycling, the Peel Regional Police budget, paramedics, public health, social housing and shelters, child care subsidies, regional arterial roads. At the City: everything a City Councillor votes on.",
      pa: "ਇੱਕੋ ਵੇਲੇ ਦੋ ਕੌਂਸਲਾਂ ਵਿੱਚ ਬੈਠਦਾ ਹੈ। ਰੀਜਨ ਵਿੱਚ: ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਤੇ ਗੰਦਾ ਪਾਣੀ, ਕੂੜਾ ਤੇ ਰੀਸਾਈਕਲਿੰਗ, ਪੀਲ ਰੀਜਨਲ ਪੁਲਿਸ ਦਾ ਬਜਟ, ਪੈਰਾਮੈਡਿਕਸ, ਜਨਤਕ ਸਿਹਤ, ਸਮਾਜਿਕ ਰਿਹਾਇਸ਼ ਤੇ ਸ਼ੈਲਟਰ, ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ ਸਬਸਿਡੀ, ਰੀਜਨਲ ਸੜਕਾਂ। ਸਿਟੀ ਵਿੱਚ: ਉਹ ਸਭ ਜਿਸ ਉੱਤੇ ਸਿਟੀ ਕੌਂਸਲਰ ਵੋਟ ਪਾਉਂਦਾ ਹੈ।",
    },
    cannot: {
      en: "Cannot set school policy or change provincial law. Cannot direct the police day to day — the budget is the lever, not operations.",
      pa: "ਸਕੂਲ ਨੀਤੀ ਨਹੀਂ ਬਣਾ ਸਕਦਾ ਅਤੇ ਸੂਬਾਈ ਕਾਨੂੰਨ ਨਹੀਂ ਬਦਲ ਸਕਦਾ। ਪੁਲਿਸ ਨੂੰ ਰੋਜ਼ਾਨਾ ਹੁਕਮ ਨਹੀਂ ਦੇ ਸਕਦਾ — ਬਜਟ ਹੀ ਸਾਧਨ ਹੈ, ਕਾਰਵਾਈ ਨਹੀਂ।",
    },
    term: { en: "4 years, fixed", pa: "4 ਸਾਲ, ਤੈਅ" },
    pay: {
      en: "$98,066 salary + $49,197 benefits from the City (2024), plus separate remuneration from the Region of Peel",
      pa: "ਸਿਟੀ ਤੋਂ $98,066 ਤਨਖ਼ਾਹ + $49,197 ਲਾਭ (2024), ਨਾਲ ਹੀ ਰੀਜਨ ਆਫ਼ ਪੀਲ ਤੋਂ ਵੱਖਰੀ ਅਦਾਇਗੀ",
    },
    paidBy: { en: "Two governments: the City and the Region", pa: "ਦੋ ਸਰਕਾਰਾਂ: ਸਿਟੀ ਅਤੇ ਰੀਜਨ" },
    whyRun: {
      en: "Two seats and two budgets for one election. Policing is among the largest single things a Peel household pays for, and this is the only ballot line that touches it.",
      pa: "ਇੱਕ ਚੋਣ ਵਿੱਚ ਦੋ ਸੀਟਾਂ ਅਤੇ ਦੋ ਬਜਟ। ਪੁਲਿਸ ਉਨ੍ਹਾਂ ਸਭ ਤੋਂ ਵੱਡੀਆਂ ਚੀਜ਼ਾਂ ਵਿੱਚੋਂ ਹੈ ਜਿਨ੍ਹਾਂ ਲਈ ਪੀਲ ਦਾ ਘਰ ਪੈਸਾ ਦਿੰਦਾ ਹੈ, ਅਤੇ ਬੈਲਟ ਦੀ ਇਹੀ ਇੱਕ ਲਾਈਨ ਉਸ ਨੂੰ ਛੂੰਹਦੀ ਹੈ।",
    },
    source: CITY_PAY,
  },
  {
    slug: "city-councillor",
    onBallot: true,
    colour: "var(--ochre)",
    title: { en: "City Councillor", pa: "ਸਿਟੀ ਕੌਂਸਲਰ" },
    electedBy: { en: "Your ward pair — two wards voting together.", pa: "ਤੁਹਾਡਾ ਵਾਰਡ ਜੋੜਾ — ਦੋ ਵਾਰਡ ਇਕੱਠੇ।" },
    decides: {
      en: "Brampton Transit, fire and emergency services, local roads and sidewalks, parks and recreation centres, libraries, zoning and building permits, bylaw enforcement, snow clearing. After the election council picks three of the five to also sit at Peel Region.",
      pa: "ਬਰੈਂਪਟਨ ਟਰਾਂਜ਼ਿਟ, ਫ਼ਾਇਰ ਤੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ, ਸਥਾਨਕ ਸੜਕਾਂ ਤੇ ਫੁੱਟਪਾਥ, ਪਾਰਕ ਤੇ ਰੀਕ੍ਰੀਏਸ਼ਨ ਸੈਂਟਰ, ਲਾਇਬ੍ਰੇਰੀਆਂ, ਜ਼ੋਨਿੰਗ ਤੇ ਬਿਲਡਿੰਗ ਪਰਮਿਟ, ਬਾਈਲਾਅ, ਬਰਫ਼ ਹਟਾਉਣਾ। ਚੋਣ ਤੋਂ ਬਾਅਦ ਕੌਂਸਲ ਪੰਜਾਂ ਵਿੱਚੋਂ ਤਿੰਨ ਨੂੰ ਪੀਲ ਰੀਜਨ ਵਿੱਚ ਵੀ ਬਿਠਾਉਂਦੀ ਹੈ।",
    },
    cannot: {
      en: "Cannot touch water, waste or policing unless council also sends them to the Region. Cannot change provincial law.",
      pa: "ਪਾਣੀ, ਕੂੜੇ ਜਾਂ ਪੁਲਿਸ ਨੂੰ ਨਹੀਂ ਛੂਹ ਸਕਦਾ ਜਦੋਂ ਤੱਕ ਕੌਂਸਲ ਉਸ ਨੂੰ ਰੀਜਨ ਵਿੱਚ ਨਾ ਭੇਜੇ। ਸੂਬਾਈ ਕਾਨੂੰਨ ਨਹੀਂ ਬਦਲ ਸਕਦਾ।",
    },
    term: { en: "4 years, fixed", pa: "4 ਸਾਲ, ਤੈਅ" },
    pay: { en: "$98,066 salary + $49,197 benefits (2024)", pa: "$98,066 ਤਨਖ਼ਾਹ + $49,197 ਲਾਭ (2024)" },
    paidBy: { en: "City of Brampton", pa: "ਸਿਟੀ ਆਫ਼ ਬਰੈਂਪਟਨ" },
    whyRun: {
      en: "The closest seat to daily life. Almost everything a resident actually phones about — a road, a park, a bus, a permit — lands on this desk.",
      pa: "ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਦੀ ਸੀਟ। ਵਾਸੀ ਜਿਸ ਬਾਰੇ ਫ਼ੋਨ ਕਰਦੇ ਹਨ — ਸੜਕ, ਪਾਰਕ, ਬੱਸ, ਪਰਮਿਟ — ਲਗਭਗ ਸਭ ਇੱਥੇ ਆਉਂਦਾ ਹੈ।",
    },
    source: CITY_PAY,
  },
  {
    slug: "school-trustee",
    onBallot: true,
    colour: "#4a3a78",
    title: { en: "School Trustee", pa: "ਸਕੂਲ ਟਰੱਸਟੀ" },
    electedBy: {
      en: "Your ward grouping on the board you are registered with — Peel District, Dufferin-Peel Catholic, Viamonde or MonAvenir.",
      pa: "ਜਿਸ ਬੋਰਡ ਨਾਲ ਤੁਸੀਂ ਰਜਿਸਟਰ ਹੋ ਉਸ ਦਾ ਵਾਰਡ ਸਮੂਹ — ਪੀਲ ਡਿਸਟ੍ਰਿਕਟ, ਡਫ਼ਰਿਨ-ਪੀਲ ਕੈਥੋਲਿਕ, ਵਿਆਮੋਂਡ ਜਾਂ ਮੋਨਆਵਨੀਰ।",
    },
    decides: {
      en: "Historically: school attendance boundaries, closures and accommodation, the board budget, special education policy, and hiring or firing the director of education.",
      pa: "ਪਹਿਲਾਂ: ਸਕੂਲ ਹਾਜ਼ਰੀ ਦੀਆਂ ਹੱਦਾਂ, ਬੰਦ ਹੋਣਾ ਤੇ ਥਾਂ ਦਾ ਪ੍ਰਬੰਧ, ਬੋਰਡ ਦਾ ਬਜਟ, ਵਿਸ਼ੇਸ਼ ਸਿੱਖਿਆ ਨੀਤੀ, ਅਤੇ ਡਾਇਰੈਕਟਰ ਆਫ਼ ਐਜੂਕੇਸ਼ਨ ਦੀ ਭਰਤੀ ਜਾਂ ਬਰਖ਼ਾਸਤਗੀ।",
    },
    cannot: {
      en: "Much less than it used to. Ontario capped trustee pay, removed trustees' power to fire their board's chief executive without the education minister's written approval, and shifted budget control to chief executives and the minister. Boards have been placed under provincial supervision.",
      pa: "ਪਹਿਲਾਂ ਨਾਲੋਂ ਕਿਤੇ ਘੱਟ। ਓਨਟਾਰੀਓ ਨੇ ਟਰੱਸਟੀ ਦੀ ਤਨਖ਼ਾਹ ਸੀਮਤ ਕੀਤੀ, ਸਿੱਖਿਆ ਮੰਤਰੀ ਦੀ ਲਿਖਤੀ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਿਨਾਂ ਬੋਰਡ ਦੇ ਮੁਖੀ ਨੂੰ ਹਟਾਉਣ ਦਾ ਅਧਿਕਾਰ ਖੋਹ ਲਿਆ, ਅਤੇ ਬਜਟ ਦਾ ਕੰਟਰੋਲ ਮੁਖੀਆਂ ਤੇ ਮੰਤਰੀ ਨੂੰ ਦੇ ਦਿੱਤਾ। ਬੋਰਡ ਸੂਬਾਈ ਨਿਗਰਾਨੀ ਹੇਠ ਹਨ।",
    },
    term: { en: "4 years, fixed", pa: "4 ਸਾਲ, ਤੈਅ" },
    pay: { en: "Capped at $10,000 — down from about $27,544", pa: "$10,000 ਦੀ ਸੀਮਾ — ਪਹਿਲਾਂ ਲਗਭਗ $27,544" },
    paidBy: { en: "Your school board", pa: "ਤੁਹਾਡਾ ਸਕੂਲ ਬੋਰਡ" },
    whyRun: {
      en: "Honestly, the hardest case on the ballot to make right now — and people noticed. Candidate numbers fell about 35% at the Peel District board and close to 40% at Dufferin-Peel for this election.",
      pa: "ਸੱਚ ਕਹੀਏ ਤਾਂ ਇਸ ਵੇਲੇ ਬੈਲਟ ਦੀ ਸਭ ਤੋਂ ਔਖੀ ਦਲੀਲ — ਅਤੇ ਲੋਕਾਂ ਨੇ ਧਿਆਨ ਦਿੱਤਾ। ਇਸ ਚੋਣ ਲਈ ਪੀਲ ਡਿਸਟ੍ਰਿਕਟ ਬੋਰਡ ਵਿੱਚ ਉਮੀਦਵਾਰ ਲਗਭਗ 35% ਅਤੇ ਡਫ਼ਰਿਨ-ਪੀਲ ਵਿੱਚ ਕਰੀਬ 40% ਘਟੇ।",
    },
    source: TRUSTEE_SRC,
  },
  {
    slug: "mpp",
    onBallot: false,
    colour: "#2f6b3a",
    title: { en: "MPP — not on this ballot", pa: "ਐਮਪੀਪੀ — ਇਸ ਬੈਲਟ ਉੱਤੇ ਨਹੀਂ" },
    electedBy: { en: "A provincial riding. Brampton has five.", pa: "ਸੂਬਾਈ ਹਲਕਾ। ਬਰੈਂਪਟਨ ਵਿੱਚ ਪੰਜ ਹਨ।" },
    decides: {
      en: "Hospitals and health care, school curriculum and board governance, highways, policing legislation, rent control, housing targets — and the existence and shape of municipalities themselves.",
      pa: "ਹਸਪਤਾਲ ਤੇ ਸਿਹਤ ਸੇਵਾਵਾਂ, ਸਕੂਲੀ ਪਾਠਕ੍ਰਮ ਤੇ ਬੋਰਡ ਪ੍ਰਬੰਧ, ਹਾਈਵੇਅ, ਪੁਲਿਸ ਕਾਨੂੰਨ, ਕਿਰਾਇਆ ਕੰਟਰੋਲ, ਹਾਊਸਿੰਗ ਟੀਚੇ — ਅਤੇ ਨਗਰਪਾਲਿਕਾਵਾਂ ਦੀ ਹੋਂਦ ਤੇ ਬਣਤਰ ਵੀ।",
    },
    cannot: { en: "Cannot run a city, or legislate on immigration or criminal law.", pa: "ਸ਼ਹਿਰ ਨਹੀਂ ਚਲਾ ਸਕਦਾ, ਨਾ ਇਮੀਗ੍ਰੇਸ਼ਨ ਜਾਂ ਅਪਰਾਧਿਕ ਕਾਨੂੰਨ ਬਣਾ ਸਕਦਾ ਹੈ।" },
    term: { en: "Up to about 4 years. Last election February 2025.", pa: "ਲਗਭਗ 4 ਸਾਲ ਤੱਕ। ਪਿਛਲੀ ਚੋਣ ਫ਼ਰਵਰੀ 2025।" },
    pay: { en: "$163,275 for a backbencher (2026). The Premier: $292,752.", pa: "ਸਧਾਰਨ ਮੈਂਬਰ ਲਈ $163,275 (2026)। ਪ੍ਰੀਮੀਅਰ: $292,752।" },
    paidBy: { en: "Province of Ontario", pa: "ਓਨਟਾਰੀਓ ਸੂਬਾ" },
    whyRun: {
      en: "The level that can actually change the rules everyone else works inside — including the rules that bind city councils and school boards.",
      pa: "ਉਹ ਪੱਧਰ ਜੋ ਸੱਚਮੁੱਚ ਉਹ ਨਿਯਮ ਬਦਲ ਸਕਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਅੰਦਰ ਬਾਕੀ ਸਾਰੇ ਕੰਮ ਕਰਦੇ ਹਨ — ਸਿਟੀ ਕੌਂਸਲਾਂ ਅਤੇ ਸਕੂਲ ਬੋਰਡਾਂ ਉੱਤੇ ਲਾਗੂ ਨਿਯਮ ਵੀ।",
    },
    source: MPP_SRC,
  },
  {
    slug: "mp",
    onBallot: false,
    colour: "var(--muted)",
    title: { en: "MP — not on this ballot", pa: "ਐਮਪੀ — ਇਸ ਬੈਲਟ ਉੱਤੇ ਨਹੀਂ" },
    electedBy: { en: "A federal riding. Several cover parts of Brampton.", pa: "ਸੰਘੀ ਹਲਕਾ। ਕਈ ਹਲਕੇ ਬਰੈਂਪਟਨ ਦੇ ਹਿੱਸੇ ਕਵਰ ਕਰਦੇ ਹਨ।" },
    decides: {
      en: "Immigration, criminal law, employment insurance, national defence, and the federal transfers that fund a large share of provincial health and infrastructure spending.",
      pa: "ਇਮੀਗ੍ਰੇਸ਼ਨ, ਅਪਰਾਧਿਕ ਕਾਨੂੰਨ, ਬੇਰੁਜ਼ਗਾਰੀ ਬੀਮਾ, ਰਾਸ਼ਟਰੀ ਰੱਖਿਆ, ਅਤੇ ਉਹ ਸੰਘੀ ਤਬਾਦਲੇ ਜੋ ਸੂਬਾਈ ਸਿਹਤ ਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਵੱਡੇ ਹਿੱਸੇ ਲਈ ਪੈਸਾ ਦਿੰਦੇ ਹਨ।",
    },
    cannot: { en: "Cannot set your property tax, zone your street, or run your school.", pa: "ਤੁਹਾਡਾ ਪ੍ਰਾਪਰਟੀ ਟੈਕਸ ਤੈਅ ਨਹੀਂ ਕਰ ਸਕਦਾ, ਗਲੀ ਦੀ ਜ਼ੋਨਿੰਗ ਨਹੀਂ ਕਰ ਸਕਦਾ, ਸਕੂਲ ਨਹੀਂ ਚਲਾ ਸਕਦਾ।" },
    term: { en: "Up to 5 years. Last election April 2025.", pa: "5 ਸਾਲ ਤੱਕ। ਪਿਛਲੀ ਚੋਣ ਅਪ੍ਰੈਲ 2025।" },
    pay: { en: "$217,700 for a backbencher (2026). The Prime Minister: $435,400.", pa: "ਸਧਾਰਨ ਮੈਂਬਰ ਲਈ $217,700 (2026)। ਪ੍ਰਧਾਨ ਮੰਤਰੀ: $435,400।" },
    paidBy: { en: "Government of Canada", pa: "ਕੈਨੇਡਾ ਸਰਕਾਰ" },
    whyRun: {
      en: "The largest budget and the widest remit — but the least direct contact with whether your street gets plowed.",
      pa: "ਸਭ ਤੋਂ ਵੱਡਾ ਬਜਟ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡਾ ਦਾਇਰਾ — ਪਰ ਤੁਹਾਡੀ ਗਲੀ ਤੋਂ ਬਰਫ਼ ਹਟੇਗੀ ਜਾਂ ਨਹੀਂ, ਇਸ ਨਾਲ ਸਭ ਤੋਂ ਘੱਟ ਸਿੱਧਾ ਸਬੰਧ।",
    },
    source: MP_SRC,
  },
];

export interface PayRow {
  label: Bi;
  amount: number;
  display: Bi;
  paidBy: Bi;
  colour: string;
}

/** Base salary only. Benefits and allowances are listed per role above; mixing
 *  them into one bar would compare unlike things. */
export const PAY_TABLE: PayRow[] = [
  { label: { en: "School Trustee", pa: "ਸਕੂਲ ਟਰੱਸਟੀ" }, amount: 10000, display: { en: "$10,000", pa: "$10,000" }, paidBy: { en: "school board", pa: "ਸਕੂਲ ਬੋਰਡ" }, colour: "#4a3a78" },
  { label: { en: "City / Regional Councillor", pa: "ਸਿਟੀ / ਰੀਜਨਲ ਕੌਂਸਲਰ" }, amount: 98066, display: { en: "$98,066", pa: "$98,066" }, paidBy: { en: "City of Brampton", pa: "ਸਿਟੀ ਆਫ਼ ਬਰੈਂਪਟਨ" }, colour: "var(--ochre)" },
  { label: { en: "Mayor", pa: "ਮੇਅਰ" }, amount: 154312, display: { en: "$154,312", pa: "$154,312" }, paidBy: { en: "City of Brampton", pa: "ਸਿਟੀ ਆਫ਼ ਬਰੈਂਪਟਨ" }, colour: "var(--crimson)" },
  { label: { en: "MPP", pa: "ਐਮਪੀਪੀ" }, amount: 163275, display: { en: "$163,275", pa: "$163,275" }, paidBy: { en: "Province of Ontario", pa: "ਓਨਟਾਰੀਓ ਸੂਬਾ" }, colour: "#2f6b3a" },
  { label: { en: "MP", pa: "ਐਮਪੀ" }, amount: 217700, display: { en: "$217,700", pa: "$217,700" }, paidBy: { en: "Government of Canada", pa: "ਕੈਨੇਡਾ ਸਰਕਾਰ" }, colour: "var(--muted)" },
  { label: { en: "Premier of Ontario", pa: "ਓਨਟਾਰੀਓ ਦਾ ਪ੍ਰੀਮੀਅਰ" }, amount: 292752, display: { en: "$292,752", pa: "$292,752" }, paidBy: { en: "Province of Ontario", pa: "ਓਨਟਾਰੀਓ ਸੂਬਾ" }, colour: "#2f6b3a" },
  { label: { en: "Prime Minister", pa: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ" }, amount: 435400, display: { en: "$435,400", pa: "$435,400" }, paidBy: { en: "Government of Canada", pa: "ਕੈਨੇਡਾ ਸਰਕਾਰ" }, colour: "var(--muted)" },
];

export const UNSOURCED_NOTE: Source = {
  name: "Region of Peel's own remuneration figure for Brampton's regional councillors — not yet traced to a primary document",
  retrieved: "2026-09-20",
};
