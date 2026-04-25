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

function backfillClass(
  stance: string,
): "bg-emerald-100 text-emerald-900" | "bg-slate-100 text-slate-700" | "bg-red-100 text-red-900" {
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
          Gates, Ford, MacArthur, Bezos Earth Fund, Wellcome — illustrative
          allocations and USAID backfill stance.
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="major_funder_tracker" country={activeCountry} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MAJOR_FUNDERS.map((f) => (
          <div key={f.name} className="card p-5">
            <h2 className="text-lg font-bold">{f.name}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-muted)]">Global South</dt>
                <dd className="font-semibold">{f.globalSouth}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-muted)]">Brazil</dt>
                <dd>{f.brazil}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--text-muted)]">Nigeria</dt>
                <dd>{f.nigeria}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">USAID backfill</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${backfillClass(
                      f.backfill,
                    )}`}
                  >
                    {f.backfill}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Allocation trend (indexed)</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Year (X) · Indexed allocation relative to 2021 baseline (Y)
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={FUNDER_TREND}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="y" label={{ value: "Year", position: "insideBottom", offset: -2 }} />
              <YAxis label={{ value: "Allocation Index", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Gates" stroke="#4588c8" dot={false} />
              <Line type="monotone" dataKey="Ford" stroke="#c9922a" dot={false} />
              <Line type="monotone" dataKey="Mac" stroke="#1e2d2f" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Areas Needing Major Funding — Capability Radar</h2>
        <p className="mt-1 mb-4 text-sm text-[var(--text-muted)]">
          Comparative strengths across key capacity dimensions for RPA vs. peer organizations. Gaps
          relative to leaders indicate areas where additional funder focus would have the most impact.
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
