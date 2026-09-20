import { href, type Locale } from "@/i18n";
import type { Candidate } from "@/lib/data";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

/** No photo: the City publishes headshots for sitting councillors only, and we
 *  will not scrape a challenger's social media to fill the gap. */
export default function CandidateCard({
  c,
  locale,
  incumbent,
  labels,
}: {
  c: Candidate;
  locale: Locale;
  incumbent: boolean;
  labels: { incumbent: string; started: string; acclaimed: string };
}) {
  return (
    <a
      href={href(locale, `candidates/${c.slug}`)}
      style={{ background: "var(--card)", border: "1px solid var(--rule)", padding: 16, display: "flex", flexDirection: "column", gap: 10, color: "var(--ink)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div
          aria-hidden="true"
          style={{ flexShrink: 0, width: 42, height: 42, borderRadius: "50%", background: "var(--paper-2)", border: "1px solid var(--rule-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--display)", fontSize: 15, fontWeight: 600, color: "var(--muted)" }}
        >
          {initials(c.name)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <strong style={{ fontSize: 14.5, lineHeight: 1.2 }}>{c.name}</strong>
          {incumbent && <span className="badge badge-verified">{labels.incumbent}</span>}
          {c.acclaimed && <span className="badge badge-unsourced">{labels.acclaimed}</span>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 9, borderTop: "1px solid var(--paper-2)" }}>
        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#c4a05a", flexShrink: 0 }} />
        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{labels.started}</span>
      </div>
    </a>
  );
}
