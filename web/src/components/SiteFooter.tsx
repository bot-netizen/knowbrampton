import { fill, getDict, href, type Locale } from "@/i18n";
import { manifest } from "@/lib/data";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const m = manifest();
  const other = locale === "en" ? "pa" : "en";
  return (
    <footer className="site-foot">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
        <p>{t.site.disclaimer}</p>
        <a href={href(other as Locale)} lang={other}>
          {t.nav.readInOther} →
        </a>
      </div>
      <p style={{ marginTop: 14, fontSize: 11.5, color: "#8a8271" }}>
        {fill(t.site.dataPulled, { date: m.generated_at.slice(0, 10) })}
      </p>
    </footer>
  );
}
