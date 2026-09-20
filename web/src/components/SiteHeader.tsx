import { getDict, href, LOCALE_META, REVIEWED, type Locale } from "@/i18n";
import LocaleToggle from "./LocaleToggle";

export default function SiteHeader({ locale, path = "" }: { locale: Locale; path?: string }) {
  const t = getDict(locale);
  return (
    <>
      <a className="skip" href="#main">
        {t.site.skipToContent}
      </a>
      <header className="site-head">
        <div className="mast">
          <a href={href(locale)}>{t.site.name}</a>
          <span>{t.site.tagline}</span>
        </div>
        <nav className="site-nav">
          <a href={href(locale, "brampton-101")}>{t.nav.basics}</a>
          <a href={href(locale, "money")}>{t.nav.money}</a>
          <a href={href(locale, "issues")}>{t.nav.issues}</a>
          <a href={href(locale, "candidates")}>{t.nav.election}</a>
          <LocaleToggle locale={locale} path={path} />
          <a className="cta" href={href(locale, "my-ward")}>
            {t.nav.myWard}
          </a>
        </nav>
      </header>
      {!REVIEWED[locale] && (
        <div className="xl-banner" lang={LOCALE_META[locale].htmlLang}>
          <strong>{t.translation.statusLabel}</strong>
          <p>{t.translation.machineDraft}</p>
        </div>
      )}
    </>
  );
}
