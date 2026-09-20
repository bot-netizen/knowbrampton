import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SourceLine from "@/components/SourceLine";
import { PAY_TABLE, ROLES, UNSOURCED_NOTE } from "@/content/government";
import { pick } from "@/content/types";
import { DEFAULT_LOCALE, getDict, isLocale, type Locale } from "@/i18n";

export const metadata = { title: "Who you're actually electing" };

export default async function HowItWorks({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);

  const orders = [
    { key: "federal", label: t.gov.federal, elect: t.gov.federalElect, runs: t.gov.federalRuns, colour: "var(--muted)", provincial: false },
    { key: "provincial", label: t.gov.provincial, elect: t.gov.provincialElect, runs: t.gov.provincialRuns, colour: "#2f6b3a", provincial: true },
    { key: "regional", label: t.gov.regional, elect: t.gov.regionalElect, runs: t.gov.regionalRuns, colour: "var(--teal)", provincial: false },
    { key: "municipal", label: t.gov.municipal, elect: t.gov.municipalElect, runs: t.gov.municipalRuns, colour: "var(--crimson)", provincial: false },
    { key: "boards", label: t.gov.boards, elect: t.gov.boardsElect, runs: t.gov.boardsRuns, colour: "#4a3a78", provincial: false },
  ];

  const onBallot = ROLES.filter((r) => r.onBallot);
  const comparison = ROLES.filter((r) => !r.onBallot);
  const maxPay = Math.max(...PAY_TABLE.map((p) => p.amount));

  const field = (label: string, value: string) => (
    <div style={{ display: "grid", gridTemplateColumns: "104px 1fr", gap: 12, padding: "9px 0", borderTop: "1px solid var(--paper-2)" }}>
      <span style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{value}</span>
    </div>
  );

  const roleCard = (r: (typeof ROLES)[number]) => (
    <div key={r.slug} className="card" style={{ borderTop: `3px solid ${r.colour}`, display: "flex", flexDirection: "column" }}>
      <strong style={{ fontFamily: "var(--display)", fontSize: 22, color: r.colour }}>{pick(r.title, locale)}</strong>
      {field(t.gov.electedBy, pick(r.electedBy, locale))}
      {field(t.gov.decides, pick(r.decides, locale))}
      {field(t.gov.cannot, pick(r.cannot, locale))}
      {field(t.gov.term, pick(r.term, locale))}
      {field(t.gov.pay, pick(r.pay, locale))}
      {field(t.gov.paidBy, pick(r.paidBy, locale))}
      <div style={{ marginTop: 10, padding: "12px 14px", background: "var(--paper-2)", borderLeft: `3px solid ${r.colour}` }}>
        <div style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>
          {t.gov.whyRun}
        </div>
        <span style={{ fontSize: 13.5 }}>{pick(r.whyRun, locale)}</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <SourceLine source={r.source} label={t.sourcing.sourceLabel} />
      </div>
    </div>
  );

  return (
    <>
      <SiteHeader locale={locale} path="how-it-works" />
      <main id="main">
        <section className="section">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "64ch" }}>
            <span className="kicker">{t.gov.kicker}</span>
            <h1 style={{ fontSize: 48 }}>{t.gov.title}</h1>
            <p style={{ margin: 0, fontSize: 17, color: "var(--ink-soft)" }}>{t.gov.standfirst}</p>
          </div>
        </section>

        {/* The single most common misconception, answered first and bluntly. */}
        <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", borderBottom: "none" }}>
          <div style={{ display: "flex", gap: 44, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 auto" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
                {t.gov.reportTitle}
              </div>
              <div className="stat" style={{ fontSize: 46, marginTop: 8 }}>{t.gov.reportAnswer}</div>
            </div>
            <p style={{ flex: "1 1 460px", margin: 0, fontSize: 16, color: "#cdc5b4", maxWidth: "62ch" }}>{t.gov.reportBody}</p>
          </div>
        </section>

        <section className="section">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <h2 style={{ fontSize: 30 }}>{t.gov.ordersTitle}</h2>
            <span style={{ fontSize: 13, color: "var(--muted)", maxWidth: "48ch" }}>{t.gov.ordersNote}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 14 }} className="orders">
            {orders.map((o) => (
              <div key={o.key} style={{ background: "var(--card)", border: "1px solid var(--rule)", borderTop: `4px solid ${o.colour}`, padding: "16px 15px", display: "flex", flexDirection: "column", gap: 10 }}>
                <strong style={{ fontSize: 14.5, color: o.colour }}>{o.label}</strong>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>{t.gov.youElect}</div>
                  <span style={{ fontSize: 13 }}>{o.elect}</span>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>{t.gov.theyRun}</div>
                  <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{o.runs}</span>
                </div>
              </div>
            ))}
          </div>

          {/* The one direction of control that is real. */}
          <div style={{ marginTop: 22, border: "1px solid var(--amber-rule)", background: "var(--amber-bg)", padding: "20px 22px" }}>
            <strong style={{ fontFamily: "var(--display)", fontSize: 21, color: "#6b5a2b" }}>{t.gov.hierarchyTitle}</strong>
            <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "#6b5a2b", maxWidth: "76ch" }}>{t.gov.hierarchyBody}</p>
            <div className="grid g2" style={{ marginTop: 16 }}>
              <div style={{ background: "#fff", border: "1px solid var(--amber-rule)", padding: "14px 16px" }}>
                <strong style={{ fontSize: 14.5 }}>{t.gov.proof1Title}</strong>
                <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--ink-soft)" }}>{t.gov.proof1Body}</p>
              </div>
              <div style={{ background: "#fff", border: "1px solid var(--amber-rule)", padding: "14px 16px" }}>
                <strong style={{ fontSize: 14.5 }}>{t.gov.proof2Title}</strong>
                <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--ink-soft)" }}>{t.gov.proof2Body}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 style={{ fontSize: 30, marginBottom: 18 }}>{t.gov.rolesTitle}</h2>
          <div className="grid g2">{onBallot.map(roleCard)}</div>
          <h3 style={{ fontFamily: "var(--body)", fontSize: 15, marginTop: 30, marginBottom: 14, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)" }}>
            {t.gov.notOnBallot}
          </h3>
          <div className="grid g2">{comparison.map(roleCard)}</div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <h2 style={{ fontSize: 30 }}>{t.gov.payTitle}</h2>
            <span style={{ fontSize: 13, color: "var(--muted)", maxWidth: "52ch" }}>{t.gov.payNote}</span>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--rule)", padding: "22px 24px" }}>
            {PAY_TABLE.map((row) => (
              <div key={row.label.en} style={{ display: "grid", gridTemplateColumns: "190px 1fr 140px", gap: 14, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--paper-2)" }}>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{pick(row.label, locale)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ height: 22, width: `${(row.amount / maxPay) * 100}%`, background: row.colour, minWidth: 4 }} />
                  <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>{pick(row.display, locale)}</span>
                </div>
                <span style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "right" }}>{pick(row.paidBy, locale)}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 420px", background: "var(--paper-2)", borderLeft: "4px solid var(--ink)", padding: "16px 18px" }}>
              <strong style={{ fontSize: 15 }}>{t.gov.gapTitle}</strong>
              <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--ink-soft)" }}>{t.gov.gapBody}</p>
            </div>
            <div style={{ flex: "1 1 320px", border: "1px solid var(--rule)", padding: "16px 18px" }}>
              <strong style={{ fontSize: 15 }}>{t.gov.sourcesTitle}</strong>
              <p style={{ margin: "6px 0 10px", fontSize: 13, color: "var(--ink-soft)" }}>{t.gov.sourcesBody}</p>
              <SourceLine source={UNSOURCED_NOTE} label={t.sourcing.notSourced} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
