import type { Source } from "@/content/types";

/** Every figure carries its source. If it has no URL it is not yet traced, and
 *  the reader is told so rather than being left to assume. */
export default function SourceLine({ source, label }: { source: Source; label: string }) {
  return (
    <span style={{ fontSize: 11, color: "var(--muted)", display: "block" }}>
      {label}:{" "}
      {source.url ? (
        <a href={source.url} rel="noopener noreferrer" target="_blank">
          {source.name}
        </a>
      ) : (
        <span style={{ color: "var(--ochre)" }}>{source.name}</span>
      )}
      {source.retrieved ? ` · ${source.retrieved}` : ""}
    </span>
  );
}
