import en from "./en.json";
import pa from "./pa.json";

export const LOCALES = ["en", "pa"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Punjabi copy is machine-drafted and awaiting review by a Punjabi-speaking
 *  editor. The site says so, in Punjabi, on every translated page. */
export const REVIEWED: Record<Locale, boolean> = { en: true, pa: false };

export const LOCALE_META: Record<Locale, { label: string; htmlLang: string; dir: "ltr" }> = {
  en: { label: "EN", htmlLang: "en", dir: "ltr" },
  pa: { label: "ਪੰਜਾਬੀ", htmlLang: "pa", dir: "ltr" },
};

// en is the source of truth for the shape; pa must satisfy it.
export type Dict = typeof en;
const DICTS: Record<Locale, Dict> = { en, pa: pa as Dict };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDict(locale: Locale): Dict {
  return DICTS[locale] ?? DICTS[DEFAULT_LOCALE];
}

/** Deployment prefix: "" at a domain root, "/knowbrampton" on a Pages project
 *  site. Inlined at build time by Next. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix an absolute in-site path. Next auto-prefixes next/link and next/image
 *  but NOT hand-written <a href>, so every link we build goes through here. */
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build an in-locale href. `/en/my-ward/`, `/pa/my-ward/` */
export function href(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return asset(clean ? `/${locale}/${clean}/` : `/${locale}/`);
}

/** Fill {placeholders} in a string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
