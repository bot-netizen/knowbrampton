"use client";

import { asset, LOCALES, LOCALE_META, type Locale } from "@/i18n";

/** Remembers the choice so the root gate honours it next visit. */
export default function LocaleToggle({ locale, path }: { locale: Locale; path: string }) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return (
    <div className="lang" role="group" aria-label={locale === "pa" ? "ਭਾਸ਼ਾ ਚੁਣੋ" : "Choose a language"}>
      {LOCALES.map((l) => (
        <a
          key={l}
          href={asset(clean ? `/${l}/${clean}/` : `/${l}/`)}
          lang={LOCALE_META[l].htmlLang}
          hrefLang={LOCALE_META[l].htmlLang}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => {
            try {
              localStorage.setItem("kb.locale", l);
            } catch {
              /* private mode — the toggle still navigates */
            }
          }}
        >
          {LOCALE_META[l].label}
        </a>
      ))}
    </div>
  );
}
