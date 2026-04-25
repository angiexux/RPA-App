"use client";

import { useMemo } from "react";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { CLIMATE_DEALS } from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

export function ClimatePipeline() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  const rows = useMemo(() => {
    return CLIMATE_DEALS.filter((d) => d.country === activeCountry);
  }, [activeCountry]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Climate Pipeline</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Climate-sector commitments for <strong>{activeCountry}</strong>. Select a different country via the top bar to update this view.
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="climate_pipeline" country={activeCountry} />

      <div className="card overflow-x-auto p-5">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Funder</th>
              <th className="py-2">Country</th>
              <th className="py-2">Intermediary</th>
              <th className="py-2">Commitment</th>
              <th className="py-2">Sector</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d, i) => (
              <tr key={`${d.funder}-${d.country}-${i}`} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{d.funder}</td>
                <td className="py-2">{d.country}</td>
                <td className="py-2">{d.intermediary}</td>
                <td className="py-2">{d.commitment}</td>
                <td className="py-2">{d.sector}</td>
                <td className="py-2">{d.status}</td>
                <td className="py-2">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
