"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { FUNDER_TREND, MAJOR_FUNDERS, PEER_RADAR } from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

const FUNDER_SOURCES: Record<string, { label: string; url: string }> = {
  "Gates Foundation": {
    label: "Gates Foundation Committed Grants",
    url: "https://www.gatesfoundation.org/about/committed-grants",
  },
  "Ford Foundation": {
    label: "Ford Foundation Grants Database",
    url: "https://www.fordfoundation.org/work/our-grants/grants-database/",
  },
  MacArthur: {
    label: "MacArthur Foundation Grants",
    url: "https://www.macfound.org/grants",
  },
  "Bezos Earth Fund": {
    label: "Bezos Earth Fund Grantees",
    url: "https://www.bezosearthfund.org/grantees",
  },
  Wellcome: {
    label: "Wellcome Grants on the Web",
    url: "https://wellcome.org/grant-funding",
  },
};

function backfillClass(stance: string) {
  if (stance === "Actively Filling") return "bg-emerald-100 text-emerald-900";
  if (stance === "Reducing") return "bg-red-100 text-red-900";
  return "bg-slate-100 text-slate-700";
}

export function MajorFunderTracker() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Major Funder Tracker</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Allocation trends and USAID backfill stance for the five largest private
          funders active in the Global South. Dollar figures represent estimated
          annual disbursements to civil society in each geography.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="major_funder_tracker" country={activeCountry} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MAJOR_FUNDERS.map((f) => {
          const src = FUNDER_SOURCES[f.name];
          return (
            <div key={f.name} className="card p-5">
              <h2 className="text-lg font-bold">{f.name}</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Global South (annual)</dt>
                  <dd className="font-semibold">{f.globalSouth}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">{activeCountry === "Brazil" ? "Brazil" : `Brazil`}</dt>
                  <dd>{f.brazil}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Nigeria</dt>
                  <dd>{f.nigeria}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">USAID backfill stance</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${backfillClass(f.backfill)}`}>
                      {f.backfill}
                    </span>
                  </dd>
                </div>
              </dl>
              {src && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-xs text-blue-400 underline"
                >
                  Source: {src.label} ↗
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Allocation trend (indexed, 2021 = 100)</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          X axis: Year. Y axis: Allocation index relative to 2021 baseline (100 = 2021 level). Values above 100 indicate increased giving; below 100 indicates contraction. Based on publicly disclosed grant commitments.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={FUNDER_TREND} margin={{ bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="y" label={{ value: "Year", position: "insideBottom", offset: -12 }} />
              <YAxis
                domain={[90, 115]}
                label={{ value: "Allocation Index (2021=100)", angle: -90, position: "insideLeft", offset: 10 }}
              />
              <Tooltip formatter={(v) => [`${v}`, "Index"]} />
              <Legend />
              <Line type="monotone" dataKey="Gates" name="Gates Foundation" stroke="#4588c8" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Ford" name="Ford Foundation" stroke="#c9922a" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Mac" name="MacArthur" stroke="#4caf7d" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs">
          <a href="https://www.gatesfoundation.org/about/committed-grants" target="_blank" rel="noreferrer" className="text-blue-400 underline">Source: Gates Foundation ↗</a>
          <a href="https://www.fordfoundation.org/work/our-grants/grants-database/" target="_blank" rel="noreferrer" className="text-blue-400 underline">Source: Ford Foundation ↗</a>
          <a href="https://www.macfound.org/grants" target="_blank" rel="noreferrer" className="text-blue-400 underline">Source: MacArthur Foundation ↗</a>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Capability Radar — RPA vs. Peers</h2>
        <p className="mt-1 mb-4 text-sm text-[var(--text-muted)]">
          Comparative strengths across six capacity dimensions scored 0–100. RPA (gold) vs. CAF America, GiveIndia, and BrazilFoundation. Gaps relative to leaders indicate areas where additional funder investment would have the highest leverage for RPA's Global South expansion.
        </p>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={PEER_RADAR}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="CAF America" dataKey="caf" stroke="#1e2d2f" fill="#1e2d2f" fillOpacity={0.12} />
              <Radar name="RPA" dataKey="rpa" stroke="#c9922a" fill="#c9922a" fillOpacity={0.2} />
              <Radar name="GiveIndia" dataKey="giveIndia" stroke="#4588c8" fill="#4588c8" fillOpacity={0.12} />
              <Radar name="BrazilFoundation" dataKey="brFdn" stroke="#4caf7d" fill="#4caf7d" fillOpacity={0.12} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
