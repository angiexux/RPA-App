"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { FUNDING_GAP_LINES, FUNDING_SECTOR_GAP } from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

export function FundingGapDashboard() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funding Gap Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          International contraction vs domestic philanthropy growth — indexed
          series (seeded). Country filter applies to narrative context only in
          this MVP.
        </p>
      </div>


      <ModuleClaudeRefresh moduleKey="funding_gap_dashboard" country={activeCountry} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Indexed trends (2021 = 100)</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FUNDING_GAP_LINES}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="international"
                  name="International"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="domestic"
                  name="Domestic philanthropy"
                  stroke="#4caf7d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card flex flex-col justify-center p-5">
          <p className="metric-label">Gap meter (illustrative)</p>
          <p className="mt-2 text-4xl font-bold text-red-600">~$18B</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Net estimated global South gap after domestic offset — seeded
            headline for dashboard framing.
          </p>
        </div>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Sector gap table</h2>
        <table className="mt-4 w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Sector</th>
              <th className="py-2">Intl decline %</th>
              <th className="py-2">Domestic offset %</th>
              <th className="py-2">Net gap %</th>
              <th className="py-2">Severity</th>
            </tr>
          </thead>
          <tbody>
            {FUNDING_SECTOR_GAP.map((row) => (
              <tr key={row.sector} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{row.sector}</td>
                <td className="py-2">{row.intl}</td>
                <td className="py-2">+{row.domestic}</td>
                <td className="py-2">{row.net}</td>
                <td className="py-2">{row.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
