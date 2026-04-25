"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

type SourceItem = { name: string; url: string };

export function ModuleClaudeRefresh({
  moduleKey,
  country,
}: {
  moduleKey: string;
  country?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [sources, setSources] = useState<SourceItem[]>([]);

  const onRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "module_insight",
          module: moduleKey,
          country,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        highlights?: string[];
        sources?: SourceItem[];
      };
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
      setSources(Array.isArray(data.sources) ? data.sources : []);
      setFetchedAt(new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Live Claude pull</p>
          <p className="text-xs text-[var(--text-muted)]">
            {fetchedAt
              ? `Last refresh ${new Date(fetchedAt).toLocaleString()}`
              : "No live pull yet"}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh (Claude)"}
        </button>
      </div>
      {error ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
          {error}
        </div>
      ) : null}
      {highlights.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-[var(--text-muted)]">
          {highlights.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
      {sources.length > 0 ? (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          <span className="font-semibold">Sources: </span>
          {sources.map((s, i) => (
            <span key={`${s.name}-${i}`}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                {s.name}
              </a>
              {i < sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
