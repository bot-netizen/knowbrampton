/** Bilingual string. `pa` is machine-drafted until an editor signs off. */
export interface Bi {
  en: string;
  pa: string;
}

export type SourceState = "verified" | "attributed" | "unsourced";

export interface Source {
  /** Who said it — shown to the reader, so write it as you'd print it. */
  name: string;
  url?: string;
  retrieved?: string;
}

export interface Fact {
  state: SourceState;
  source?: Source;
}

export const pick = (b: Bi, locale: string): string => (locale === "pa" ? b.pa : b.en);
