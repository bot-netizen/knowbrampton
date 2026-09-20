import CandidateCard from "@/components/CandidateCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { DEFAULT_LOCALE, fill, getDict, href, isLocale, type Locale } from "@/i18n";
import { candidates, council, wardPairs } from "@/lib/data";
import { PAIR_COLOURS } from "@/lib/wardmap-shared";

export const metadata = { title: "Election 2026" };

export default async function Candidates({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
  const all = candidates();
  const sitting = council();
  const sittingNames = new Set(sitting.map((m) => m.name));

  const mayors = all.filter((c) => c.office === "mayor");
  const forCouncil = all.filter((c) => c.office !== "trustee");
  const acclaimed = all.filter((c) => c.acclaimed).length;
  const pairs = Object.keys(wardPairs());
  const trusteeBoards = [...new Set(all.filter((c) => c.office === "trustee").map((c) => c.board ?? ""))].filter(Boolean);

  const cardLabels = { incumbent: t.candidates.incumbent, started: t.candidates.profileStarted, acclaimed: t.candidates.acclaimed };

  return (
    <>
      <SiteHeader locale={locale} path="candidates" />
      <main id="main">
        <section className="section" style={{ display: "flex", gap: 48, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: "62ch" }}>
            <span className="kicker">{t.candidates.kicker}</span>
            <h1 style={{ fontSize: 48 }}>{t.candidates.title}</h1>
            <p style={{ margin: 0, fontSize: 17, color: "var(--ink-soft)" }}>{t.candidates.standfirst}</p>
          </div>
          <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
            {[
              { n: all.length, l: t.candidates.candidates, c: "var(--ink)" },
              { n: 11, l: t.candidates.councilSeats, c: "var(--ink)" },
              { n: acclaimed, l: t.candidates.acclaimed, c: "var(--crimson)" },
            ].map((s) => (
              <div key={s.l}>
                <div className="stat num" style={{ fontSize: 42, color: s.c }}>{s.n}</div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-soft)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <h2 style={{ fontSize: 30 }}>{fill(t.candidates.mayorTitle, { n: mayors.length })}</h2>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.candidates.ballotOrder}</span>
          </div>
          <div className="grid g4">
            {mayors.map((c) => (
              <CandidateCard key={c.slug} c={c} locale={locale} incumbent={sittingNames.has(c.name)} labels={cardLabels} />
            ))}
          </div>
        </section>

        <section className="section">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <h2 style={{ fontSize: 30 }}>{t.candidates.racesTitle}</h2>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.candidates.racesSub}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {pairs.map((pair) => {
              const colour = PAIR_COLOURS[pair] ?? "var(--muted)";
              const ward = pair.split("+")[0];
              const reg = all.filter((c) => c.office === "regional_councillor" && c.pair === pair);
              const city = all.filter((c) => c.office === "city_councillor" && c.pair === pair);
              const regHolder = sitting.find((m) => m.role === "Regional Councillor" && m.wards.includes(ward))?.name;
              const cityHolder = sitting.find((m) => m.role === "City Councillor" && m.wards.includes(ward))?.name;
              return (
                <div key={pair} style={{ display: "grid", gridTemplateColumns: "84px 1fr 1fr 120px", gap: 18, alignItems: "center", background: "var(--card)", border: "1px solid var(--rule)", borderLeft: `4px solid ${colour}`, padding: "15px 18px" }}>
                  <span style={{ fontFamily: "var(--display)", fontSize: 22, fontWeight: 700, color: colour }}>{pair}</span>
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                      {t.ballot.regional}
                    </div>
                    <span style={{ fontSize: 13.5 }}>
                      <strong className="num">{reg.length}</strong> · {regHolder ?? "—"}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                      {t.ballot.city}
                    </div>
                    <span style={{ fontSize: 13.5 }}>
                      <strong className="num">{city.length}</strong> · {cityHolder ?? "—"}
                    </span>
                  </div>
                  <a href={href(locale, `my-ward/${ward}`)} style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>
                    {t.candidates.openRace} →
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <h2 style={{ fontSize: 30, marginBottom: 14 }}>{t.candidates.trusteesTitle}</h2>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", maxWidth: "72ch" }}>
            <strong>{t.candidates.alsoBallot}</strong> {t.candidates.alsoBallotBody}
          </p>
          <div className="grid g3" style={{ marginTop: 14 }}>
            {trusteeBoards.map((board) => {
              const group = all.filter((c) => c.office === "trustee" && c.board === board);
              return (
                <div className="card" key={board}>
                  <strong style={{ fontSize: 15 }}>{board}</strong>
                  <p>
                    <span className="num">{group.length}</span> {t.candidates.candidates}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {group.slice(0, 6).map((c) => (
                      <a key={c.slug} href={href(locale, `candidates/${c.slug}`)} style={{ fontSize: 12.5, padding: "3px 8px", border: "1px solid var(--rule)", background: "var(--paper)" }}>
                        {c.name}
                      </a>
                    ))}
                    {group.length > 6 && <span style={{ fontSize: 12.5, color: "var(--muted)", alignSelf: "center" }}>+{group.length - 6}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 20 }}>
            {forCouncil.length} / {all.length} — {t.candidates.councilSeats}
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
