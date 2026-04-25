"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ModelDecisionColumns } from "@/components/ModelDecisionColumns";
import { getCountryAnalysis } from "@/lib/mockData";
import { getRegulatoryProfile } from "@/lib/regulatoryData";
import { recommendModel } from "@/lib/scoring";
import { useAppStore } from "@/store";
import type {
  RegulatoryCountryProfile,
  RegulatoryRiskItem,
  RiskLevel,
} from "@/lib/types";

function riskPillClasses(level: RiskLevel) {
  switch (level) {
    case "Low":
      return "border-[var(--success)] bg-emerald-50 text-emerald-900";
    case "Medium":
      return "border-[var(--warning)] bg-amber-50 text-amber-900";
    case "High":
      return "border-orange-400 bg-orange-50 text-orange-900";
    case "Critical":
      return "border-[var(--danger)] bg-red-50 text-red-900";
  }
}

function severityClasses(severity: RegulatoryRiskItem["severity"]) {
  switch (severity) {
    case "Low":
      return "bg-emerald-100 text-emerald-900";
    case "Medium":
      return "bg-amber-100 text-amber-900";
    case "High":
      return "bg-orange-100 text-orange-900";
    case "Critical":
      return "bg-red-100 text-red-900";
  }
}

function Section({
  title,
  items,
}: {
  title: string;
  items: RegulatoryRiskItem[];
}) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <article
            key={`${item.title}-${item.date}`}
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-sm font-semibold">{item.title}</h4>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${severityClasses(
                  item.severity,
                )}`}
              >
                {item.severity}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {item.summary}
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--text-muted)]">{item.date}</p>
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 underline hover:text-blue-300"
                >
                  {item.sourceLabel ?? "Source"} ↗
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function RegulatoryRiskMonitor() {
  const activeCountry = useAppStore((state) => state.activeCountry);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() =>
    new Date().toISOString(),
  );
  const [liveProfile, setLiveProfile] = useState<RegulatoryCountryProfile | null>(
    null,
  );
  const [liveForCountry, setLiveForCountry] = useState<string | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [liveSources, setLiveSources] = useState<Array<{ name: string; url: string }>>(
    [],
  );

  const analysis = useMemo(
    () => getCountryAnalysis(activeCountry),
    [activeCountry],
  );

  const seededProfile = useMemo(
    () => getRegulatoryProfile(activeCountry),
    [activeCountry],
  );
  const profile =
    liveProfile && liveForCountry === activeCountry ? liveProfile : seededProfile;

  const scorecardModel = analysis
    ? recommendModel(analysis.composite)
    : "Hybrid";

  const onRefresh = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regulatory_risk",
          country: activeCountry,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        profile?: RegulatoryCountryProfile;
        sources?: Array<{ name: string; url: string }>;
      };
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      if (!data.profile) {
        throw new Error("No profile returned");
      }
      setLiveProfile(data.profile);
      setLiveSources(data.sources ?? []);
      setLiveForCountry(activeCountry);
      setLastRefresh(new Date().toISOString());
    } catch (e) {
      setFeedError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile || !analysis) {
    return (
      <div className="card p-6">
        <p className="font-semibold">Regulatory data unavailable.</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Select a country from the benchmark list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Risk Monitor</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
            Country-level threats, government posture, and recent changes. The
            primary decision surface is the three-column expansion model
            comparison below — use it to choose New Build, Hybrid, or Local
            Partner under current regulatory reality.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh (Claude)"}
        </button>
      </div>

      {feedError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {feedError}
        </div>
      ) : null}

      {liveProfile && liveForCountry === activeCountry && liveSources.length > 0 ? (
        <div className="card p-4 text-sm">
          <span className="font-semibold">Sources: </span>
          {liveSources.map((s, i) => (
            <span key={`${s.name}-${i}`}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                {s.name}
              </a>
              {i < liveSources.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="card space-y-3 p-5">
          <p className="text-xs text-[var(--text-muted)]">
            Last refreshed {new Date(lastRefresh).toLocaleString()}
            {liveProfile && liveForCountry === activeCountry ? (
              <span className="ml-2 font-semibold text-[var(--accent-gold)]">
                · Claude
              </span>
            ) : null}
          </p>
        </div>
        <div className="card flex flex-col justify-center p-5">
          <p className="metric-label">Regulatory risk level</p>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${riskPillClasses(
                profile.riskLevel,
              )}`}
            >
              {profile.riskLevel}
            </span>
            <span className="text-sm text-[var(--text-muted)]">
              Derived from policy pillar ({analysis.policy.score.toFixed(1)}/5)
            </span>
          </div>
        </div>
      </div>

      {profile.prematureNote ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {profile.prematureNote}
        </div>
      ) : null}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <ModelDecisionColumns
          recommendedColumn={profile.recommendedExpansionModel}
          scorecardModel={scorecardModel}
          columns={profile.modelColumns}
        />
      )}

      <div className="card p-4 text-sm text-[var(--text-muted)] leading-relaxed border-l-4 border-[var(--accent-gold)]">
        <p className="font-semibold text-[var(--text-primary)] mb-1">How these estimates were derived</p>
        <p>
          <strong>Estimated cost ranges</strong> are based on Bridgespan Group benchmarks for fiscal sponsorship and intermediary setup costs across Global South markets, adjusted for local legal entity requirements and staffing norms.{" "}
          <strong>Timelines</strong> reflect CAF America operational precedents and regulatory processing times sourced from country-level World Bank Doing Business indicators.{" "}
          <strong>Key regulatory risks</strong> draw from CIVICUS Monitor civic space ratings and recent government policy announcements. All figures are illustrative and should be validated against current in-country legal counsel.
        </p>
      </div>

      <div className="card p-5">
        <p className="metric-label">Government posture</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
          {profile.governmentPostureSummary}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="Active threats" items={profile.activeThreats} />
        <Section title="Government posture" items={profile.governmentPosture} />
        <Section title="Recent changes (6 months)" items={profile.recentChanges} />
      </div>

      <div className="card p-5">
        <h3 className="text-lg font-bold">12-month regulatory timeline</h3>
        <ol className="mt-4 space-y-4 border-l border-[var(--border)] pl-4">
          {profile.timeline12m.map((event) => (
            <li key={`${event.date}-${event.label}`} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--accent-gold)]" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{event.date}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${severityClasses(
                    event.severity,
                  )}`}
                >
                  {event.severity}
                </span>
                {event.sourceUrl ? (
                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 underline hover:text-blue-300"
                  >
                    {event.sourceLabel ?? "Source"} ↗
                  </a>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{event.label}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
