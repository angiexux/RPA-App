"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CAPITAL_FUNDERS,
  CAPITAL_SECTORS,
  CAPITAL_STACKED,
} from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

const COLORS: Record<string, string> = {
  Health:    "#1e2d2f",
  Climate:   "#c9922a",
  Education: "#4588c8",
  Rights:    "#4caf7d",
  Other:     "#d9580a",
};
const DEFAULT_COLOR = "#94a3b8";
type CapitalFlowData = {
  stacked: Array<{
    year: string;
    bilateral: number;
    foundation: number;
    corporate: number;
    domestic: number;
  }>;
  funders: Array<{
    name: string;
    total: string;
    sector: string;
    trend: string;
  }>;
  sectors: Array<{ name: string; value: number }>;
  sources: Array<{ name: string; url: string }>;
};

export function CapitalFlowTracker() {
  const activeCountry = useAppStore((s) => s.activeCountry);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toISOString());
  const [feedError, setFeedError] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<CapitalFlowData | null>(null);
  const [liveForCountry, setLiveForCountry] = useState<string | null>(null);
  const stacked =
    liveData && liveForCountry === activeCountry ? liveData.stacked : CAPITAL_STACKED;
  const funders =
    liveData && liveForCountry === activeCountry ? liveData.funders : CAPITAL_FUNDERS;
  const sectors =
    liveData && liveForCountry === activeCountry ? liveData.sectors : CAPITAL_SECTORS;

  const onRefresh = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "capital_flow",
          country: activeCountry,
        }),
      });
      const data = (await res.json()) as { error?: string } & Partial<CapitalFlowData>;
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      if (
        !Array.isArray(data.stacked) ||
        !Array.isArray(data.funders) ||
        !Array.isArray(data.sectors)
      ) {
        throw new Error("Incomplete response from Claude");
      }
      setLiveData({
        stacked: data.stacked,
        funders: data.funders,
        sectors: data.sectors,
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
      <div>
        <h1 className="text-3xl font-bold">Capital Flow Tracker</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Inflows by funder type (illustrative 5-year stack). Brazil reference:
          Ford Foundation ~$69.6M (2020–2024) shown in top funders table.
        </p>
      </div>

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

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-900">Report-Ready Analysis</p>
            <h2 className="text-lg font-bold text-gray-900">Latest pull highlights</h2>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {liveData && liveForCountry === activeCountry
                ? `Last refresh ${new Date(lastRefresh).toLocaleString()} · Claude`
                : "Click Refresh to pull live capital flow data from Claude."}
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
        {feedError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
            {feedError}
          </div>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Capital inflows by year & funder type</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Y axis: USD millions (illustrative). X axis: Year.</p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stacked} margin={{ bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -12 }} />
              <YAxis label={{ value: "USD millions", angle: -90, position: "insideLeft", offset: 10 }} />
              <Tooltip formatter={(v) => [`$${v}M`, ""]} />
              <Legend />
              <Bar dataKey="bilateral"  stackId="a" fill="#1e2d2f" name="Bilateral" />
              <Bar dataKey="foundation" stackId="a" fill="#c9922a" name="Foundation" />
              <Bar dataKey="corporate"  stackId="a" fill="#4588c8" name="Corporate" />
              <Bar dataKey="domestic"   stackId="a" fill="#4caf7d" name="Domestic phil." />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs">
          <a href="https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/" target="_blank" rel="noreferrer" className="text-blue-400 underline">Source: OECD Development Finance Statistics ↗</a>
          <a href="https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" target="_blank" rel="noreferrer" className="text-blue-400 underline">Source: CAF World Giving Index ↗</a>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card overflow-x-auto p-5">
          <h2 className="text-lg font-bold">Top funders</h2>
          <table className="mt-4 w-full min-w-[400px] text-sm">
            <thead>
              <tr className="border-b text-left text-[var(--text-muted)]">
                <th className="py-2">Name</th>
                <th className="py-2">Total</th>
                <th className="py-2">Sector focus</th>
                <th className="py-2">Trend</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {funders.map((row) => (
                <tr key={row.name} className="border-b border-[var(--border)]">
                  <td className="py-2 font-medium">{row.name}</td>
                  <td className="py-2">{row.total}</td>
                  <td className="py-2">{row.sector}</td>
                  <td className="py-2">{row.trend}</td>
                  <td className="py-2">
                    {row.sourceUrl ? (
                      <a href={row.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline text-xs">
                        Grants DB ↗
                      </a>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-bold">Sector breakdown</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectors}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {sectors.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.name] ?? DEFAULT_COLOR} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
