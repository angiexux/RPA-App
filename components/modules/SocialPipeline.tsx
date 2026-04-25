"use client";

import { useMemo } from "react";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { SOCIAL_DEALS } from "@/lib/moduleSeedData";
import { useAppStore } from "@/store";

const STATUS_CLASS: Record<string, string> = {
  Active:   "bg-emerald-100 text-emerald-900",
  Closing:  "bg-amber-100 text-amber-900",
  Pipeline: "bg-blue-100 text-blue-900",
};

const FUNDER_SOURCES: Record<string, { label: string; url: string }> = {
  MacArthur:           { label: "MacArthur Foundation Grants", url: "https://www.macfound.org/grants" },
  "Ford Foundation":   { label: "Ford Foundation Grants DB", url: "https://www.fordfoundation.org/work/our-grants/grants-database/" },
  "Open Society":      { label: "Open Society Foundations Grants", url: "https://www.opensocietyfoundations.org/grants" },
  "Mastercard Foundation": { label: "Mastercard Foundation Grants", url: "https://mastercardfdn.org/all-grantees/" },
  Wellcome:            { label: "Wellcome Grant Funding", url: "https://wellcome.org/grant-funding" },
};

export function SocialPipeline() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  const rows = useMemo(
    () => SOCIAL_DEALS.filter((d) => d.country === activeCountry),
    [activeCountry],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Pipeline</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Active, closing, and pipeline social-sector and rights-oriented grant
          commitments for <strong>{activeCountry}</strong>. Commitment figures
          are publicly disclosed amounts sourced from funder grant databases and
          OECD private philanthropy records.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="social_pipeline" country={activeCountry} />

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">
          Deals — {activeCountry}{" "}
          <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
            ({rows.length} {rows.length === 1 ? "deal" : "deals"})
          </span>
        </h2>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-muted)]">
            No social deals seeded for <strong>{activeCountry}</strong>. Use
            &ldquo;Refresh (Claude)&rdquo; above to pull live data for this country.
          </div>
        ) : (
          <table className="mt-4 w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b text-left text-[var(--text-muted)]">
                <th className="py-2 pr-3">Funder</th>
                <th className="py-2 pr-3">Intermediary</th>
                <th className="py-2 pr-3">Commitment</th>
                <th className="py-2 pr-3">Sector</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d, i) => {
                const src = FUNDER_SOURCES[d.funder];
                return (
                  <tr
                    key={`${d.funder}-${d.country}-${i}`}
                    className="border-b border-[var(--border)]"
                  >
                    <td className="py-2 pr-3 font-medium">{d.funder}</td>
                    <td className="py-2 pr-3">{d.intermediary}</td>
                    <td className="py-2 pr-3 font-semibold">{d.commitment}</td>
                    <td className="py-2 pr-3">{d.sector}</td>
                    <td className="py-2 pr-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_CLASS[d.status] ?? "bg-slate-100 text-slate-700"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2 pr-3">{d.date}</td>
                    <td className="py-2">
                      {src ? (
                        <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">
                          {src.label.split(" ")[0]} ↗
                        </a>
                      ) : (
                        <a href="https://www.oecd.org/development/private-philanthropy-for-development.htm" target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">
                          OECD ↗
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-5 text-xs text-[var(--text-muted)]">
        <span className="font-semibold">Sources: </span>
        <a href="https://www.macfound.org/grants" target="_blank" rel="noreferrer" className="text-blue-400 underline">MacArthur Foundation ↗</a>
        {", "}
        <a href="https://www.fordfoundation.org/work/our-grants/grants-database/" target="_blank" rel="noreferrer" className="text-blue-400 underline">Ford Foundation ↗</a>
        {", "}
        <a href="https://www.opensocietyfoundations.org/grants" target="_blank" rel="noreferrer" className="text-blue-400 underline">Open Society Foundations ↗</a>
        {", "}
        <a href="https://mastercardfdn.org/all-grantees/" target="_blank" rel="noreferrer" className="text-blue-400 underline">Mastercard Foundation ↗</a>
        {", "}
        <a href="https://wellcome.org/grant-funding" target="_blank" rel="noreferrer" className="text-blue-400 underline">Wellcome ↗</a>
      </div>
    </div>
  );
}
