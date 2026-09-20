import AddressLookup from "@/components/AddressLookup";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WardPicker from "@/components/WardPicker";
import { DEFAULT_LOCALE, getDict, isLocale, type Locale } from "@/i18n";
import { roadPaths, wardShapes } from "@/lib/wardmap";

export const metadata = { title: "Find my ward" };

export default async function FindWard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = getDict(locale);
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

  const shapes = wardShapes();
  const { paths: roads, labels: roadLabels } = roadPaths(shapes);

  return (
    <>
      <SiteHeader locale={locale} path="my-ward" />
      <main id="main">
        <section className="section">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: "62ch" }}>
            <h1 style={{ fontSize: 44 }}>{t.ward.finderTitle}</h1>
            <p style={{ margin: 0, fontSize: 16.5, color: "var(--ink-soft)" }}>{t.ward.finderIntro}</p>
          </div>
        </section>
        <section className="section" style={{ borderBottom: "none" }}>
          <div style={{ display: "flex", gap: 44, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "0 1 560px" }}>
              <WardPicker
                shapes={shapes}
                roads={roads}
                roadLabels={roadLabels}
                locale={locale}
                labels={{
                  locate: t.ward.locate,
                  locating: t.ward.searching,
                  notFound: t.ward.notFound,
                  tapMap: t.ward.tapMap,
                  mapLabel: t.ward.mapLabel,
                }}
              />
            </div>
            <div style={{ flex: "1 1 340px", maxWidth: 420, background: "var(--card)", border: "1px solid var(--ink)", padding: 24 }}>
              <AddressLookup locale={locale} labels={lookupLabels} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
