import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WardMap from "@/components/WardMap";
import { DEFAULT_LOCALE, fill, getDict, href, isLocale, LOCALES, type Locale } from "@/i18n";
import { advancePolls, manifest, racesForWard, votingDayPolls, wardPairs } from "@/lib/data";
import { roadPaths, wardShapes } from "@/lib/wardmap";

export function generateStaticParams() {
  const wards = Object.values(wardPairs()).flat();
  return LOCALES.flatMap((locale) => wards.map((ward) => ({ locale, ward })));
}

export default async function WardPage({
  params,
}: {
  params: Promise<{ locale: string; ward: string }>;
}) {
  const { locale: raw, ward } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
  const info = racesForWard(ward);
  const m = manifest();
  const shapes = wardShapes();
  const { paths: roads, labels: roadLabels } = roadPaths(shapes);

  const advance = advancePolls().find((p) => p.ward === ward) ?? null;
  const dayPolls = votingDayPolls().filter((p) => p.ward === ward);
  const allDay = votingDayPolls().length;

  const raceLabel: Record<string, string> = {
    mayor: t.ballot.mayor,
    regional_councillor: t.ballot.regional,
    city_councillor: t.ballot.city,
    trustee: t.ballot.trustee,
  };

  return (
    <>
      <SiteHeader locale={locale} path={`my-ward/${ward}`} />
      <main id="main">
        <section className="section">
          <span className="kicker">{fill(t.ward.resultFor, { address: `Ward ${ward}` })}</span>
          <h1 style={{ fontSize: 42, marginTop: 10 }}>
            {fill(t.ward.youLiveIn, { ward, partner: info.partner ?? "—" })}
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", maxWidth: "60ch" }}>{t.ward.intro}</p>
        </section>

        <section className="section">
          <div style={{ display: "flex", gap: 44, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "0 1 560px" }}>
              <div style={{ border: "1px solid var(--rule)", background: "#fdfcf9", padding: 10 }}>
                <WardMap
                  shapes={shapes}
                  roads={roads}
                  roadLabels={roadLabels}
                  highlight={ward}
                  partner={info.partner}
                  label={t.ward.mapLabel}
                  width={560}
                />
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 10, fontSize: 12.5, color: "var(--ink-soft)", flexWrap: "wrap" }}>
                <span>◼ {t.ward.yourWard} {ward}</span>
                <span>◻ {t.ward.pairedWard} {info.partner ?? "—"}</span>
              </div>
            </div>

            <div style={{ flex: "1 1 520px" }}>
              <h2 style={{ fontSize: 26, marginBottom: 14 }}>{t.ward.yourRaces}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {info.races.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--rule)",
                      padding: "15px 18px",
                      display: "flex",
                      gap: 16,
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 15.5 }}>{raceLabel[r.key]}</strong>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>
                        {r.board ? `${r.board} · ` : ""}
                        {r.scope === "city-wide" ? "city-wide" : `wards ${r.scope}`}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="num" style={{ fontSize: 14.5, fontWeight: 600 }}>
                        {fill(t.ward.running, { n: r.candidates.length })}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                        {r.holder ? fill(t.ward.held, { name: r.holder }) : t.ward.heldNobody}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16 }}>
                <a href={href(locale, "candidates")}>{t.nav.election} →</a>
              </p>
            </div>
          </div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <div className="grid g2">
            <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "24px 26px" }}>
              <span className="kicker">{t.ward.advanceTitle}</span>
              {advance ? (
                <>
                  <h3 style={{ fontFamily: "var(--display)", fontSize: 22, marginTop: 12, color: "var(--paper)" }}>
                    {advance.name}
                  </h3>
                  <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#cdc5b4" }}>
                    {advance.address} — {t.ward.advanceYours}
                  </p>
                  <div style={{ height: 1, background: "#3a362c", margin: "14px 0" }} />
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.8 }}>
                    {advance.sessions?.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: 14, fontSize: 12.5, color: "#cdc5b4" }}>
                    {advance.wait_time ? `Wait: ${advance.wait_time}` : t.ward.waitLive}
                  </p>
                </>
              ) : (
                <p style={{ color: "#cdc5b4" }}>—</p>
              )}
            </div>

            <div className="card">
              <span className="kicker">{t.ward.dayTitle}</span>
              <p style={{ fontSize: 13.5, marginTop: 10 }}>{fill(t.ward.dayBody, { ward })}</p>
              <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
                {dayPolls.map((p) => (
                  <div
                    key={`${p.name}-${p.address}`}
                    style={{ padding: "10px 0", borderBottom: "1px solid var(--paper-2)" }}
                  >
                    <strong style={{ fontSize: 14 }}>{p.name}</strong>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.address}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12 }}>
                {fill(t.ward.dayCount, { n: allDay })} {t.ward.confirmNote}
              </p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 18 }}>
            Election day {m.election_day}. Advance voting {m.advance_voting_days.join(", ")}.
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
