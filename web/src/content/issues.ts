import type { Bi, Source } from "./types";

export interface Issue {
  slug: string;
  tag: Bi;
  headline: Bi;
  evidence: Bi;
  /** Whose job it actually is — the single most useful line on the page. */
  jurisdiction: Bi;
  colour: string;
  source: Source;
}

export const ISSUES: Issue[] = [
  {
    slug: "health-care",
    colour: "var(--crimson)",
    tag: { en: "Health care", pa: "ਸਿਹਤ ਸੇਵਾਵਾਂ" },
    headline: {
      en: "One full-service hospital for roughly 700,000 people",
      pa: "ਲਗਭਗ 700,000 ਲੋਕਾਂ ਲਈ ਇੱਕ ਪੂਰੀ-ਸੇਵਾ ਹਸਪਤਾਲ",
    },
    evidence: {
      en: "Brampton Civic is the city's only full-service hospital. Council has committed $125M and a dedicated 1% levy toward a second site at Peel Memorial. “Hallway health care” here has drawn national coverage for years.",
      pa: "ਬਰੈਂਪਟਨ ਸਿਵਿਕ ਸ਼ਹਿਰ ਦਾ ਇੱਕੋ-ਇੱਕ ਪੂਰੀ-ਸੇਵਾ ਹਸਪਤਾਲ ਹੈ। ਕੌਂਸਲ ਨੇ ਪੀਲ ਮੈਮੋਰੀਅਲ ਵਿਖੇ ਦੂਜੀ ਥਾਂ ਲਈ $125 ਮਿਲੀਅਨ ਅਤੇ ਵੱਖਰੀ 1% ਲੈਵੀ ਦੀ ਵਚਨਬੱਧਤਾ ਕੀਤੀ ਹੈ। ਇੱਥੋਂ ਦੀ “ਹਾਲਵੇਅ ਹੈਲਥ ਕੇਅਰ” ਸਾਲਾਂ ਤੋਂ ਰਾਸ਼ਟਰੀ ਖ਼ਬਰਾਂ ਵਿੱਚ ਹੈ।",
    },
    jurisdiction: {
      en: "The Province decides. The City can only fund and lobby.",
      pa: "ਫ਼ੈਸਲਾ ਸੂਬਾ ਕਰਦਾ ਹੈ। ਸਿਟੀ ਸਿਰਫ਼ ਪੈਸਾ ਦੇ ਸਕਦੀ ਹੈ ਅਤੇ ਵਕਾਲਤ ਕਰ ਸਕਦੀ ਹੈ।",
    },
    source: { name: "City of Brampton, 2026 Budget", url: "https://www.brampton.ca/EN/City-Hall/Budget", retrieved: "2026-09-20" },
  },
  {
    slug: "housing",
    colour: "var(--ochre)",
    tag: { en: "Housing", pa: "ਹਾਊਸਿੰਗ" },
    headline: {
      en: "Starts fell by roughly a third while targets rose",
      pa: "ਟੀਚੇ ਵਧੇ ਪਰ ਉਸਾਰੀ ਲਗਭਗ ਇੱਕ ਤਿਹਾਈ ਘਟੀ",
    },
    evidence: {
      en: "1,831 starts in 2024. 1,138 through the first three quarters of 2025. The City accepted a provincial target it is now far behind, and development charges fall with the starts.",
      pa: "2024 ਵਿੱਚ 1,831 ਸ਼ੁਰੂਆਤਾਂ। 2025 ਦੀਆਂ ਪਹਿਲੀਆਂ ਤਿੰਨ ਤਿਮਾਹੀਆਂ ਵਿੱਚ 1,138। ਸਿਟੀ ਨੇ ਸੂਬਾਈ ਟੀਚਾ ਮੰਨਿਆ ਸੀ ਜਿਸ ਤੋਂ ਹੁਣ ਬਹੁਤ ਪਿੱਛੇ ਹੈ, ਅਤੇ ਸ਼ੁਰੂਆਤਾਂ ਨਾਲ ਡਿਵੈਲਪਮੈਂਟ ਚਾਰਜਿਜ਼ ਵੀ ਘਟਦੇ ਹਨ।",
    },
    jurisdiction: {
      en: "The City approves; the Province sets the targets.",
      pa: "ਸਿਟੀ ਮਨਜ਼ੂਰੀ ਦਿੰਦੀ ਹੈ; ਟੀਚੇ ਸੂਬਾ ਤੈਅ ਕਰਦਾ ਹੈ।",
    },
    source: { name: "Reported housing starts — primary citation still being traced", retrieved: "2026-09-20" },
  },
  {
    slug: "transit",
    colour: "var(--teal)",
    tag: { en: "Transit", pa: "ਟਰਾਂਜ਼ਿਟ" },
    headline: {
      en: "A bus network that grew slower than the city",
      pa: "ਬੱਸ ਨੈੱਟਵਰਕ ਸ਼ਹਿਰ ਨਾਲੋਂ ਹੌਲੀ ਵਧਿਆ",
    },
    evidence: {
      en: "Brampton Transit publishes routes, stops and ridership as open data. What nobody publishes is service hours per resident against peer cities — the comparison that shows whether service kept pace. We intend to compute it.",
      pa: "ਬਰੈਂਪਟਨ ਟਰਾਂਜ਼ਿਟ ਰੂਟ, ਸਟਾਪ ਅਤੇ ਸਵਾਰੀਆਂ ਦਾ ਡਾਟਾ ਜਨਤਕ ਕਰਦੀ ਹੈ। ਜੋ ਕੋਈ ਨਹੀਂ ਛਾਪਦਾ ਉਹ ਹੈ ਪ੍ਰਤੀ ਵਾਸੀ ਸੇਵਾ ਘੰਟੇ, ਹੋਰ ਸ਼ਹਿਰਾਂ ਦੇ ਮੁਕਾਬਲੇ — ਉਹ ਤੁਲਨਾ ਜੋ ਦੱਸਦੀ ਹੈ ਕਿ ਸੇਵਾ ਨੇ ਰਫ਼ਤਾਰ ਰੱਖੀ ਜਾਂ ਨਹੀਂ। ਅਸੀਂ ਇਹ ਕੱਢਣ ਦਾ ਇਰਾਦਾ ਰੱਖਦੇ ਹਾਂ।",
    },
    jurisdiction: { en: "The City. Directly and entirely.", pa: "ਸਿਟੀ। ਸਿੱਧੇ ਅਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ।" },
    source: { name: "Brampton GeoHub — Transit_Stops_and_Routes", url: "https://geohub.brampton.ca", retrieved: "2026-09-20" },
  },
  {
    slug: "taxes-and-assets",
    colour: "#4a3a78",
    tag: { en: "Taxes and assets", pa: "ਟੈਕਸ ਅਤੇ ਸੰਪਤੀ" },
    headline: {
      en: "The cheapest city services in the GTA, and the question that follows",
      pa: "ਜੀਟੀਏ ਵਿੱਚ ਸਭ ਤੋਂ ਸਸਤੀਆਂ ਸ਼ਹਿਰੀ ਸੇਵਾਵਾਂ, ਅਤੇ ਅਗਲਾ ਸਵਾਲ",
    },
    evidence: {
      en: "$1,516 per resident against a $1,819 GTA average. Whether that is discipline or deferred maintenance depends on asset-condition data, which the City reports but does not headline.",
      pa: "ਪ੍ਰਤੀ ਵਾਸੀ $1,516, ਜੀਟੀਏ ਔਸਤ $1,819 ਦੇ ਮੁਕਾਬਲੇ। ਇਹ ਅਨੁਸ਼ਾਸਨ ਹੈ ਜਾਂ ਟਾਲੀ ਹੋਈ ਮੁਰੰਮਤ, ਇਹ ਸੰਪਤੀ ਦੀ ਹਾਲਤ ਦੇ ਡਾਟੇ ਉੱਤੇ ਨਿਰਭਰ ਹੈ, ਜੋ ਸਿਟੀ ਛਾਪਦੀ ਤਾਂ ਹੈ ਪਰ ਉਭਾਰਦੀ ਨਹੀਂ।",
    },
    jurisdiction: { en: "The City sets its own portion only.", pa: "ਸਿਟੀ ਸਿਰਫ਼ ਆਪਣਾ ਹਿੱਸਾ ਤੈਅ ਕਰਦੀ ਹੈ।" },
    source: { name: "City of Brampton, 2026 Budget", url: "https://www.brampton.ca/EN/City-Hall/Budget", retrieved: "2026-09-20" },
  },
  {
    slug: "growth-and-planning",
    colour: "#2f6b3a",
    tag: { en: "Growth and planning", pa: "ਵਿਕਾਸ ਅਤੇ ਯੋਜਨਾ" },
    headline: {
      en: "A 2040 Vision that assumed a denser city than is being built",
      pa: "2040 ਵਿਜ਼ਨ ਨੇ ਜਿੰਨਾ ਸੰਘਣਾ ਸ਼ਹਿਰ ਮੰਨਿਆ, ਓਨਾ ਬਣ ਨਹੀਂ ਰਿਹਾ",
    },
    evidence: {
      en: "The official plan and all twelve of its schedules are published as geographic layers. Comparing what was designated against what was actually permitted is a data job, and it is doable.",
      pa: "ਅਧਿਕਾਰਤ ਯੋਜਨਾ ਅਤੇ ਇਸ ਦੀਆਂ ਬਾਰਾਂ ਅਨੁਸੂਚੀਆਂ ਭੂਗੋਲਿਕ ਪਰਤਾਂ ਵਜੋਂ ਪ੍ਰਕਾਸ਼ਿਤ ਹਨ। ਜੋ ਨਿਰਧਾਰਿਤ ਕੀਤਾ ਗਿਆ ਸੀ ਅਤੇ ਜਿਸ ਦੀ ਅਸਲ ਵਿੱਚ ਇਜਾਜ਼ਤ ਮਿਲੀ, ਉਸ ਦੀ ਤੁਲਨਾ ਡਾਟੇ ਦਾ ਕੰਮ ਹੈ, ਅਤੇ ਇਹ ਹੋ ਸਕਦਾ ਹੈ।",
    },
    jurisdiction: { en: "The City plans; the Province can override.", pa: "ਸਿਟੀ ਯੋਜਨਾ ਬਣਾਉਂਦੀ ਹੈ; ਸੂਬਾ ਰੱਦ ਕਰ ਸਕਦਾ ਹੈ।" },
    source: { name: "Brampton GeoHub — Brampton_Plan schedules 1A–12", url: "https://geohub.brampton.ca", retrieved: "2026-09-20" },
  },
  {
    slug: "community-safety",
    colour: "var(--muted)",
    tag: { en: "Community safety", pa: "ਭਾਈਚਾਰਕ ਸੁਰੱਖਿਆ" },
    headline: {
      en: "A police budget you vote on indirectly",
      pa: "ਪੁਲਿਸ ਬਜਟ ਜਿਸ ਉੱਤੇ ਤੁਸੀਂ ਅਸਿੱਧੇ ਵੋਟ ਪਾਉਂਦੇ ਹੋ",
    },
    evidence: {
      en: "Peel Regional Police are funded through the Region, not the City. Your Regional Councillor votes on that budget. Most residents do not know this is the same ballot line.",
      pa: "ਪੀਲ ਰੀਜਨਲ ਪੁਲਿਸ ਨੂੰ ਪੈਸਾ ਰੀਜਨ ਤੋਂ ਮਿਲਦਾ ਹੈ, ਸਿਟੀ ਤੋਂ ਨਹੀਂ। ਤੁਹਾਡਾ ਰੀਜਨਲ ਕੌਂਸਲਰ ਉਸ ਬਜਟ ਉੱਤੇ ਵੋਟ ਪਾਉਂਦਾ ਹੈ। ਬਹੁਤੇ ਵਾਸੀਆਂ ਨੂੰ ਪਤਾ ਨਹੀਂ ਕਿ ਇਹ ਉਹੀ ਬੈਲਟ ਲਾਈਨ ਹੈ।",
    },
    jurisdiction: { en: "The Region of Peel.", pa: "ਰੀਜਨ ਆਫ਼ ਪੀਲ।" },
    source: { name: "Region of Peel — guide to Regional Council", url: "https://peelregion.ca", retrieved: "2026-09-20" },
  },
];
