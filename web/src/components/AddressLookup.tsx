"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset, type Locale } from "@/i18n";
import {
  type FsaTable,
  type Result,
  type StreetIndex,
  parseFsa,
  prettyStreet,
  resolve,
} from "@/lib/lookup";

type Labels = Record<string, string>;
const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? `{${k}}`));

/** Everything resolves on-device against the shipped tables. No address, postal
 *  code or coordinate is ever sent to a server, so there is nothing to log. */
export default function AddressLookup({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [ready, setReady] = useState(false);
  const data = useRef<{ index: StreetIndex; fsa: FsaTable } | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  // 84 KB of tables, fetched once the page is interactive rather than inlined
  // into every page's HTML.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [index, fsa] = await Promise.all([
          fetch(asset("/data/address_index.json")).then((r) => r.json()),
          fetch(asset("/data/fsa_wards.json")).then((r) => r.json()),
        ]);
        if (!cancelled) {
          data.current = { index, fsa };
          setReady(true);
        }
      } catch {
        if (!cancelled) setReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const go = useCallback((ward: number) => {
    window.location.href = asset(`/${locale}/my-ward/${ward}/`);
  }, [locale]);

  const submit = useCallback(() => {
    if (!data.current) return;
    const r = resolve(data.current.index, data.current.fsa, value);
    if (r.kind === "ward") {
      go(r.ward);
      return;
    }
    setResult(r);
  }, [go, value]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const wardButtons = (wards: number[]) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
      {wards.map((w) => (
        <button key={w} type="button" className="cta" style={{ padding: "0 16px" }} onClick={() => go(w)}>
          {fill(labels.foundWard, { ward: w })}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px" }}>
          <label className="field" htmlFor="kb-lookup">
            {labels.lookupLabel}
          </label>
          <input
            id="kb-lookup"
            type="text"
            autoComplete="street-address"
            placeholder={labels.lookupPlaceholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>
        <button type="submit" className="cta" disabled={!ready} style={{ minHeight: 52 }}>
          {ready ? labels.lookupCta : labels.loading}
        </button>
      </form>

      <div ref={liveRef} aria-live="polite" style={{ marginTop: result ? 16 : 10 }}>
        {!result && <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)" }}>{labels.lookupHelp}</p>}

        {result?.kind === "pair" && (
          <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-rule)", padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "#6b5a2b" }}>
              {result.pairs.length === 1
                ? fill(labels.fsaDecisive, { fsa: result.fsa, pair: result.pairs[0] })
                : fill(labels.fsaSpans, { fsa: result.fsa, wards: result.wards.join(", ") })}
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "#6b5a2b" }}>
              {fill(labels.shareNote, {
                pct: Math.round((result.share[String(result.wards[0])] ?? 0) * 100),
                fsa: result.fsa,
                ward: result.wards[0],
              })}{" "}
              {labels.fsaPick}
            </p>
            {wardButtons(result.wards)}
          </div>
        )}

        {result?.kind === "ambiguous-street" && (
          <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-rule)", padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "#6b5a2b" }}>
              {fill(labels.streetSpans, { street: prettyStreet(result.street) })}
            </p>
            {wardButtons(result.wards)}
          </div>
        )}

        {result?.kind === "suggest" && (
          <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-rule)", padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "#6b5a2b" }}>{labels.noMatch}</p>
            {result.suggestions.length > 0 && (
              <>
                <p style={{ margin: "10px 0 6px", fontSize: 12.5, fontWeight: 600, color: "#6b5a2b" }}>
                  {labels.didYouMean}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {result.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        const num = value.match(/^\d+/)?.[0];
                        setValue(num ? `${num} ${prettyStreet(s)}` : prettyStreet(s));
                        setResult(null);
                      }}
                      style={{ fontSize: 12.5, padding: "6px 10px", minHeight: 34, border: "1px solid var(--rule-2)", background: "#fff", cursor: "pointer", fontFamily: "var(--body)" }}
                    >
                      {prettyStreet(s)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {result?.kind === "unknown" && (
          <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-rule)", padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "#6b5a2b" }}>
              {parseFsa(value) ? fill(labels.fsaSpans, { fsa: parseFsa(value)!, wards: "—" }) : labels.noMatch}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
