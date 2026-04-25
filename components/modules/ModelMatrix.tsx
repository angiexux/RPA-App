"use client";

import type { ExpansionModelColumn } from "@/lib/types";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { useAppStore } from "@/store";

const MODELS: ExpansionModelColumn[] = ["New Build", "Hybrid", "Local Partner"];

const DIMENSION_SOURCES: Record<string, { label: string; url: string }> = {
  cost:          { label: "Bridgespan: Effective Philanthropy Cost Benchmarks", url: "https://www.bridgespan.org/insights/library/philanthropy/effective-philanthropy" },
  timeline:      { label: "CAF World Giving Report — Operational Timelines", url: "https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" },
  keyRisks:      { label: "CIVICUS: State of Civil Society Report", url: "https://www.civicus.org/index.php/state-of-civil-society-report-2023" },
  rpaIntensity:  { label: "Candid: Fiscal Sponsorship Landscape", url: "https://candid.org/explore-issues/fiscal-sponsorship" },
  bestFit:       { label: "GPEI — Global Philanthropy Environment Index", url: "https://philanthropyindiana.org/gpei" },
  precedent:     { label: "CAF America: Cross-Border Giving Precedents", url: "https://www.cafamerica.org/resources/" },
};

const STATIC: Record<
  ExpansionModelColumn,
  {
    cost: string;
    timeline: string;
    keyRisks: string;
    rpaIntensity: string;
    bestFit: string;
    precedent: string;
    riskLevel: number;
  }
> = {
  "New Build": {
    cost: "$2.5M–$6.0M+ (legal entity, licenses, systems, launch team)",
    timeline: "18–36 months to steady-state operations",
    keyRisks:
      "Regulatory greenfield exposure, hiring drag, sponsor gap until local bench matures, reputational concentration on RPA.",
    rpaIntensity: "Very high — RPA owns compliance end-to-end",
    bestFit:
      "Markets with enabling law but insufficient fiscal sponsor depth where strategic control is worth the build cost.",
    precedent:
      "Uncommon as a first move; more typical after Hybrid proof or where mandate requires owned infrastructure.",
    riskLevel: 4.2,
  },
  Hybrid: {
    cost: "$800K–$2.5M (integration, governance, shared compliance layer)",
    timeline: "9–18 months to operational cadence",
    keyRisks:
      "Dual reporting lines, misaligned sponsor SLAs, policy shifts that split responsibilities awkwardly.",
    rpaIntensity: "High — shared control with measurable RPA overhead",
    bestFit:
      "Middle-income markets with credible partners and partial infrastructure; default expansion path for many funders.",
    precedent:
      "Common first fiscal footprint pattern across Global South hubs.",
    riskLevel: 3,
  },
  "Local Partner": {
    cost: "$400K–$1.2M (diligence, integration, oversight)",
    timeline: "6–12 months to first scaled programs",
    keyRisks:
      "Partner governance gaps, sponsor quality variance, sudden policy changes affecting sponsor status.",
    rpaIntensity: "Moderate — oversight-heavy, less direct operational load",
    bestFit:
      "Mature intermediary ecosystems and enabling policy — fastest path when trust and capacity exist.",
    precedent:
      "Typical where established fiscal hosts already clear banking and regulatory bars.",
    riskLevel: 2.3,
  },
};

function RiskMeter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Execution risk</span>
        <span className="font-semibold">{value.toFixed(1)}/5</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-[var(--danger)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ModelMatrix() {
  const activeCountry = useAppStore((s) => s.activeCountry);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Model Matrix</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Three operating models side by side for <strong>{activeCountry}</strong>.
          Use with the Regulatory Risk monitor and scorecard to stress-test recommendations.
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="model_matrix" country={activeCountry} />

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <th className="px-4 py-3 font-semibold">Dimension</th>
              {MODELS.map((m) => (
                <th key={m} className="px-4 py-3 font-semibold">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)]">
              <td className="px-4 py-3 font-medium text-[var(--text-muted)]">
                Risk meter
              </td>
              {MODELS.map((m) => (
                <td key={m} className="px-4 py-4 align-top">
                  <RiskMeter value={STATIC[m].riskLevel} />
                </td>
              ))}
            </tr>
            {(
              [
                { dimKey: "cost",        label: "Estimated cost range",    field: "cost"        },
                { dimKey: "timeline",    label: "Timeline to operational", field: "timeline"    },
                { dimKey: "keyRisks",    label: "Key risks",               field: "keyRisks"    },
                { dimKey: "rpaIntensity",label: "RPA resource intensity",  field: "rpaIntensity"},
                { dimKey: "bestFit",     label: "Best-fit country profile",field: "bestFit"     },
                { dimKey: "precedent",   label: "Example precedent",       field: "precedent"   },
              ] as const
            ).map(({ dimKey, label, field }, rowIdx, arr) => {
              const src = DIMENSION_SOURCES[dimKey];
              return (
                <tr key={dimKey} className={rowIdx < arr.length - 1 ? "border-b border-[var(--border)]" : ""}>
                  <td className="px-4 py-3 align-top font-medium text-[var(--text-muted)]">
                    <div>{label}</div>
                    {src && (
                      <a href={src.url} target="_blank" rel="noreferrer"
                        className="mt-1 block text-xs text-blue-400 underline hover:text-blue-300">
                        Source ↗
                      </a>
                    )}
                  </td>
                  {MODELS.map((m) => (
                    <td key={m} className="px-4 py-3 align-top leading-relaxed">
                      {STATIC[m][field]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
