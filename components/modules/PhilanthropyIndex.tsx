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

const TOP_CORP_BY_COUNTRY: Record<string, Array<{ name: string; giving: string; url: string }>> = {
  Brazil: [
    { name: "Itaú Unibanco", giving: "$42M", url: "https://www.itau.com.br/relacoes-com-investidores/" },
    { name: "Vale Foundation", giving: "$28M", url: "https://www.vale.com/sustainability" },
    { name: "Petrobras Social Program", giving: "$22M", url: "https://petrobras.com.br/en/society-and-environment/" },
  ],
  Nigeria: [
    { name: "Dangote Foundation", giving: "$18M", url: "https://dangotegroup.com/sustainability/" },
    { name: "Tony Elumelu Foundation", giving: "$15M", url: "https://www.tonyelumelufoundation.org/" },
    { name: "Access Bank CSR", giving: "$9M", url: "https://www.accessbankplc.com/sustainability" },
  ],
  Kenya: [
    { name: "Safaricom Foundation", giving: "$12M", url: "https://www.safaricom.co.ke/sustainability" },
    { name: "Equity Group Foundation", giving: "$10M", url: "https://equitygroupfoundation.com/" },
    { name: "KCB Foundation", giving: "$7M", url: "https://kcbgroup.com/foundation/" },
  ],
  Colombia: [
    { name: "Grupo Bancolombia", giving: "$14M", url: "https://www.grupobancolombia.com/sostenibilidad" },
    { name: "Fundación Bavaria", giving: "$11M", url: "https://www.fundacionbavaria.org/" },
    { name: "Ecopetrol Social", giving: "$8M", url: "https://www.ecopetrol.com.co/wps/portal/Home/sostenibilidad" },
  ],
};

const DEFAULT_CORP = [
  { name: "Corporate donor 1", giving: "$15M", url: "" },
  { name: "Corporate donor 2", giving: "$10M", url: "" },
  { name: "Corporate donor 3", giving: "$7M", url: "" },
];

type PhilanthropyLiveData = {
  metrics: { corporate: string; individual: string; endowment: string };
  trend: Array<{ y: string; v: number }>;
  topCorporateDonors: Array<{ name: string; giving: string; url?: string }>;
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
  const metrics = liveData && liveForCountry === activeCountry ? liveData.metrics : m;
  const trend = liveData && liveForCountry === activeCountry ? liveData.trend : PHILANTHROPY_TREND;
  const topCorp =
    liveData && liveForCountry === activeCountry
      ? liveData.topCorporateDonors
      : (TOP_CORP_BY_COUNTRY[activeCountry] ?? DEFAULT_CORP);

  const onRefresh = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "philanthropy_index", country: activeCountry }),
      });
      const data = (await res.json()) as { error?: string } & Partial<PhilanthropyLiveData>;
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
      if (!data.metrics || !Array.isArray(data.trend) || !Array.isArray(data.topCorporateDonors)) {
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
      <div>
        <h1 className="text-3xl font-bold">Philanthropy Index (Domestic)</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Domestic philanthropic capacity in {activeCountry}: corporate foundations,
          individual and religious giving, and institutional endowment pools.
          Data sourced from national philanthropy reports and CAF World Giving Index.
        </p>
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-900">Report-Ready Analysis</p>
            <h2 className="text-lg font-bold text-gray-900">Latest pull highlights</h2>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {liveData && liveForCountry === activeCountry
                ? `Last refresh ${new Date(lastRefresh).toLocaleString()} · Claude`
                : "Click Refresh to pull live philanthropy data from Claude."}
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
        {liveData && liveForCountry === activeCountry && liveData.sources.length > 0 && (
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            <span className="font-semibold">Sources: </span>
            {liveData.sources.map((s, i) => (
              <span key={`${s.name}-${i}`}>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.name}</a>
                {i < liveData.sources.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="metric-label">Corporate giving AUM</p>
          <p className="mt-2 text-2xl font-bold">{metrics.corporate}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Total estimated annual giving from corporate foundations and CSR programmes in {activeCountry}.
          </p>
          <a href="https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: CAF World Giving Index ↗
          </a>
        </div>
        <div className="card p-5">
          <p className="metric-label">Individual / religious giving</p>
          <p className="mt-2 text-2xl font-bold">{metrics.individual}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Estimated annual charitable contributions from individual donors and faith-based institutions.
          </p>
          <a href="https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: CAF World Giving Index ↗
          </a>
        </div>
        <div className="card p-5">
          <p className="metric-label">Endowment pool</p>
          <p className="mt-2 text-2xl font-bold">{metrics.endowment}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Aggregate investable assets held by domestic foundations and community foundations.
          </p>
          <a href="https://candid.org/explore-issues/nonprofit-finance" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: Candid Nonprofit Finance ↗
          </a>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Domestic giving growth (indexed)</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          X axis: Year. Y axis: Index value (2021 = 100 baseline). Values above 100 indicate growth in domestic philanthropic giving relative to the 2021 baseline.
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="y" label={{ value: "Year", position: "insideBottom", offset: -12 }} />
              <YAxis
                domain={[90, 130]}
                label={{ value: "Index (2021 = 100)", angle: -90, position: "insideLeft", offset: 10 }}
              />
              <Tooltip formatter={(v) => [`${v}`, "Index"]} />
              <Line type="monotone" dataKey="v" name="Domestic giving index" stroke="var(--accent-gold)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <a href="https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-blue-400 underline">
          Source: CAF World Giving Index ↗
        </a>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Top corporate donors — {activeCountry}</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Largest corporate philanthropic programmes by estimated annual giving. Click name to view source.
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2 pr-4">Corporate</th>
              <th className="py-2">Est. annual giving</th>
            </tr>
          </thead>
          <tbody>
            {topCorp.map((row) => (
              <tr key={row.name} className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  {row.url ? (
                    <a href={row.url} target="_blank" rel="noreferrer" className="underline hover:text-[var(--accent-gold)]">
                      {row.name} ↗
                    </a>
                  ) : (
                    row.name
                  )}
                </td>
                <td className="py-2">{row.giving}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
