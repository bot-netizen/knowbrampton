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
            <div style={{ flex: "1 1 300px", maxWidth: 380, background: "var(--paper-2)", border: "1px solid var(--rule)", padding: 22 }}>
              <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)" }}>{t.ward.addressSoon}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
