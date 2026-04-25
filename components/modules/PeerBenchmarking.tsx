"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CountrySelector } from "@/components/CountrySelector";
import { PEER_ORGS, PEER_RADAR } from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

type PeerBenchmarkData = {
  peerOrgs: Array<{
    org: string;
    aum: string;
    countries: string;
    services: string;
    fees: string;
    overlap: string;
  }>;
  peerRadar: Array<{
    subject: string;
    caf: number;
    rpa: number;
    giveIndia: number;
    brFdn: number;
  }>;
  sources: Array<{ name: string; url: string }>;
};

export function PeerBenchmarking() {
  const activeCountry = useAppStore((s) => s.activeCountry);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toISOString());
  const [feedError, setFeedError] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<PeerBenchmarkData | null>(null);
  const [liveForCountry, setLiveForCountry] = useState<string | null>(null);
  const peerOrgs =
    liveData && liveForCountry === activeCountry ? liveData.peerOrgs : PEER_ORGS;
  const peerRadar =
    liveData && liveForCountry === activeCountry ? liveData.peerRadar : PEER_RADAR;

  const onRefresh = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "peer_benchmarking",
          country: activeCountry,
        }),
      });
      const data = (await res.json()) as { error?: string } & Partial<PeerBenchmarkData>;
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      if (!Array.isArray(data.peerOrgs) || !Array.isArray(data.peerRadar)) {
        throw new Error("Incomplete response from Claude");
      }
      setLiveData({
        peerOrgs: data.peerOrgs,
        peerRadar: data.peerRadar,
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
          <h1 className="text-3xl font-bold">Peer Benchmarking</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
            CAF America, GiveIndia, BrazilFoundation vs RPA — table + radar
            (normalized scores, seeded).
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
        <p className="metric-label">Country context</p>
        <CountrySelector value={activeCountry} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Last refreshed {new Date(lastRefresh).toLocaleString()}
          {liveData && liveForCountry === activeCountry ? (
            <span className="ml-2 font-semibold text-[var(--accent-gold)]">
              · Claude
            </span>
          ) : null}
        </p>
      </div>

      <div className="card overflow-x-auto p-5">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Org</th>
              <th className="py-2">AUM</th>
              <th className="py-2">Countries</th>
              <th className="py-2">Key services</th>
              <th className="py-2">Fees</th>
              <th className="py-2">RPA overlap</th>
            </tr>
          </thead>
          <tbody>
            {peerOrgs.map((row) => (
              <tr key={row.org} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{row.org}</td>
                <td className="py-2">{row.aum}</td>
                <td className="py-2">{row.countries}</td>
                <td className="py-2">{row.services}</td>
                <td className="py-2">{row.fees}</td>
                <td className="py-2">{row.overlap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Strength / weakness radar</h2>
        <div className="mt-4 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={peerRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="CAF America"
                dataKey="caf"
                stroke="#1e2d2f"
                fill="#1e2d2f"
                fillOpacity={0.12}
              />
              <Radar
                name="RPA"
                dataKey="rpa"
                stroke="#c9922a"
                fill="#c9922a"
                fillOpacity={0.2}
              />
              <Radar
                name="GiveIndia"
                dataKey="giveIndia"
                stroke="#4588c8"
                fill="#4588c8"
                fillOpacity={0.12}
              />
              <Radar
                name="BrazilFoundation"
                dataKey="brFdn"
                stroke="#4caf7d"
                fill="#4caf7d"
                fillOpacity={0.12}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
