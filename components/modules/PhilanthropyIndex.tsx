"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getPhilanthropyMetrics,
  PHILANTHROPY_TREND,
} from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

const TOP_CORP = [
  { name: "Itaú", giving: "$42M" },
  { name: "Vale", giving: "$28M" },
  { name: "Petrobras", giving: "$22M" },
];
type PhilanthropyLiveData = {
  metrics: { corporate: string; individual: string; endowment: string };
  trend: Array<{ y: string; v: number }>;
  topCorporateDonors: Array<{ name: string; giving: string }>;
  sources: Array<{ name: string; url: string }>;
};

export function PhilanthropyIndex() {
  const activeCountry = useAppStore((s) => s.activeCountry);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toISOString());
  const [feedError, setFeedError] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<PhilanthropyLiveData | null>(null);
  const [liveForCountry, setLiveForCountry] = useState<string | null>(null);
  const m = useMemo(() => getPhilanthropyMetrics(activeCountry), [activeCountry]);
  const metrics =
    liveData && liveForCountry === activeCountry ? liveData.metrics : m;
  const trend =
    liveData && liveForCountry === activeCountry
      ? liveData.trend
      : PHILANTHROPY_TREND;
  const topCorp =
    liveData && liveForCountry === activeCountry
      ? liveData.topCorporateDonors
      : TOP_CORP;

  const onRefresh = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "philanthropy_index",
          country: activeCountry,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
      } & Partial<PhilanthropyLiveData>;
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      if (
        !data.metrics ||
        !Array.isArray(data.trend) ||
        !Array.isArray(data.topCorporateDonors)
      ) {
        throw new Error("Incomplete response from Claude");
      }
      setLiveData({
        metrics: data.metrics,
        trend: data.trend,
        topCorporateDonors: data.topCorporateDonors,
        sources: Array.isArray(data.sources) ? data.sources : [],
      });
      setLiveForCountry(activeCountry);
      setLastRefresh(new Date().toISOString());
    } catch (e) {
      setFeedError(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
        <h1 className="text-3xl font-bold">Philanthropy Index (Domestic)</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Corporate AUM, individual/religious giving, endowment pool — seeded
          by country where available.
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

      {liveData && liveForCountry === activeCountry && liveData.sources.length > 0 ? (
        <div className="card p-4 text-sm">
          <span className="font-semibold">Sources: </span>
          {liveData.sources.map((s, i) => (
            <span key={`${s.name}-${i}`}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                {s.name}
              </a>
              {i < liveData.sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      ) : null}

      <div className="card max-w-md p-5">
        <p className="text-xs text-[var(--text-muted)]">
          Last refreshed {new Date(lastRefresh).toLocaleString()}
          {liveData && liveForCountry === activeCountry ? (
            <span className="ml-2 font-semibold text-[var(--accent-gold)]">
              · Claude
            </span>
          ) : null}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="metric-label">Corporate giving AUM</p>
          <p className="mt-2 text-2xl font-bold">{metrics.corporate}</p>
        </div>
        <div className="card p-5">
          <p className="metric-label">Individual / religious</p>
          <p className="mt-2 text-2xl font-bold">{metrics.individual}</p>
        </div>
        <div className="card p-5">
          <p className="metric-label">Endowment pool</p>
          <p className="mt-2 text-2xl font-bold">{metrics.endowment}</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Domestic giving growth (indexed)</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="y" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="v"
                name="Index"
                stroke="var(--accent-gold)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Top corporate donors (illustrative)</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Corporate</th>
              <th className="py-2">Est. annual giving</th>
            </tr>
          </thead>
          <tbody>
            {topCorp.map((row) => (
              <tr key={row.name} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{row.name}</td>
                <td className="py-2">{row.giving}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
