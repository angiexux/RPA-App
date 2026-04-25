"use client";

import { DAF_PROVIDERS } from "@/lib/moduleSeedData";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { useAppStore } from "@/store";

export function DafMonitor() {
  const activeCountry = useAppStore((s) => s.activeCountry);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">DAF Cross-Border Monitor</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          CAF America, GlobalGiving, Fidelity Charitable — Brazil/Nigeria
          posture and RPA compatibility (seeded).
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="daf_monitor" country={activeCountry} />

      <div className="grid gap-4 md:grid-cols-3">
        {DAF_PROVIDERS.map((p) => (
          <div key={p.name} className="card p-5">
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">AUM {p.aum}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-[var(--text-muted)]">Brazil activity</dt>
                <dd className="font-medium">{p.brazil}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Nigeria activity</dt>
                <dd className="font-medium">{p.nigeria}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">RPA compatibility (1–5)</dt>
                <dd className="font-bold text-[var(--accent-gold)]">{p.score}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Notes</dt>
                <dd>{p.notes}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto p-5">
        <h2 className="text-lg font-bold">Compatibility matrix</h2>
        <table className="mt-4 w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Provider</th>
              <th className="py-2">Brazil</th>
              <th className="py-2">Nigeria</th>
              <th className="py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {DAF_PROVIDERS.map((p) => (
              <tr key={p.name} className="border-b border-[var(--border)]">
                <td className="py-2 font-medium">{p.name}</td>
                <td className="py-2">{p.brazil}</td>
                <td className="py-2">{p.nigeria}</td>
                <td className="py-2">{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Transfer mechanisms (illustrative)</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[var(--text-muted)]">
              <th className="py-2">Mechanism</th>
              <th className="py-2">Fees</th>
              <th className="py-2">Timeline</th>
              <th className="py-2">Restrictions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]">
              <td className="py-2">DAF → intermediary grant</td>
              <td className="py-2">5–9%</td>
              <td className="py-2">4–12 wks</td>
              <td className="py-2">KYC + mission alignment</td>
            </tr>
            <tr className="border-b border-[var(--border)]">
              <td className="py-2">Direct NGO wire</td>
              <td className="py-2">Bank + FX</td>
              <td className="py-2">2–8 wks</td>
              <td className="py-2">Stronger bank diligence</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
