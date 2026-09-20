import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ISSUES } from "@/content/issues";
import { pick } from "@/content/types";
import { DEFAULT_LOCALE, fill, getDict, href, isLocale, LOCALES, type Locale } from "@/i18n";
import { candidates, council } from "@/lib/data";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => candidates().map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = candidates().find((x) => x.slug === slug);
  return { title: c?.name ?? "Candidate" };
}

export default async function Profile({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
  const c = candidates().find((x) => x.slug === slug);
  if (!c) return null;

  const sitting = council().find((m) => m.name === c.name);
  const sourced = c.sourcing.positions_sourced;
  const pct = Math.round((sourced / ISSUES.length) * 100);
  const initials = c.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const scope =
    c.office === "mayor"
      ? locale === "pa" ? "ਪੂਰੇ ਸ਼ਹਿਰ ਵਿੱਚ" : "city-wide"
      : c.board
        ? `${c.board} · ${locale === "pa" ? "ਵਾਰਡ" : "wards"} ${c.wards.join("+")}`
        : `${locale === "pa" ? "ਵਾਰਡ" : "wards"} ${c.pair}`;

  const officeLabel =
    c.office === "mayor" ? t.ballot.mayor
      : c.office === "regional_councillor" ? t.ballot.regional
        : c.office === "city_councillor" ? t.ballot.city
          : t.ballot.trustee;

  return (
    <>
      <SiteHeader locale={locale} path={`candidates/${c.slug}`} />
      <main id="main">
        <section style={{ padding: "18px var(--gutter) 0" }}>
          <a href={href(locale, "candidates")} style={{ fontSize: 13, fontWeight: 600 }}>
            ← {t.candidates.allCandidates}
          </a>
        </section>

        <section className="section" style={{ display: "flex", gap: 34, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div
            aria-hidden="true"
            style={{ flexShrink: 0, width: 120, height: 120, background: "var(--paper-2)", border: "1px solid var(--rule-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontSize: 40, fontWeight: 600, color: "var(--muted)" }}
          >
            {initials}
          </div>
          <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
              <span className="kicker">{officeLabel} · {scope}</span>
              {sitting && <span className="badge badge-verified">{t.candidates.incumbent}</span>}
            </div>
            <h1 style={{ fontSize: 44 }}>{c.name}</h1>
            <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                  {t.sourcing.sourceLabel}
                </div>
                <span style={{ fontSize: 14 }}>{fill(t.candidates.filedOn, { date: c.filing_date })}</span>
              </div>
              {sitting?.email && (
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>Email</div>
                  <a style={{ fontSize: 14 }} href={`mailto:${sitting.email}`}>{sitting.email}</a>
                </div>
              )}
            </div>
            {c.court_certified && (
              <p style={{ margin: 0, fontSize: 13, background: "var(--amber-bg)", border: "1px solid var(--amber-rule)", padding: "10px 12px", color: "#6b5a2b" }}>
                {t.candidates.courtNote}
              </p>
            )}
            {c.acclaimed && (
              <p style={{ margin: 0, fontSize: 13, background: "var(--amber-bg)", border: "1px solid var(--amber-rule)", padding: "10px 12px", color: "#6b5a2b" }}>
                {t.candidates.acclaimedNote}
              </p>
            )}
          </div>
          <div style={{ width: 250, border: "1px solid var(--ink)", background: "var(--card)", padding: "18px 20px" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
              {t.candidates.completeness}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "8px 0" }}>
              <span className="stat num" style={{ fontSize: 32 }}>{sourced}/{ISSUES.length}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{t.candidates.issuesSourced}</span>
            </div>
            <div style={{ height: 7, background: "var(--paper-2)" }}>
              <div style={{ height: 7, width: `${pct}%`, background: "var(--crimson)" }} />
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--ink-soft)" }}>{t.candidates.rightOfReply}</p>
          </div>
        </section>

        <section className="section" style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 540px" }}>
            <h2 style={{ fontSize: 27 }}>{t.candidates.standTitle}</h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", maxWidth: "68ch" }}>{t.candidates.standIntro}</p>
            <div style={{ marginTop: 8 }}>
              {ISSUES.map((issue) => (
                <div key={issue.slug} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 18, padding: "16px 0", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{pick(issue.tag, locale)}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <span className="badge badge-unsourced" style={{ alignSelf: "flex-start" }}>{t.sourcing.notSourced}</span>
                    <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{t.sourcing.emptyExplain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "0 1 300px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card">
              <strong style={{ fontSize: 15 }}>{t.candidates.moneyTitle}</strong>
              <p>{t.candidates.moneyBody}</p>
              <span style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ochre)", fontWeight: 700 }}>
                {t.candidates.moneyWhen}
              </span>
            </div>
            <div className="card">
              <strong style={{ fontSize: 15 }}>{t.candidates.wontTitle}</strong>
              <p>{t.candidates.wontBody}</p>
            </div>
            <div className="card" style={{ background: "var(--paper-2)" }}>
              <strong style={{ fontSize: 15 }}>{t.candidates.areYouTitle}</strong>
              <p>{t.candidates.areYouBody}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
