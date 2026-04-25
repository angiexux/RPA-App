"use client";

import type {
  ExpansionModelColumn,
  ModelColumnRegulatoryDetail,
} from "@/lib/types";
import { modelColor } from "@/lib/scoring";
import type { ModelRecommendation } from "@/lib/types";

const ORDER: ExpansionModelColumn[] = ["New Build", "Hybrid", "Local Partner"];

function RiskMeter({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{label}</span>
        <span className="font-semibold text-[var(--text-primary)]">
          {value.toFixed(1)}/5
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-[var(--danger)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
        Higher = more execution exposure for RPA under this model
      </p>
    </div>
  );
}

function FitMeter({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Regulatory fit</span>
        <span className="font-semibold text-[var(--accent-gold)]">
          {value.toFixed(1)}/5
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="gold-gradient h-2 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const ROWS: {
  key: keyof Pick<
    ModelColumnRegulatoryDetail,
    | "estimatedCostRange"
    | "timelineOperational"
    | "keyRegulatoryRisk"
    | "rpaComplianceIntensity"
    | "bestFitProfile"
    | "examplePrecedent"
  >;
  label: string;
  sourceLabel: string;
  sourceUrl: string;
}[] = [
  { key: "estimatedCostRange",    label: "Estimated cost range",      sourceLabel: "Bridgespan: Philanthropy Cost Benchmarks",     sourceUrl: "https://www.bridgespan.org/insights/library/philanthropy/effective-philanthropy" },
  { key: "timelineOperational",   label: "Timeline to operational",   sourceLabel: "CAF World Giving Report",                      sourceUrl: "https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index" },
  { key: "keyRegulatoryRisk",     label: "Key regulatory risk",       sourceLabel: "CIVICUS: State of Civil Society Report",       sourceUrl: "https://www.civicus.org/index.php/state-of-civil-society-report-2023" },
  { key: "rpaComplianceIntensity",label: "RPA compliance intensity",  sourceLabel: "Candid: Fiscal Sponsorship Landscape",         sourceUrl: "https://candid.org/explore-issues/fiscal-sponsorship" },
  { key: "bestFitProfile",        label: "Best-fit country profile",  sourceLabel: "GPEI — Global Philanthropy Environment Index", sourceUrl: "https://philanthropyindiana.org/gpei" },
  { key: "examplePrecedent",      label: "Example precedent",         sourceLabel: "CAF America: Cross-Border Giving",             sourceUrl: "https://www.cafamerica.org/resources/" },
];

export function ModelDecisionColumns({
  recommendedColumn,
  scorecardModel,
  columns,
}: {
  recommendedColumn: ExpansionModelColumn;
  scorecardModel: ModelRecommendation;
  columns: Record<ExpansionModelColumn, ModelColumnRegulatoryDetail>;
}) {
  return (
    <section className="card overflow-hidden p-0">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4">
        <p className="metric-label">Decision frame</p>
        <h2 className="text-xl font-bold">
          Three expansion models — regulatory lens
        </h2>
        <p className="mt-2 max-w-4xl text-sm text-[var(--text-muted)]">
          Compare New Build, Hybrid, and Local Partner side by side. Regulatory
          fit reflects how well each model matches current policy and
          enforcement reality; execution risk is the burden RPA would carry
          under that model.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[var(--bg-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Regulatory pick: {recommendedColumn}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${modelColor(scorecardModel)}`}
          >
            Scorecard model: {scorecardModel}
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-3">
        {ORDER.map((key) => {
          const col = columns[key];
          const isRecommended = key === recommendedColumn;

          return (
            <div
              key={key}
              className={`flex flex-col border-b border-[var(--border)] lg:border-b-0 lg:border-r lg:last:border-r-0 ${
                isRecommended
                  ? "bg-amber-50/80 ring-2 ring-inset ring-[var(--accent-gold)]"
                  : "bg-white"
              }`}
            >
              <div className="border-b border-[var(--border)] px-4 py-4">
                <p className="metric-label">{key}</p>
                <div className="mt-3 space-y-4">
                  <FitMeter value={col.regulatoryFit} />
                  <RiskMeter value={col.executionRisk} label="Execution risk" />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 px-4 py-4 text-sm">
                {ROWS.map((row) => (
                  <div key={row.key}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      {row.label}
                    </p>
                    <p className="mt-1 leading-relaxed text-[var(--text-primary)]">
                      {col[row.key]}
                    </p>
                    <a
                      href={row.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-[11px] text-blue-400 underline hover:text-blue-300"
                    >
                      Source: {row.sourceLabel} ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
