"use client";

import { EUROPE_DONORS, EUROPE_IMPACT } from "@/lib/moduleSeedData";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";

export function EuropeanCuts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">European Bilateral Cuts</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          UK, Germany, France, Netherlands — illustrative cut amounts and CSO
          exposure (seeded MVP).
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="european_cuts" country="Europe to Global South" />

      <div className="grid gap-4 md:grid-cols-2">
        {EUROPE_DONORS.map((d) => (
          <div key={d.name} className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{d.flag}</span>
              <div>
                <h2 className="text-xl font-bold">{d.name}</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Est. cut {d.cut} · ~{d.pct}% reduction vs prior plan
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Top affected sectors: </span>
                {d.sectors}
              </p>
              <p>
                <span className="font-semibold">Affected CSO count (indic.): </span>
                {d.csos}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Timeline (illustrative)</h2>
        <ol className="mt-4 space-y-3 border-l-2 border-[var(--accent-gold)] pl-4">
          <li>
            <span className="font-semibold">2025-Q2 — </span>
            Announcement wave (multilateral + bilateral commentary)
          </li>
          <li>
            <span className="font-semibold">2025-Q4 — </span>
            Effective dates begin for several envelopes
          </li>
          <li>
            <span className="font-semibold">2026-Q1 — </span>
            CSO cash-flow stress visible in quarterly reporting
          </li>
        </ol>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Global South exposure by donor</h2>
        <table className="mt-4 w-full min-w-[400px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Donor</th>
              <th className="py-2">Most exposed markets (illustrative)</th>
            </tr>
          </thead>
          <tbody>
            {EUROPE_IMPACT.map((row) => (
              <tr key={row.donor} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{row.donor}</td>
                <td className="py-2">{row.exposed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
