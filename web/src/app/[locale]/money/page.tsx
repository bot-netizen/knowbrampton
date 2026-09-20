import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SourceLine from "@/components/SourceLine";
import { CASE_AGAINST, CASE_FOR, CHARTS, HEADLINE, type LedgerItem } from "@/content/money";
import { pick } from "@/content/types";
import { DEFAULT_LOCALE, getDict, isLocale, type Locale } from "@/i18n";

export const metadata = { title: "Where the money goes" };

function Ledger({ items, colour, mark, locale, label }: { items: LedgerItem[]; colour: string; mark: string; locale: Locale; label: string }) {
  return (
    <div>
      {items.map((it) => (
        <div key={it.title.en} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--rule)" }}>
          <span aria-hidden="true" style={{ flexShrink: 0, width: 18, fontFamily: "var(--display)", fontSize: 19, fontWeight: 700, color: colour }}>
            {mark}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <strong style={{ fontSize: 15 }}>{pick(it.title, locale)}</strong>
            <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>{pick(it.body, locale)}</span>
            <SourceLine source={it.source} label={label} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Money({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);

  return (
    <>
      <SiteHeader locale={locale} path="money" />
      <main id="main">
        <section className="section">
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "64ch" }}>
            <span className="kicker">{t.money.kicker}</span>
            <h1 style={{ fontSize: 48 }}>{t.money.title}</h1>
            <p style={{ margin: 0, fontSize: 17, color: "var(--ink-soft)" }}>{t.money.standfirst}</p>
          </div>
        </section>

        <section className="section" style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {HEADLINE.map((h) => (
            <div key={h.label.en} style={{ flex: "1 1 190px", borderLeft: "2px solid var(--rule)", paddingLeft: 18 }}>
              <div className="stat num" style={{ fontSize: 34 }}>{pick(h.value, locale)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>{pick(h.label, locale)}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 6 }}>{pick(h.note, locale)}</div>
              <SourceLine source={h.source} label={t.sourcing.sourceLabel} />
            </div>
          ))}
        </section>

        <section className="section">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <h2 style={{ fontSize: 30 }}>{t.money.threeNumbers}</h2>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.money.chartNote}</span>
          </div>
          <div className="grid g3">
            {CHARTS.map((c) => {
              const rowH = 44;
              const h = c.bars.length * rowH + 8;
              return (
                <div className="card" key={c.title.en}>
                  <strong style={{ fontSize: 16 }}>{pick(c.title, locale)}</strong>
                  <p style={{ marginTop: 4 }}>{pick(c.sub, locale)}</p>
                  <svg viewBox={`0 0 560 ${h}`} width="100%" height={h} role="img" aria-label={pick(c.title, locale)} style={{ marginTop: 10 }}>
                    {c.bars.map((b, i) => {
                      const w = (b.value / c.max) * 330;
                      const y = 6 + i * rowH;
                      return (
                        <g key={b.label.en}>
                          <text x={168} y={y + 18} textAnchor="end" fontFamily="var(--font-archivo), sans-serif" fontSize={13} fill="var(--ink)">
                            {pick(b.label, locale)}
                          </text>
                          <rect x={176} y={y} width={w} height={26} fill={b.colour} />
                          <text x={176 + w + 9} y={y + 18} fontFamily="var(--font-archivo), sans-serif" fontSize={13} fontWeight={700} fill="var(--ink)">
                            {pick(b.display, locale)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div style={{ borderTop: "1px solid var(--paper-2)", paddingTop: 8, marginTop: 6 }}>
                    <SourceLine source={c.source} label={t.sourcing.sourceLabel} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            <h2 style={{ fontSize: 30 }}>{t.money.goodBad}</h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", maxWidth: "70ch" }}>{t.money.goodBadIntro}</p>
          </div>
          <div className="grid g2" style={{ gap: 34 }}>
            <div>
              <div style={{ paddingBottom: 10, borderBottom: "2px solid var(--teal)" }}>
                <strong style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--teal)" }}>{t.money.caseFor}</strong>
              </div>
              <Ledger items={CASE_FOR} colour="var(--teal)" mark="+" locale={locale} label={t.sourcing.sourceLabel} />
            </div>
            <div>
              <div style={{ paddingBottom: 10, borderBottom: "2px solid var(--crimson)" }}>
                <strong style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--crimson)" }}>{t.money.caseAgainst}</strong>
              </div>
              <Ledger items={CASE_AGAINST} colour="var(--crimson)" mark="−" locale={locale} label={t.sourcing.sourceLabel} />
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 22, maxWidth: "76ch" }}>{t.money.method}</p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
