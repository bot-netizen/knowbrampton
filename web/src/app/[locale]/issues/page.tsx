import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SourceLine from "@/components/SourceLine";
import { ISSUES } from "@/content/issues";
import { pick } from "@/content/types";
import { DEFAULT_LOCALE, fill, getDict, isLocale, type Locale } from "@/i18n";
import { candidates } from "@/lib/data";

export const metadata = { title: "The problems" };

export default async function Issues({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);

  // Honest arithmetic: council candidates × issues, against what is sourced.
  const council = candidates().filter((c) => c.office !== "trustee");
  const total = council.length * ISSUES.length;
  const sourced = council.reduce((n, c) => n + c.sourcing.positions_sourced, 0);

  const steps = [t.issues.how1, t.issues.how2, t.issues.how3, t.issues.how4];

  return (
    <>
      <SiteHeader locale={locale} path="issues" />
      <main id="main">
        <section className="section" style={{ display: "flex", gap: 48, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "62ch" }}>
            <span className="kicker">{t.issues.kicker}</span>
            <h1 style={{ fontSize: 48 }}>{t.issues.title}</h1>
            <p style={{ margin: 0, fontSize: 17, color: "var(--ink-soft)" }}>{t.issues.standfirst}</p>
          </div>
          <div style={{ width: 300, border: "1px solid var(--ink)", background: "var(--card)", padding: "18px 20px" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
              {t.issues.statusTitle}
            </div>
            <div className="stat num" style={{ fontSize: 32, color: "var(--crimson)", margin: "8px 0" }}>
              {sourced} / {total}
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-soft)" }}>
              {fill(t.issues.statusBody, { n: council.length, i: ISSUES.length })}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="grid g3">
            {ISSUES.map((issue) => (
              <div className="card" key={issue.slug} style={{ borderTop: `3px solid ${issue.colour}`, display: "flex", flexDirection: "column", gap: 11 }}>
                <span style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: issue.colour, fontWeight: 700 }}>
                  {pick(issue.tag, locale)}
                </span>
                <strong style={{ fontFamily: "var(--display)", fontSize: 21, lineHeight: 1.25 }}>{pick(issue.headline, locale)}</strong>
                <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{pick(issue.evidence, locale)}</span>
                <div style={{ height: 1, background: "var(--paper-2)" }} />
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  <strong style={{ color: "var(--ink)" }}>{t.issues.whoseJob}:</strong> {pick(issue.jurisdiction, locale)}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", background: "var(--amber-bg)", border: "1px solid var(--amber-rule)" }}>
                  <span style={{ fontSize: 12, color: "#6b5a2b" }}>
                    {fill(t.issues.positionsSourced, { done: 0, total: council.length })}
                  </span>
                </div>
                <SourceLine source={issue.source} label={t.sourcing.sourceLabel} />
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "28px 30px" }}>
            <strong style={{ fontFamily: "var(--display)", fontSize: 24 }}>{t.issues.howTitle}</strong>
            <div className="grid g4" style={{ marginTop: 16 }}>
              {steps.map((s, i) => (
                <div key={s} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="num" style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 13, color: "#cdc5b4" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
