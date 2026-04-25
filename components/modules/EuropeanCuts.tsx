"use client";

import { useAppStore } from "@/store";
import { EUROPE_DONORS, EUROPE_IMPACT } from "@/lib/moduleSeedData";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";

const DONOR_SOURCES: Record<string, { label: string; url: string }> = {
  "United Kingdom": {
    label: "FCDO Development Statistics",
    url: "https://www.gov.uk/government/collections/statistics-on-international-development",
  },
  Germany: {
    label: "BMZ ODA Data",
    url: "https://www.bmz.de/en/development-policy/oda",
  },
  France: {
    label: "AFD Annual Report",
    url: "https://www.afd.fr/en/ressources/afd-annual-report",
  },
  Netherlands: {
    label: "MFA Netherlands Development Data",
    url: "https://www.government.nl/topics/development-cooperation/budget-for-development-cooperation",
  },
};

const EXPOSURE_RATIONALE: Record<string, string> = {
  UK: "UK bilateral programmes are heavily concentrated in sub-Saharan Africa (Kenya, Nigeria) and South Asia (Bangladesh), which together account for the majority of FCDO civil society grants.",
  Germany: "BMZ funding is routed via GIZ and KfW with significant exposure to Mozambique and Ukraine reconstruction, plus Jordan's refugee response programmes.",
  France: "AFD Sahel and Francophone Africa programmes make Senegal and Côte d'Ivoire the primary exposure markets; Lebanon receives humanitarian budget lines.",
  NL: "DGIS SRHR and food security portfolios are concentrated in Ethiopia, Uganda, and Colombia — sectors with limited domestic funding substitutes.",
};

export function EuropeanCuts() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">European Bilateral Cuts</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          UK, Germany, France, and Netherlands ODA reductions and their estimated
          impact on Global South civil society organisations. Cut amounts are
          illustrative estimates based on published budget announcements; actual
          disbursement impacts will vary by programme and implementing partner.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="european_cuts" country={activeCountry} />

      <div className="grid gap-4 md:grid-cols-2">
        {EUROPE_DONORS.map((d) => {
          const src = DONOR_SOURCES[d.name];
          return (
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
                  <span className="font-semibold">Affected CSOs (est.): </span>
                  {d.csos}
                </p>
                {src && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs text-blue-400 underline"
                  >
                    Source: {src.label} ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Cut implementation timeline</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Based on published budget announcements and parliamentary statements. Exact effective dates vary by programme envelope and implementing partner agreement.
        </p>
        <ol className="mt-4 space-y-3 border-l-2 border-[var(--accent-gold)] pl-4">
          <li>
            <span className="font-semibold">2025-Q2 — </span>
            Formal announcement wave across UK FCDO, BMZ, AFD, and DGIS; multilateral commentary begins
            <a href="https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/" target="_blank" rel="noreferrer" className="ml-2 text-xs text-blue-400 underline">OECD DAC ↗</a>
          </li>
          <li>
            <span className="font-semibold">2025-Q4 — </span>
            Effective dates begin for several programme envelopes; partner notification letters issued
            <a href="https://www.civicus.org/index.php/state-of-civil-society-report-2023" target="_blank" rel="noreferrer" className="ml-2 text-xs text-blue-400 underline">CIVICUS ↗</a>
          </li>
          <li>
            <span className="font-semibold">2026-Q1 — </span>
            CSO cash-flow stress visible in quarterly reporting; bridge-funding requests rise
            <a href="https://candid.org/explore-issues/nonprofit-finance" target="_blank" rel="noreferrer" className="ml-2 text-xs text-blue-400 underline">Candid ↗</a>
          </li>
          <li>
            <span className="font-semibold">2026-Q3 — </span>
            Mid-year review; some donors announce partial reinstatements or reprogramming
          </li>
        </ol>
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Global South exposure by donor</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Markets listed are those where each donor's bilateral ODA represents a significant share of civil society operating budgets. Exposure is highest where domestic philanthropy and alternative bilaterals cannot absorb the shortfall within 12–18 months.
        </p>
        <table className="mt-4 w-full min-w-[500px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2 pr-4">Donor</th>
              <th className="py-2 pr-4">Most exposed markets</th>
              <th className="py-2">Why exposed</th>
            </tr>
          </thead>
          <tbody>
            {EUROPE_IMPACT.map((row) => (
              <tr key={row.donor} className="border-b border-[var(--border)]">
                <td className="py-3 pr-4 font-semibold">{row.donor}</td>
                <td className="py-3 pr-4">{row.exposed}</td>
                <td className="py-3 text-xs text-[var(--text-muted)] leading-relaxed">
                  {EXPOSURE_RATIONALE[row.donor] ?? "Significant bilateral programme concentration in listed markets."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <a
          href="https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs text-blue-400 underline"
        >
          Source: OECD Development Finance Statistics ↗
        </a>
      </div>
    </div>
  );
}
