import type { Bi } from "./types";

/** Facts that stay true for a council term. Every number here is either
 *  computed from data/ or traced to a primary source. */

export const CITY_FACTS: { value: Bi; label: Bi; note: Bi }[] = [
  {
    value: { en: "656,480", pa: "656,480" },
    label: { en: "residents", pa: "ਵਾਸੀ" },
    note: { en: "2021 Census of Population, Statistics Canada", pa: "2021 ਮਰਦਮਸ਼ੁਮਾਰੀ, ਸਟੈਟਿਸਟਿਕਸ ਕੈਨੇਡਾ" },
  },
  {
    value: { en: "10", pa: "10" },
    label: { en: "wards", pa: "ਵਾਰਡ" },
    note: { en: "grouped into five electoral areas", pa: "ਪੰਜ ਚੋਣ ਖੇਤਰਾਂ ਵਿੱਚ ਵੰਡੇ ਹੋਏ" },
  },
  {
    value: { en: "11", pa: "11" },
    label: { en: "seats on city council", pa: "ਸਿਟੀ ਕੌਂਸਲ ਦੀਆਂ ਸੀਟਾਂ" },
    note: { en: "mayor + 5 regional + 5 city", pa: "ਮੇਅਰ + 5 ਰੀਜਨਲ + 5 ਸਿਟੀ" },
  },
  {
    value: { en: "4", pa: "4" },
    label: { en: "votes you cast", pa: "ਤੁਹਾਡੀਆਂ ਵੋਟਾਂ" },
    note: { en: "one per race on your ballot", pa: "ਬੈਲਟ ਦੀ ਹਰ ਦੌੜ ਲਈ ਇੱਕ" },
  },
  {
    value: { en: "4 yrs", pa: "4 ਸਾਲ" },
    label: { en: "between elections", pa: "ਚੋਣਾਂ ਵਿਚਕਾਰ" },
    note: { en: "fourth Monday of October", pa: "ਅਕਤੂਬਰ ਦਾ ਚੌਥਾ ਸੋਮਵਾਰ" },
  },
];

export const WHO_DOES_WHAT: { title: Bi; body: Bi; colour: string }[] = [
  {
    colour: "var(--crimson)",
    title: { en: "City of Brampton", pa: "ਸਿਟੀ ਆਫ਼ ਬਰੈਂਪਟਨ" },
    body: {
      en: "Brampton Transit, fire and emergency services, local roads and sidewalks, parks and recreation centres, libraries, bylaw enforcement, zoning and building permits, snow clearing on city streets.",
      pa: "ਬਰੈਂਪਟਨ ਟਰਾਂਜ਼ਿਟ, ਫ਼ਾਇਰ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ, ਸਥਾਨਕ ਸੜਕਾਂ ਤੇ ਫੁੱਟਪਾਥ, ਪਾਰਕ ਅਤੇ ਰੀਕ੍ਰੀਏਸ਼ਨ ਸੈਂਟਰ, ਲਾਇਬ੍ਰੇਰੀਆਂ, ਬਾਈਲਾਅ ਲਾਗੂ ਕਰਨਾ, ਜ਼ੋਨਿੰਗ ਅਤੇ ਬਿਲਡਿੰਗ ਪਰਮਿਟ, ਸ਼ਹਿਰੀ ਸੜਕਾਂ ਤੋਂ ਬਰਫ਼ ਹਟਾਉਣਾ।",
    },
  },
  {
    colour: "var(--teal)",
    title: { en: "Region of Peel", pa: "ਰੀਜਨ ਆਫ਼ ਪੀਲ" },
    body: {
      en: "Drinking water and wastewater, garbage and recycling, the Peel Regional Police budget, paramedics, public health, social housing and shelters, child care subsidies, regional arterial roads.",
      pa: "ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਅਤੇ ਗੰਦਾ ਪਾਣੀ, ਕੂੜਾ ਅਤੇ ਰੀਸਾਈਕਲਿੰਗ, ਪੀਲ ਰੀਜਨਲ ਪੁਲਿਸ ਦਾ ਬਜਟ, ਪੈਰਾਮੈਡਿਕਸ, ਜਨਤਕ ਸਿਹਤ, ਸਮਾਜਿਕ ਰਿਹਾਇਸ਼ ਅਤੇ ਸ਼ੈਲਟਰ, ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ ਲਈ ਸਬਸਿਡੀ, ਰੀਜਨਲ ਵੱਡੀਆਂ ਸੜਕਾਂ।",
    },
  },
  {
    colour: "var(--ochre)",
    title: { en: "Your school board", pa: "ਤੁਹਾਡਾ ਸਕੂਲ ਬੋਰਡ" },
    body: {
      en: "School attendance boundaries, closures and accommodation, board budgets, special education policy, and oversight of the director of education.",
      pa: "ਸਕੂਲ ਹਾਜ਼ਰੀ ਦੀਆਂ ਹੱਦਾਂ, ਬੰਦ ਹੋਣਾ ਅਤੇ ਥਾਂ ਦਾ ਪ੍ਰਬੰਧ, ਬੋਰਡ ਦੇ ਬਜਟ, ਵਿਸ਼ੇਸ਼ ਸਿੱਖਿਆ ਨੀਤੀ, ਅਤੇ ਡਾਇਰੈਕਟਰ ਆਫ਼ ਐਜੂਕੇਸ਼ਨ ਦੀ ਨਿਗਰਾਨੀ।",
    },
  },
  {
    colour: "var(--muted)",
    title: { en: "Not on this ballot", pa: "ਇਸ ਬੈਲਟ ਉੱਤੇ ਨਹੀਂ" },
    body: {
      en: "Hospitals and health care, school curriculum, highways, immigration, police legislation, rent control. These are provincial or federal — councillors can only lobby.",
      pa: "ਹਸਪਤਾਲ ਅਤੇ ਸਿਹਤ ਸੇਵਾਵਾਂ, ਸਕੂਲੀ ਪਾਠਕ੍ਰਮ, ਹਾਈਵੇਅ, ਇਮੀਗ੍ਰੇਸ਼ਨ, ਪੁਲਿਸ ਕਾਨੂੰਨ, ਕਿਰਾਇਆ ਕੰਟਰੋਲ। ਇਹ ਸੂਬਾਈ ਜਾਂ ਸੰਘੀ ਹਨ — ਕੌਂਸਲਰ ਸਿਰਫ਼ ਵਕਾਲਤ ਕਰ ਸਕਦੇ ਹਨ।",
    },
  },
];

export const TIMELINE: { date: Bi; title: Bi; body: Bi; past: boolean }[] = [
  {
    past: true,
    date: { en: "1 May 2026", pa: "1 ਮਈ 2026" },
    title: { en: "Nominations opened", pa: "ਨਾਮਜ਼ਦਗੀਆਂ ਖੁੱਲ੍ਹੀਆਂ" },
    body: { en: "Anyone eligible could file to run.", pa: "ਹਰ ਯੋਗ ਵਿਅਕਤੀ ਚੋਣ ਲੜਨ ਲਈ ਅਰਜ਼ੀ ਦੇ ਸਕਦਾ ਸੀ।" },
  },
  {
    past: true,
    date: { en: "21 Aug 2026", pa: "21 ਅਗਸਤ 2026" },
    title: { en: "Nominations closed", pa: "ਨਾਮਜ਼ਦਗੀਆਂ ਬੰਦ" },
    body: { en: "2 p.m. The field is now locked.", pa: "ਦੁਪਹਿਰ 2 ਵਜੇ। ਹੁਣ ਮੈਦਾਨ ਤੈਅ ਹੈ।" },
  },
  {
    past: true,
    date: { en: "25 Aug 2026", pa: "25 ਅਗਸਤ 2026" },
    title: { en: "Candidates certified", pa: "ਉਮੀਦਵਾਰ ਪ੍ਰਮਾਣਿਤ" },
    body: { en: "Confirmed by the City Clerk.", pa: "ਸਿਟੀ ਕਲਰਕ ਵੱਲੋਂ ਪੱਕਾ ਕੀਤਾ ਗਿਆ।" },
  },
  {
    past: false,
    date: { en: "9–17 Oct 2026", pa: "9–17 ਅਕਤੂਬਰ 2026" },
    title: { en: "Advance voting", pa: "ਅਗਾਊਂ ਵੋਟਿੰਗ" },
    body: { en: "Five days. Any advance location, any ward.", pa: "ਪੰਜ ਦਿਨ। ਕੋਈ ਵੀ ਅਗਾਊਂ ਥਾਂ, ਕੋਈ ਵੀ ਵਾਰਡ।" },
  },
  {
    past: false,
    date: { en: "26 Oct 2026", pa: "26 ਅਕਤੂਬਰ 2026" },
    title: { en: "Election day", pa: "ਚੋਣ ਵਾਲਾ ਦਿਨ" },
    body: { en: "Your assigned poll only, 10 a.m. – 8 p.m.", pa: "ਸਿਰਫ਼ ਤੁਹਾਡਾ ਨਿਯਤ ਪੋਲ, ਸਵੇਰੇ 10 ਤੋਂ ਰਾਤ 8 ਵਜੇ।" },
  },
  {
    past: false,
    date: { en: "15 Nov 2026", pa: "15 ਨਵੰਬਰ 2026" },
    title: { en: "New term begins", pa: "ਨਵਾਂ ਕਾਰਜਕਾਲ ਸ਼ੁਰੂ" },
    body: { en: "Runs four years, to November 2030.", pa: "ਚਾਰ ਸਾਲ, ਨਵੰਬਰ 2030 ਤੱਕ।" },
  },
];
