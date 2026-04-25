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

function severityBadge(level: string) {
  if (level === "High") return "text-red-400 font-semibold";
  if (level === "Medium") return "text-amber-400 font-semibold";
  return "text-emerald-400 font-semibold";
}

export function FundingGapDashboard() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funding Gap Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          International ODA contraction versus domestic philanthropy growth,
          indexed to 2021 = 100. A score of 100 represents each funding source's
          baseline volume in 2021; values above 100 indicate growth, below 100
          indicate contraction relative to that baseline.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="funding_gap_dashboard" country={activeCountry} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Indexed trends (2021 = 100)</h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            X axis: Year. Y axis: Index value (2021 = 100 baseline). Red line = international ODA to civil society; green line = domestic philanthropic giving.
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Sources: OECD Development Finance Statistics (international); CAF World Giving Index (domestic philanthropy).
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FUNDING_GAP_LINES} margin={{ bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -12 }} />
                <YAxis
                  domain={[60, 110]}
                  label={{ value: "Index (2021 = 100)", angle: -90, position: "insideLeft", offset: 10 }}
                />
                <Tooltip formatter={(v) => [`${v}`, "Index"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="international"
                  name="International ODA"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="domestic"
                  name="Domestic philanthropy"
                  stroke="#4caf7d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-xs">
            <a href="https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/" target="_blank" rel="noreferrer" className="text-blue-400 underline">
              Source: OECD Development Finance Statistics ↗
            </a>
            <a href="https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" target="_blank" rel="noreferrer" className="text-blue-400 underline">
              Source: CAF World Giving Index ↗
            </a>
          </div>
        </div>

        <div className="card flex flex-col justify-center p-5">
          <p className="metric-label">Estimated net gap</p>
          <p className="mt-2 text-4xl font-bold text-red-400">~$18B</p>
          <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
            Global South civil society funding shortfall after domestic philanthropy offsets are applied. Derived from OECD ODA disbursement trends cross-referenced with CAF giving data.
          </p>
          <a
            href="https://www.oecd.org/development/private-philanthropy-for-development.htm"
            target="_blank"
            rel="noreferrer"
            className="mt-3 text-xs text-blue-400 underline"
          >
            Source: OECD Private Philanthropy for Development ↗
          </a>
        </div>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Sector gap breakdown</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
          Each row shows the estimated percentage decline in international funding for that sector (<span className="font-semibold">Intl decline</span>), the partial offset from growing domestic sources (<span className="font-semibold">Domestic offset</span>), and the resulting <span className="font-semibold">net gap</span> as a share of prior funding. Severity is rated High when the net gap exceeds 4% of sector volume.
        </p>
        <table className="mt-4 w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2 pr-3">Sector</th>
              <th className="py-2 pr-3">Intl decline (%)</th>
              <th className="py-2 pr-3">Domestic offset (%)</th>
              <th className="py-2 pr-3">Net gap (%)</th>
              <th className="py-2 pr-3">Severity</th>
              <th className="py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {FUNDING_SECTOR_GAP.map((row) => (
              <tr key={row.sector} className="border-b border-[var(--border)]">
                <td className="py-2 pr-3 font-medium">{row.sector}</td>
                <td className="py-2 pr-3 text-red-400">{row.intl}%</td>
                <td className="py-2 pr-3 text-emerald-400">+{row.domestic}%</td>
                <td className="py-2 pr-3 text-red-400">{row.net}%</td>
                <td className={`py-2 pr-3 ${severityBadge(row.severity)}`}>{row.severity}</td>
                <td className="py-2">
                  <a
                    href="https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 underline"
                  >
                    OECD DAC ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
