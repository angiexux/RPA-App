"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { ScoreGauge } from "@/components/ScoreGauge";
import { getCountryMapEmbed } from "@/lib/countryGeo";
import { getCountryAnalysis } from "@/lib/mockData";
import { modelColor } from "@/lib/scoring";
import { useAppStore } from "@/store";

const pillarMeta = [
  { key: "policy",         label: "Policy",         weight: "25%", route: "/regulatory-risk" },
  { key: "capital",        label: "Capital",         weight: "30%", route: "/capital-flow" },
  { key: "infrastructure", label: "Infrastructure",  weight: "25%", route: "/daf-monitor" },
  { key: "talent",         label: "Talent",          weight: "20%", route: "/major-funder-tracker" },
] as const;

export function FeasibilityScorecard() {
  const router = useRouter();
  const activeCountry = useAppStore((state) => state.activeCountry);
  const countryCache = useAppStore((state) => state.countryCache);
  const setActiveCountry = useAppStore((state) => state.setActiveCountry);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveHighlights, setLiveHighlights] = useState<string[]>([]);
  const [liveSources, setLiveSources] = useState<Array<{ name: string; url: string }>>([]);

  const analysis = useMemo(() => {
    return countryCache[activeCountry] ?? getCountryAnalysis(activeCountry);
  }, [activeCountry, countryCache]);

  if (!analysis) {
    return <div className="card p-6">Country analysis unavailable.</div>;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    setLiveError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "module_insight",
          module: "feasibility_scorecard",
          country: activeCountry,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        highlights?: string[];
        sources?: Array<{ name: string; url: string }>;
      };
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setLiveHighlights(Array.isArray(data.highlights) ? data.highlights : []);
      setLiveSources(Array.isArray(data.sources) ? data.sources : []);
      setLastFetched(new Date());
      setActiveCountry(activeCountry);
    } catch (e) {
      setLiveError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const handlePillarClick = (route: string) => {
    setActiveCountry(activeCountry);
    router.push(route);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Feasibility Scorecard</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Deep single-country review across the four-pillar scoring model.
            Click any pillar to navigate to its deep-dive page.
          </p>
        </div>

        <div className="card space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-6">
            <ScoreGauge value={analysis.composite} />
            <div className="space-y-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${modelColor(analysis.model)}`}
              >
                {analysis.model}
              </span>
              <p className="text-sm text-[var(--text-muted)]" suppressHydrationWarning>
                Last fetched {lastFetched ? lastFetched.toLocaleString() : new Date(analysis.fetchedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pillarMeta.map((pillar) => {
            const score = analysis[pillar.key];
            return (
              <button
                key={pillar.key}
                onClick={() => handlePillarClick(pillar.route)}
                className="card p-5 text-left hover:border-[var(--accent-gold)] hover:shadow-md transition-all group"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="metric-label">{pillar.weight} weight</p>
                    <h2 className="text-xl font-bold group-hover:text-[var(--accent-gold)] transition-colors">
                      {pillar.label} ↗
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="metric-label">Score</p>
                    <p className="text-2xl font-bold">{score.score.toFixed(1)}/5</p>
                  </div>
                </div>
                <div className="mb-3 h-2 rounded-full bg-slate-200">
                  <div
                    className="gold-gradient h-2 rounded-full"
                    style={{ width: `${(score.score / 5) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--text-muted)]">{score.justification}</p>
                <p className="mt-2 text-xs text-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                  View {pillar.label} deep-dive →
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="card p-5">
          <p className="metric-label">Market map</p>
          <h2 className="mb-4 text-xl font-bold">Selected country context</h2>
          <div className="h-64 overflow-hidden rounded-2xl border border-[var(--border)]">
            <iframe
              title={`${analysis.country} map`}
              src={getCountryMapEmbed(analysis.country)}
              className="h-full w-full"
            />
          </div>
          <div className="mt-4 grid gap-3">
            {analysis.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              >
                <p className="metric-label">{item.label}</p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Claude Live Context — Refresh button unified into header */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="metric-label">Claude live context</p>
              <h2 className="text-xl font-bold">Latest pull highlights</h2>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {liveError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              {liveError}
            </div>
          ) : null}
          {liveHighlights.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
              {liveHighlights.map((item, idx) => (
                <li key={`${item}-${idx}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Click Refresh to pull live context from Claude.
            </p>
          )}
          {liveSources.length > 0 && (
            <div className="mt-3 border-t border-[var(--border)] pt-3">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Sources</p>
              <ul className="space-y-1">
                {liveSources.map((s, i) => (
                  <li key={`${s.name}-${i}`} className="text-xs">
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline text-blue-400 hover:text-blue-300">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
