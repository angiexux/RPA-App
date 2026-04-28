"use client";

import { useMemo } from "react";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { USAID_ROWS } from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

const CONTINENT_MAP: Record<string, string> = {
  Brazil: "Americas",
  Colombia: "Americas",
  Guatemala: "Americas",
  Honduras: "Americas",
  Nigeria: "Africa",
  Kenya: "Africa",
  "South Africa": "Africa",
  Ethiopia: "Africa",
  Mozambique: "Africa",
  Tanzania: "Africa",
  Jordan: "Middle East",
  Lebanon: "Middle East",
  Ukraine: "Europe",
  Bangladesh: "Asia-Pacific",
  Philippines: "Asia-Pacific",
};

const CONTINENT_CHIP_COLOR: Record<string, string> = {
  Americas:    "bg-teal-700/80",
  Africa:      "bg-orange-600/80",
  "Middle East": "bg-amber-600/80",
  Europe:      "bg-blue-700/80",
  "Asia-Pacific": "bg-purple-700/80",
};

const USAID_SOURCE_URL = "https://foreignassistance.gov/";

function gapColor(gap: number) {
  if (gap >= 150) return "text-red-400 font-bold";
  if (gap >= 80)  return "text-orange-400 font-semibold";
  if (gap >= 50)  return "text-amber-400";
  return "";
}

export function UsaidWithdrawal() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  const totalGap = useMemo(() => USAID_ROWS.reduce((s, r) => s + r.gap, 0), []);

  const sortedByGapDesc = useMemo(
    () => [...USAID_ROWS].sort((a, b) => b.gap - a.gap),
    [],
  );

  const sortedAlpha = useMemo(
    () => [...USAID_ROWS].sort((a, b) => a.country.localeCompare(b.country)),
    [],
  );

  const continents = useMemo(() => {
    const groups: Record<string, typeof USAID_ROWS> = {};
    for (const row of sortedByGapDesc) {
      const c = CONTINENT_MAP[row.country] ?? "Other";
      if (!groups[c]) groups[c] = [];
      groups[c].push(row);
    }
    return groups;
  }, [sortedByGapDesc]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">USAID Withdrawal Map</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Funding gap estimates across 15 markets most exposed to USAID contraction.
          Gap = estimated annual shortfall if USAID support is fully withdrawn.
          % filled = share of gap currently covered by alternative sources.
          Data source: USAID Foreign Aid Explorer disbursement records.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="usaid_withdrawal" country={activeCountry} />

      <div className="card p-5">
        <p className="metric-label">Total estimated gap</p>
        <p className="mt-2 text-2xl font-bold">${totalGap}M</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Illustrative aggregate across 15 markets. Chips sorted by gap size (largest first), grouped by continent.
        </p>

        <div className="mt-4 space-y-4">
          {Object.entries(continents).map(([continent, rows]) => (
            <div key={continent}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {continent}
              </p>
              <div className="flex flex-wrap gap-2">
                {rows.map((row) => (
                  <div
                    key={row.country}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
                      CONTINENT_CHIP_COLOR[continent] ?? "bg-slate-600"
                    } ${row.country === activeCountry ? "ring-2 ring-white ring-offset-1 ring-offset-transparent" : ""}`}
                    title={`${row.country}: $${row.gap}M gap, ${row.pctFilled}% filled`}
                  >
                    {row.country} · ${row.gap}M
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Country-level detail</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Sorted alphabetically. Selected country highlighted.</p>
        <table className="mt-4 w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2 pr-3">Country</th>
              <th className="py-2 pr-3">Gap ($M)</th>
              <th className="py-2 pr-3">% gap filled</th>
              <th className="py-2 pr-3">Primary pivot strategy</th>
              <th className="py-2 pr-3">At-risk sectors</th>
              <th className="py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlpha.map((row) => {
              const isSelected = row.country === activeCountry;
              return (
                <tr
                  key={row.country}
                  className={`border-b border-[var(--border)] ${
                    isSelected
                      ? "bg-[var(--accent-gold)]/10 font-semibold"
                      : ""
                  }`}
                >
                  <td className="py-2 pr-3">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-gold)]" />
                        {row.country}
                      </span>
                    ) : (
                      row.country
                    )}
                  </td>
                  <td className={`py-2 pr-3 ${gapColor(row.gap)}`}>${row.gap}M</td>
                  <td className="py-2 pr-3">{row.pctFilled}%</td>
                  <td className="py-2 pr-3">{row.pivot}</td>
                  <td className="py-2 pr-3">{row.sectors}</td>
                  <td className="py-2">
                    <a
                      href={USAID_SOURCE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-400 underline"
                    >
                      Foreign Aid Explorer ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
