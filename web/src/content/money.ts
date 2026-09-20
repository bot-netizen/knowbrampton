import type { Bi, Source } from "./types";

const CITY_BUDGET: Source = {
  name: "City of Brampton, 2026 Budget",
  url: "https://www.brampton.ca/EN/City-Hall/Budget",
  retrieved: "2026-09-20",
};

export const HEADLINE: { value: Bi; label: Bi; note: Bi; source: Source }[] = [
  {
    value: { en: "$1.0385B", pa: "$1.0385 ਬਿਲੀਅਨ" },
    label: { en: "operating budget", pa: "ਚਾਲੂ ਬਜਟ" },
    note: { en: "day-to-day running of the city", pa: "ਸ਼ਹਿਰ ਦਾ ਰੋਜ਼ਾਨਾ ਕੰਮਕਾਜ" },
    source: CITY_BUDGET,
  },
  {
    value: { en: "$340.4M", pa: "$340.4 ਮਿਲੀਅਨ" },
    label: { en: "capital budget", pa: "ਪੂੰਜੀ ਬਜਟ" },
    note: { en: "new and renewed infrastructure", pa: "ਨਵਾਂ ਅਤੇ ਮੁਰੰਮਤ ਵਾਲਾ ਬੁਨਿਆਦੀ ਢਾਂਚਾ" },
    source: CITY_BUDGET,
  },
  {
    value: { en: "0% + 1%", pa: "0% + 1%" },
    label: { en: "city increase, 2026", pa: "ਸਿਟੀ ਵਾਧਾ, 2026" },
    note: { en: "zero on the base, 1% hospital levy", pa: "ਮੂਲ ਉੱਤੇ ਜ਼ੀਰੋ, 1% ਹਸਪਤਾਲ ਲੈਵੀ" },
    source: CITY_BUDGET,
  },
  {
    value: { en: "$163M", pa: "$163 ਮਿਲੀਅਨ" },
    label: { en: "in reserves", pa: "ਰਿਜ਼ਰਵ ਵਿੱਚ" },
    note: { en: "a record level, per the City", pa: "ਸਿਟੀ ਮੁਤਾਬਕ ਰਿਕਾਰਡ ਪੱਧਰ" },
    source: CITY_BUDGET,
  },
  {
    value: { en: "$125M", pa: "$125 ਮਿਲੀਅਨ" },
    label: { en: "pledged to the hospital", pa: "ਹਸਪਤਾਲ ਲਈ ਵਚਨਬੱਧ" },
    note: { en: "toward a second full-service site", pa: "ਦੂਜੇ ਪੂਰੀ-ਸੇਵਾ ਹਸਪਤਾਲ ਲਈ" },
    source: CITY_BUDGET,
  },
];

export interface Chart {
  title: Bi;
  sub: Bi;
  unit: string;
  max: number;
  bars: { label: Bi; value: number; display: Bi; colour: string }[];
  source: Source;
}

export const CHARTS: Chart[] = [
  {
    title: { en: "City tax collected per resident", pa: "ਪ੍ਰਤੀ ਵਾਸੀ ਸਿਟੀ ਟੈਕਸ" },
    sub: {
      en: "Brampton against the average of its GTA neighbours, 2026.",
      pa: "ਬਰੈਂਪਟਨ ਬਨਾਮ ਜੀਟੀਏ ਦੇ ਗੁਆਂਢੀਆਂ ਦੀ ਔਸਤ, 2026।",
    },
    unit: "$",
    max: 1900,
    bars: [
      { label: { en: "Brampton", pa: "ਬਰੈਂਪਟਨ" }, value: 1516, display: { en: "$1,516", pa: "$1,516" }, colour: "var(--crimson)" },
      { label: { en: "GTA average", pa: "ਜੀਟੀਏ ਔਸਤ" }, value: 1819, display: { en: "$1,819", pa: "$1,819" }, colour: "#8c8472" },
    ],
    source: CITY_BUDGET,
  },
  {
    title: { en: "Operating versus capital, 2026", pa: "ਚਾਲੂ ਬਨਾਮ ਪੂੰਜੀ, 2026" },
    sub: {
      en: "Operating keeps the lights on. Capital builds the things.",
      pa: "ਚਾਲੂ ਬਜਟ ਰੋਜ਼ਾਨਾ ਕੰਮ ਚਲਾਉਂਦਾ ਹੈ। ਪੂੰਜੀ ਬਜਟ ਚੀਜ਼ਾਂ ਬਣਾਉਂਦਾ ਹੈ।",
    },
    unit: "M",
    max: 1100,
    bars: [
      { label: { en: "Operating", pa: "ਚਾਲੂ" }, value: 1038.5, display: { en: "$1.0385B", pa: "$1.0385 ਬਿ." }, colour: "var(--teal)" },
      { label: { en: "Capital", pa: "ਪੂੰਜੀ" }, value: 340.4, display: { en: "$340.4M", pa: "$340.4 ਮਿ." }, colour: "#4a8a8c" },
    ],
    source: CITY_BUDGET,
  },
  {
    title: { en: "Housing starts are falling", pa: "ਹਾਊਸਿੰਗ ਸ਼ੁਰੂਆਤਾਂ ਘਟ ਰਹੀਆਂ ਹਨ" },
    sub: {
      en: "Against a provincial target the City formally accepted.",
      pa: "ਉਸ ਸੂਬਾਈ ਟੀਚੇ ਦੇ ਮੁਕਾਬਲੇ ਜੋ ਸਿਟੀ ਨੇ ਰਸਮੀ ਤੌਰ ਉੱਤੇ ਮੰਨਿਆ ਸੀ।",
    },
    unit: "",
    max: 2000,
    bars: [
      { label: { en: "2024 full year", pa: "2024 ਪੂਰਾ ਸਾਲ" }, value: 1831, display: { en: "1,831", pa: "1,831" }, colour: "var(--ochre)" },
      { label: { en: "2025 first 3 qtrs", pa: "2025 ਪਹਿਲੀਆਂ 3 ਤਿਮਾਹੀਆਂ" }, value: 1138, display: { en: "1,138", pa: "1,138" }, colour: "#c4a05a" },
    ],
    source: { name: "Reported housing starts — primary citation still being traced", retrieved: "2026-09-20" },
  },
];

export interface LedgerItem {
  title: Bi;
  body: Bi;
  source: Source;
}

export const CASE_FOR: LedgerItem[] = [
  {
    title: { en: "Lowest city tax per capita in the GTA", pa: "ਜੀਟੀਏ ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਸਿਟੀ ਟੈਕਸ" },
    body: {
      en: "$1,516 a resident against a $1,819 average. Brampton genuinely charges less for city services than its neighbours.",
      pa: "ਪ੍ਰਤੀ ਵਾਸੀ $1,516, ਔਸਤ $1,819 ਦੇ ਮੁਕਾਬਲੇ। ਬਰੈਂਪਟਨ ਸੱਚਮੁੱਚ ਆਪਣੇ ਗੁਆਂਢੀਆਂ ਨਾਲੋਂ ਘੱਟ ਵਸੂਲਦਾ ਹੈ।",
    },
    source: CITY_BUDGET,
  },
  {
    title: { en: "Reserves at a record $163 million", pa: "ਰਿਜ਼ਰਵ ਰਿਕਾਰਡ $163 ਮਿਲੀਅਨ ਉੱਤੇ" },
    body: {
      en: "Money set aside for emergencies and asset replacement — the buffer that stops a bad year becoming a tax shock.",
      pa: "ਐਮਰਜੈਂਸੀ ਅਤੇ ਸੰਪਤੀ ਬਦਲਣ ਲਈ ਰੱਖਿਆ ਪੈਸਾ — ਉਹ ਬਚਾਅ ਜੋ ਮਾੜੇ ਸਾਲ ਨੂੰ ਟੈਕਸ ਝਟਕਾ ਬਣਨ ਤੋਂ ਰੋਕਦਾ ਹੈ।",
    },
    source: CITY_BUDGET,
  },
  {
    title: { en: "A hard commitment on the hospital", pa: "ਹਸਪਤਾਲ ਲਈ ਪੱਕੀ ਵਚਨਬੱਧਤਾ" },
    body: {
      en: "$125 million pledged to William Osler, funded by a dedicated 1% levy that cannot be spent elsewhere.",
      pa: "ਵਿਲੀਅਮ ਓਸਲਰ ਲਈ $125 ਮਿਲੀਅਨ, ਇੱਕ ਵੱਖਰੀ 1% ਲੈਵੀ ਤੋਂ, ਜੋ ਹੋਰ ਕਿਤੇ ਖ਼ਰਚ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
    },
    source: CITY_BUDGET,
  },
  {
    title: { en: "Front-line hiring, not just headcount", pa: "ਫ਼ਰੰਟ-ਲਾਈਨ ਭਰਤੀ" },
    body: {
      en: "24 firefighters, 14 fire prevention officers, 12 bylaw and 24 property standards officers in the 2026 budget.",
      pa: "2026 ਬਜਟ ਵਿੱਚ 24 ਫ਼ਾਇਰਫ਼ਾਈਟਰ, 14 ਅੱਗ ਰੋਕਥਾਮ ਅਫ਼ਸਰ, 12 ਬਾਈਲਾਅ ਅਤੇ 24 ਪ੍ਰਾਪਰਟੀ ਸਟੈਂਡਰਡ ਅਫ਼ਸਰ।",
    },
    source: CITY_BUDGET,
  },
];

export const CASE_AGAINST: LedgerItem[] = [
  {
    title: { en: "The headline rate was not the whole bill", pa: "ਮੁੱਖ ਦਰ ਪੂਰਾ ਬਿੱਲ ਨਹੀਂ ਸੀ" },
    body: {
      en: "The City's portion rose 0%, but a 1% hospital levy was added on top. The Brampton Board of Trade published a piece arguing the widely-quoted “1.5%” framing was misleading.",
      pa: "ਸਿਟੀ ਦਾ ਹਿੱਸਾ 0% ਵਧਿਆ, ਪਰ ਉੱਤੇ 1% ਹਸਪਤਾਲ ਲੈਵੀ ਜੋੜੀ ਗਈ। ਬਰੈਂਪਟਨ ਬੋਰਡ ਆਫ਼ ਟਰੇਡ ਨੇ ਲਿਖਿਆ ਕਿ ਆਮ ਵਰਤੀ ਜਾਂਦੀ “1.5%” ਗੱਲ ਭੁਲੇਖਾ ਪਾਉਂਦੀ ਹੈ।",
    },
    source: {
      name: "Brampton Board of Trade",
      url: "https://bramptonbot.com/brampton-budget-1-5-tax-hike-heres-why-thats-misleading/",
      retrieved: "2026-09-20",
    },
  },
  {
    title: { en: "Years of freezes may be catching up", pa: "ਸਾਲਾਂ ਦੀ ਰੋਕ ਹੁਣ ਅਸਰ ਦਿਖਾ ਸਕਦੀ ਹੈ" },
    body: {
      en: "A critique in Canadian Accountant argues the 2026 budget lacks key investments and that earlier spending freezes are now landing on taxpayers.",
      pa: "ਕੈਨੇਡੀਅਨ ਅਕਾਊਂਟੈਂਟ ਵਿੱਚ ਛਪੀ ਆਲੋਚਨਾ ਕਹਿੰਦੀ ਹੈ ਕਿ 2026 ਬਜਟ ਵਿੱਚ ਜ਼ਰੂਰੀ ਨਿਵੇਸ਼ ਨਹੀਂ ਹਨ ਅਤੇ ਪਹਿਲਾਂ ਦੀਆਂ ਖ਼ਰਚ ਰੋਕਾਂ ਦਾ ਭਾਰ ਹੁਣ ਟੈਕਸਦਾਤਿਆਂ ਉੱਤੇ ਪੈ ਰਿਹਾ ਹੈ।",
    },
    source: {
      name: "Canadian Accountant",
      url: "https://www.canadian-accountant.com/content/municipal/brampton-budget-2026",
      retrieved: "2026-09-20",
    },
  },
  {
    title: { en: "Building has slowed sharply", pa: "ਉਸਾਰੀ ਤੇਜ਼ੀ ਨਾਲ ਹੌਲੀ ਹੋਈ" },
    body: {
      en: "Starts fell from 1,831 in 2024 to 1,138 through three quarters of 2025 — development charges and growth revenue fall with them.",
      pa: "ਸ਼ੁਰੂਆਤਾਂ 2024 ਵਿੱਚ 1,831 ਤੋਂ ਘਟ ਕੇ 2025 ਦੀਆਂ ਤਿੰਨ ਤਿਮਾਹੀਆਂ ਵਿੱਚ 1,138 ਰਹਿ ਗਈਆਂ — ਨਾਲ ਹੀ ਡਿਵੈਲਪਮੈਂਟ ਚਾਰਜਿਜ਼ ਅਤੇ ਵਿਕਾਸ ਆਮਦਨ ਵੀ ਘਟਦੀ ਹੈ।",
    },
    source: { name: "Reported housing starts — primary citation still being traced", retrieved: "2026-09-20" },
  },
  {
    title: { en: "The rest of your bill is not the City's", pa: "ਤੁਹਾਡੇ ਬਿੱਲ ਦਾ ਬਾਕੀ ਹਿੱਸਾ ਸਿਟੀ ਦਾ ਨਹੀਂ" },
    body: {
      en: "City tax is one of three lines. Peel Region and education are the others, and their shares are set elsewhere. We are still sourcing the exact split.",
      pa: "ਸਿਟੀ ਟੈਕਸ ਤਿੰਨ ਲਾਈਨਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ। ਬਾਕੀ ਪੀਲ ਰੀਜਨ ਅਤੇ ਸਿੱਖਿਆ ਹਨ, ਜਿਨ੍ਹਾਂ ਦੇ ਹਿੱਸੇ ਹੋਰ ਥਾਂ ਤੈਅ ਹੁੰਦੇ ਹਨ। ਅਸੀਂ ਹਾਲੇ ਸਹੀ ਵੰਡ ਲੱਭ ਰਹੇ ਹਾਂ।",
    },
    source: { name: "Not yet sourced", retrieved: "2026-09-20" },
  },
];
