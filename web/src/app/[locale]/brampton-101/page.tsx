import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WardMap from "@/components/WardMap";
import { CITY_FACTS, TIMELINE, WHO_DOES_WHAT } from "@/content/basics";
import { pick } from "@/content/types";
import { DEFAULT_LOCALE, fill, getDict, isLocale, type Locale } from "@/i18n";
import { candidates, council, wardPairs } from "@/lib/data";
import { PAIR_COLOURS } from "@/lib/wardmap-shared";
import { roadPaths, wardShapes } from "@/lib/wardmap";

export const metadata = { title: "Brampton 101" };

export default async function Basics({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
  const shapes = wardShapes();
  const { paths: roads, labels: roadLabels } = roadPaths(shapes);
  const all = candidates();
  const sitting = council();
  const pairs = Object.keys(wardPairs());

  return (
    <>
      <SiteHeader locale={locale} path="brampton-101" />
      <main id="main">
        <section className="section" style={{ display: "flex", gap: 48, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "62ch" }}>
            <span className="kicker">{t.basics.kicker}</span>
            <h1 style={{ fontSize: 48 }}>{t.basics.title}</h1>
            <p style={{ margin: 0, fontSize: 17, color: "var(--ink-soft)" }}>{t.basics.standfirst}</p>
          </div>
          <div style={{ maxWidth: 320, background: "var(--paper-2)", border: "1px solid var(--rule)", padding: 18 }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)" }}>{t.basics.boundaryNote}</p>
          </div>
        </section>

        <section className="section" style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
          {CITY_FACTS.map((f) => (
            <div key={f.label.en} style={{ flex: "1 1 170px", borderLeft: "2px solid var(--rule)", paddingLeft: 18 }}>
              <div className="stat num" style={{ fontSize: 38 }}>{pick(f.value, locale)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>{pick(f.label, locale)}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{pick(f.note, locale)}</div>
            </div>
          ))}
        </section>

        <section className="section" style={{ display: "flex", gap: 46, flexWrap: "wrap" }}>
          <div style={{ flex: "0 1 600px" }}>
            <h2 style={{ fontSize: 30, marginBottom: 14 }}>{t.basics.wardsTitle}</h2>
            <div style={{ border: "1px solid var(--rule)", background: "#fdfcf9", padding: 10 }}>
              <WardMap shapes={shapes} roads={roads} roadLabels={roadLabels} label={t.ward.mapLabel} width={600} />
            </div>
          </div>
          <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontFamily: "var(--body)", fontSize: 17 }}>{t.basics.holdsNow}</h3>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)" }}>{t.basics.pairsIntro}</p>
            {pairs.map((pair) => {
              const colour = PAIR_COLOURS[pair] ?? "var(--muted)";
              const ward = pair.split("+")[0];
              const reg = sitting.find((m) => m.role === "Regional Councillor" && m.wards.includes(ward));
              const city = sitting.find((m) => m.role === "City Councillor" && m.wards.includes(ward));
              const nReg = all.filter((c) => c.office === "regional_councillor" && c.pair === pair).length;
              const nCity = all.filter((c) => c.office === "city_councillor" && c.pair === pair).length;
              return (
                <div key={pair} style={{ display: "grid", gridTemplateColumns: "72px 1fr 1fr", gap: 14, alignItems: "center", background: "var(--card)", border: "1px solid var(--rule)", borderLeft: `4px solid ${colour}`, padding: "12px 15px" }}>
                  <span style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 700, color: colour }}>{pair}</span>
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {t.basics.regionalCllr} · {fill(t.basics.nRunning, { n: nReg })}
                    </div>
                    <strong style={{ fontSize: 14 }}>{reg?.name ?? "—"}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {t.basics.cityCllr} · {fill(t.basics.nRunning, { n: nCity })}
                    </div>
                    <strong style={{ fontSize: 14 }}>{city?.name ?? "—"}</strong>
                  </div>
                </div>
              );
            })}
            <div style={{ background: "var(--paper-2)", borderLeft: "4px solid var(--ink)", padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 13.5 }}>
                <strong>{t.basics.whyPairs}</strong> {t.basics.whyPairsBody}
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 style={{ fontSize: 30, marginBottom: 18 }}>{t.basics.twoCouncils}</h2>
          <div className="grid g2">
            <div style={{ background: "var(--card)", border: "1px solid var(--ink)", padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontFamily: "var(--display)", fontSize: 22 }}>{t.basics.cityCouncil}</strong>
                <span className="num stat" style={{ fontSize: 36, color: "var(--crimson)" }}>11</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{t.basics.cityCouncilBody}</p>
              <div style={{ height: 1, background: "var(--rule)", margin: "12px 0" }} />
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>{t.basics.strongMayor}</p>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--ink)", padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontFamily: "var(--display)", fontSize: 22 }}>{t.basics.peelCouncil}</strong>
                <span className="num stat" style={{ fontSize: 36, color: "var(--teal)" }}>25</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{t.basics.peelCouncilBody}</p>
              <div style={{ height: 1, background: "var(--rule)", margin: "12px 0" }} />
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>{t.basics.peelCouncilNote}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <h2 style={{ fontSize: 30 }}>{t.basics.whoToPhone}</h2>
            <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{t.basics.whoToPhoneSub}</span>
          </div>
          <div className="grid g4">
            {WHO_DOES_WHAT.map((w) => (
              <div className="card" key={w.title.en} style={{ borderTop: `3px solid ${w.colour}` }}>
                <strong style={{ fontSize: 16, color: w.colour }}>{pick(w.title, locale)}</strong>
                <p>{pick(w.body, locale)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <h2 style={{ fontSize: 30, marginBottom: 18 }}>{t.basics.cycleTitle}</h2>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {TIMELINE.map((s) => (
              <div key={s.title.en} style={{ flex: "1 1 160px", paddingTop: 16, borderTop: `2px solid ${s.past ? "var(--rule-2)" : "var(--crimson)"}` }}>
                <div className="num" style={{ fontSize: 12, fontWeight: 700, color: s.past ? "var(--muted)" : "var(--crimson)" }}>
                  {pick(s.date, locale)}
                </div>
                <strong style={{ fontSize: 14.5, display: "block", margin: "4px 0" }}>{pick(s.title, locale)}</strong>
                <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{pick(s.body, locale)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
