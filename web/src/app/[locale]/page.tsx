import AddressLookup from "@/components/AddressLookup";
import Countdown from "@/components/Countdown";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { DEFAULT_LOCALE, fill, getDict, href, isLocale, type Locale } from "@/i18n";
import { candidates, daysUntil, manifest } from "@/lib/data";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
  const m = manifest();
  const all = candidates();

  const days = daysUntil(m.election_day);
  const advanceDays = daysUntil(m.advance_voting_days[0]);
  const mayorCount = all.filter((c) => c.office === "mayor").length;
  const councilCount = all.filter((c) => c.office !== "trustee").length;

  const lookupLabels = {
    lookupLabel: t.ward.lookupLabel,
    lookupPlaceholder: t.ward.lookupPlaceholder,
    lookupCta: t.ward.lookupCta,
    lookupHelp: t.ward.lookupHelp,
    loading: t.ward.loading,
    foundWard: t.ward.foundWard,
    seeBallot: t.ward.seeBallot,
    fsaSpans: t.ward.fsaSpans,
    fsaPick: t.ward.fsaPick,
    fsaDecisive: t.ward.fsaDecisive,
    streetSpans: t.ward.streetSpans,
    noMatch: t.ward.noMatch,
    didYouMean: t.ward.didYouMean,
    shareNote: t.ward.shareNote,
  };

  const ballot = [
    { n: "01", title: t.ballot.mayor, body: t.ballot.mayorBody, extra: fill(t.ballot.candidateCount, { n: mayorCount }) },
    { n: "02", title: t.ballot.regional, body: t.ballot.regionalBody, extra: null },
    { n: "03", title: t.ballot.city, body: t.ballot.cityBody, extra: null },
    { n: "04", title: t.ballot.trustee, body: t.ballot.trusteeBody, extra: null },
  ];

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <section className="band-dark">
          <div style={{ display: "flex", gap: 52, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: "1 1 560px" }}>
              <span className="kicker">{t.home.kicker}</span>
              <h1 style={{ textWrap: "pretty" }}>{t.home.headline}</h1>
              <p style={{ margin: 0 }}>{t.home.standfirst}</p>
            </div>
            <div className="countdown">
              <span style={{ fontSize: 12, color: "#9a937f" }}>{t.home.daysLabel}</span>
              <div className="num big" style={{ fontFamily: "var(--display)" }}>
                <Countdown targetIso={m.election_day} initial={days} />
              </div>
              <div style={{ height: 1, background: "#3a362c", margin: "13px 0 11px" }} />
              <span style={{ fontSize: 13.5, color: "#cdc5b4" }}>
                {advanceDays > 0 ? (
                  <>
                    {t.home.advanceNote.split("{days}")[0]}
                    <Countdown targetIso={m.advance_voting_days[0]} initial={advanceDays} />
                    {t.home.advanceNote.split("{days}")[1]}
                  </>
                ) : (
                  t.home.advanceOpenNote
                )}
              </span>
            </div>
          </div>
        </section>

        <section className="section">
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            <h2 style={{ fontSize: 30 }}>{t.home.ballotTitle}</h2>
            <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{t.home.ballotSub}</span>
          </div>
          <div className="grid g4">
            {ballot.map((b) => (
              <div className="card" key={b.n}>
                <span className="num" style={{ fontFamily: "var(--display)", fontSize: 15, color: "var(--crimson)", fontWeight: 700 }}>
                  {b.n}
                </span>
                <h3 style={{ marginTop: 8 }}>{b.title}</h3>
                <p>
                  {b.body}
                  {b.extra ? <> <strong>{b.extra}</strong></> : null}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 18 }}>
            {t.home.pairNote} <a href={href(locale, "brampton-101")}>{t.home.pairLink} →</a>
          </p>
        </section>

        <section className="section section-tint" style={{ display: "flex", gap: 42, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div className="stat num" style={{ fontSize: 82, color: "var(--crimson)" }}>
              {t.home.turnoutStat}
            </div>
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.home.turnoutStatLabel}</span>
          </div>
          <div style={{ flex: "1 1 520px", display: "flex", flexDirection: "column", gap: 11 }}>
            <h2 style={{ fontSize: 27 }}>{t.home.turnoutTitle}</h2>
            <p style={{ margin: 0, fontSize: 15, color: "var(--ink-soft)" }}>{t.home.turnoutBody}</p>
          </div>
        </section>

        <section className="section" style={{ borderBottom: "none" }}>
          <h2 style={{ fontSize: 30, marginBottom: 18 }}>{t.home.addressTitle}</h2>
          <div style={{ background: "var(--card)", border: "1px solid var(--ink)", padding: 28 }}>
            <AddressLookup locale={locale} labels={lookupLabels} />
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
            {t.home.addressHelp} <a href={href(locale, "my-ward")}>{t.ward.tapMap} →</a>
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            {fill(t.home.fieldNote, { n: councilCount })}
          </p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
