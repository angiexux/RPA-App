"use client";

import { useMemo, useState, useCallback } from "react";
import { RotateCw } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import { modelColor } from "@/lib/scoring";
import { useAppStore } from "@/store";

export function SummaryBar() {
  const [refreshing, setRefreshing] = useState(false);
  const activeCountry = useAppStore((state) => state.activeCountry);
  const countryCache = useAppStore((state) => state.countryCache);
  const lastFetchedAt = useAppStore((state) => state.lastFetchedAt);
  const hydrateBatch = useAppStore((state) => state.hydrateBatch);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Refresh the data by rehydrating the cache
    await new Promise((resolve) => setTimeout(resolve, 900));
    hydrateBatch([activeCountry]);
    setRefreshing(false);
  }, [activeCountry, hydrateBatch]);

  const activeAnalysis = countryCache[activeCountry];

  const metrics = useMemo(() => {
    if (!activeAnalysis) {
      return [];
    }

    return [
      { label: "Policy", value: activeAnalysis.policy.score.toFixed(1) },
      { label: "Capital", value: activeAnalysis.capital.score.toFixed(1) },
      { label: "Updated", value: new Date(lastFetchedAt).toLocaleString() },
    ];
  }, [activeAnalysis, lastFetchedAt]);

  return (
    <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 px-6 py-4 backdrop-blur">
      <div className="card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-[200px] max-w-[280px]">
          <p className="metric-label">Selected Individual Country</p>
          <CountrySelector value={activeCountry} />
        </div>

        <div>
          <p className="metric-label">Composite score</p>
          <p className="text-3xl font-bold">
            {activeAnalysis ? activeAnalysis.composite.toFixed(2) : "--"}
          </p>
        </div>

        <div>
          <p className="metric-label">Recommended model</p>
          <span
            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${activeAnalysis ? modelColor(activeAnalysis.model) : "bg-slate-300 text-slate-700"}`}
          >
            {activeAnalysis?.model ?? "Pending"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-2"
            >
              <p className="metric-label">{metric.label}</p>
              <p className="text-sm font-semibold" suppressHydrationWarning>{metric.value}</p>
            </div>
          ))}
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-2 flex items-center justify-center p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
            title="Refresh data"
          >
            <RotateCw
              className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
