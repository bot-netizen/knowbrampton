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

/** Build an in-locale href. `/en/my-ward/`, `/pa/my-ward/` */
export function href(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

/** Fill {placeholders} in a string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
