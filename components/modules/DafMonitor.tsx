"use client";

import { DAF_PROVIDERS } from "@/lib/moduleSeedData";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { useAppStore } from "@/store";

const PROVIDER_SOURCES: Record<string, { label: string; url: string }> = {
  "CAF America": {
    label: "CAF America — Cross-Border Giving",
    url: "https://www.cafamerica.org/resources/",
  },
  GlobalGiving: {
    label: "GlobalGiving — How It Works",
    url: "https://www.globalgiving.org/aboutus/",
  },
  "Fidelity Charitable": {
    label: "Fidelity Charitable — International Giving",
    url: "https://www.fidelitycharitable.org/guidance/philanthropy/international-giving.html",
  },
};

function scoreColor(score: number) {
  if (score >= 4) return "text-emerald-400";
  if (score >= 3) return "text-amber-400";
  return "text-red-400";
}

export function DafMonitor() {
  const activeCountry = useAppStore((s) => s.activeCountry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DAF Cross-Border Monitor</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Donor-Advised Fund (DAF) providers and their capacity to route
          cross-border grants to Global South civil society. RPA compatibility
          score (1–5) reflects ease of co-grantmaking, compliance alignment, and
          average grant size relative to RPA's typical programme scale.
        </p>
      </div>

      <ModuleClaudeRefresh moduleKey="daf_monitor" country={activeCountry} />

      <div className="grid gap-4 md:grid-cols-3">
        {DAF_PROVIDERS.map((p) => {
          const src = PROVIDER_SOURCES[p.name];
          return (
            <div key={p.name} className="card p-5">
              <h2 className="text-lg font-bold">{p.name}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">AUM {p.aum}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-[var(--text-muted)]">Brazil activity</dt>
                  <dd className="font-medium">{p.brazil}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)]">Nigeria activity</dt>
                  <dd className="font-medium">{p.nigeria}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)]">RPA compatibility (1–5)</dt>
                  <dd className={`text-xl font-bold ${scoreColor(p.score)}`}>{p.score} / 5</dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-muted)]">Notes</dt>
                  <dd className="leading-relaxed">{p.notes}</dd>
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

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Compatibility matrix</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          RPA compatibility score reflects: KYC/AML alignment, minimum grant size fit, legal entity acceptance in target countries, and co-grantmaking track record. Score of 4–5 = strong fit; 2–3 = conditional; 1 = limited cross-border utility for RPA-scale grants.
        </p>
        <table className="mt-4 w-full min-w-[540px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2 pr-3">Provider</th>
              <th className="py-2 pr-3">Brazil posture</th>
              <th className="py-2 pr-3">Nigeria posture</th>
              <th className="py-2 pr-3">RPA score</th>
              <th className="py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {DAF_PROVIDERS.map((p) => {
              const src = PROVIDER_SOURCES[p.name];
              return (
                <tr key={p.name} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-3 font-medium">{p.name}</td>
                  <td className="py-2 pr-3">{p.brazil}</td>
                  <td className="py-2 pr-3">{p.nigeria}</td>
                  <td className={`py-2 pr-3 font-bold ${scoreColor(p.score)}`}>{p.score} / 5</td>
                  <td className="py-2">
                    {src && (
                      <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">
                        {p.name.split(" ")[0]} ↗
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Transfer mechanisms</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
          Cross-border DAF grants flow via two primary mechanisms. The <span className="font-semibold">DAF → intermediary grant</span> route uses a qualified U.S. intermediary (e.g. CAF America) to receive DAF dollars and re-grant internationally after conducting due diligence on the foreign recipient — this is the most common route for Nigeria and Brazil. The <span className="font-semibold">direct NGO wire</span> route sends funds directly from the DAF sponsor to a foreign nonprofit's bank account, which requires the foreign entity to pass enhanced KYC and the DAF sponsor's cross-border policy; bank settlement timelines and FX costs vary significantly by country.
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2 pr-4">Mechanism</th>
              <th className="py-2 pr-4">Typical fees</th>
              <th className="py-2 pr-4">Timeline</th>
              <th className="py-2">Key restrictions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]">
              <td className="py-3 pr-4 font-medium">DAF → intermediary grant</td>
              <td className="py-3 pr-4">5–9% (intermediary + admin)</td>
              <td className="py-3 pr-4">4–12 weeks</td>
              <td className="py-3">KYC on final recipient + mission alignment review by intermediary</td>
            </tr>
            <tr className="border-b border-[var(--border)]">
              <td className="py-3 pr-4 font-medium">Direct NGO wire</td>
              <td className="py-3 pr-4">Bank + FX spread (1–3%)</td>
              <td className="py-3 pr-4">2–8 weeks</td>
              <td className="py-3">Enhanced bank diligence; DAF sponsor cross-border policy approval required</td>
            </tr>
          </tbody>
        </table>
        <a
          href="https://www.cafamerica.org/resources/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs text-blue-400 underline"
        >
          Source: CAF America Cross-Border Giving Resources ↗
        </a>
      </div>
    </div>
  );
}
