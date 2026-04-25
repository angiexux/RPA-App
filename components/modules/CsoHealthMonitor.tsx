"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import {
  CSO_SCATTER,
  CSO_USAID_BAR,
  getCsoMetrics,
} from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

function survivalClass(
  level: "Low" | "Medium" | "High" | "Critical",
): string {
  switch (level) {
    case "Low":
      return "border-emerald-500 bg-emerald-50 text-emerald-900";
    case "Medium":
      return "border-amber-500 bg-amber-50 text-amber-900";
    case "High":
      return "border-orange-500 bg-orange-50 text-orange-900";
    case "Critical":
      return "border-red-500 bg-red-50 text-red-900";
  }
}

export function CsoHealthMonitor() {
  const activeCountry = useAppStore((s) => s.activeCountry);
  const metrics = useMemo(() => getCsoMetrics(activeCountry), [activeCountry]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CSO Health Monitor</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Civil society financial health: reserves, funder concentration, USAID
          dependency, and survival risk (seeded MVP).
        </p>
      </div>


      <ModuleClaudeRefresh moduleKey="cso_health_monitor" country={activeCountry} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-5">
          <p className="metric-label">Avg reserve ratio</p>
          <p className="mt-2 text-2xl font-bold">{metrics.reserveRatio}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Months of operating expenses held in unrestricted reserves. Calculated as unrestricted net assets ÷ average monthly expenditure. A ratio below 3 months signals high liquidity risk.
          </p>
          <a href="https://www.bridgespan.org/insights/library/nonprofit-management/nonprofit-financial-health" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: Bridgespan Nonprofit Financial Health ↗
          </a>
        </div>

        <div className="card p-5">
          <p className="metric-label">Funder concentration index</p>
          <p className="mt-2 text-2xl font-bold">{metrics.concentration}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Herfindahl–Hirschman Index (HHI) of revenue concentration across funders. Score of 0 = fully diversified; 1.0 = single funder. Values above 0.40 indicate meaningful dependency risk.
          </p>
          <a href="https://candid.org/explore-issues/nonprofit-finance" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: Candid Nonprofit Finance Data ↗
          </a>
        </div>

        <div className="card p-5">
          <p className="metric-label">USAID dependency</p>
          <p className="mt-2 text-2xl font-bold">{metrics.usaidDependency}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Share of total organizational revenue sourced directly or indirectly from USAID grants and sub-awards. Derived from USAID Foreign Aid Explorer disbursement data cross-referenced with CSO filings.
          </p>
          <a href="https://foreignassistance.gov/" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: USAID Foreign Aid Explorer ↗
          </a>
        </div>

        <div className="card p-5">
          <p className="metric-label">Survival risk</p>
          <p className="mt-2">
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-sm font-semibold ${survivalClass(metrics.survivalRisk)}`}>
              {metrics.survivalRisk}
            </span>
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Composite risk rating derived from reserve ratio, funder concentration, and USAID dependency. Low = resilient; Critical = acute closure risk within 12 months absent new funding.
          </p>
          <a href="https://www.civicus.org/index.php/state-of-civil-society-report-2023" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-400 underline">
            Source: CIVICUS State of Civil Society ↗
          </a>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Top CSOs by USAID dependency %</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          X axis: USAID dependency as % of total revenue. Y axis: Organization name. Higher bars indicate greater exposure to USAID funding contraction.
        </p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CSO_USAID_BAR} layout="vertical" margin={{ left: 8, right: 24, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 50]} label={{ value: "USAID dependency (%)", position: "insideBottom", offset: -12 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, "USAID dependency"]} />
              <Bar dataKey="pct" fill="var(--accent-gold)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <a href="https://foreignassistance.gov/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-blue-400 underline">
          Source: USAID Foreign Aid Explorer ↗
        </a>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Risk matrix: concentration vs reserve ratio</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
          Each dot represents a CSO plotted by two dimensions of financial vulnerability.
          <strong> X axis (Funder Concentration Index)</strong>: HHI score from 0 (fully diversified) to 1.0 (single funder) — organizations further right are more dependent on a narrow funder base.
          <strong> Y axis (Reserve Ratio)</strong>: months of operating expenses held in unrestricted reserves — organizations lower on the chart have less runway.
          Organizations in the <strong>bottom-right quadrant</strong> (high concentration, low reserves) face the highest combined vulnerability and are the most exposed to funding shocks such as USAID withdrawal.
        </p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 24, bottom: 28, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="concentration"
                name="Concentration Index"
                domain={[0, 1]}
                label={{ value: "Funder Concentration Index (HHI)", position: "insideBottom", offset: -16 }}
              />
              <YAxis
                type="number"
                dataKey="reserve"
                name="Reserve (months)"
                label={{ value: "Reserve Ratio (months)", angle: -90, position: "insideLeft", offset: 10 }}
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [
                  name === "Concentration Index" ? value : `${value} mo`,
                  name,
                ]}
              />
              <Scatter name="CSOs" data={CSO_SCATTER} fill="var(--bg-primary)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
          <a href="https://candid.org/explore-issues/nonprofit-finance" target="_blank" rel="noreferrer" className="text-blue-400 underline">
            Source: Candid Nonprofit Finance ↗
          </a>
          <a href="https://www.civicus.org/index.php/state-of-civil-society-report-2023" target="_blank" rel="noreferrer" className="text-blue-400 underline">
            Source: CIVICUS State of Civil Society ↗
          </a>
        </div>
      </div>
    </div>
  );
}
