"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";

type CountryKey = "Brazil" | "Nigeria";

interface PilotInputs {
  costInvested: number;
  deployed: number;
  nps: number;
  incidents: number;
  year: number;
  quarter: 1 | 2 | 3 | 4;
}

interface QuarterSnapshot extends PilotInputs {
  label: string;
  costPerDollarDeployed: number;
  efficiency: number;
  incidentRate: number;
}

const STORAGE_KEY = "pilot-roi-v1";

const DEFAULTS: Record<CountryKey, PilotInputs> = {
  Brazil: {
    costInvested: 1_200_000,
    deployed: 9_800_000,
    nps: 38,
    incidents: 2,
    year: 2026,
    quarter: 1,
  },
  Nigeria: {
    costInvested: 980_000,
    deployed: 6_200_000,
    nps: 44,
    incidents: 5,
    year: 2026,
    quarter: 1,
  },
};

function loadFromStorage():
  | {
      br: PilotInputs;
      ng: PilotInputs;
      history: Record<CountryKey, QuarterSnapshot[]>;
    }
  | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as {
      br?: PilotInputs;
      ng?: PilotInputs;
      history?: Record<CountryKey, QuarterSnapshot[]>;
    };
    return {
      br: parsed.br ?? DEFAULTS.Brazil,
      ng: parsed.ng ?? DEFAULTS.Nigeria,
      history: parsed.history ?? { Brazil: [], Nigeria: [] },
    };
  } catch {
    return undefined;
  }
}

function computeMetrics(inputs: PilotInputs) {
  const costPerDollarDeployed =
    inputs.deployed > 0 ? inputs.costInvested / inputs.deployed : 0;
  const efficiency =
    inputs.costInvested > 0 ? inputs.deployed / inputs.costInvested : 0;
  const incidentRate =
    inputs.deployed > 0
      ? (inputs.incidents / inputs.deployed) * 10_000_000
      : 0;
  return { costPerDollarDeployed, efficiency, incidentRate };
}

export function PilotRoiTracker() {
  const [tab, setTab] = useState<CountryKey>("Brazil");
  const [br, setBr] = useState<PilotInputs>(() => {
    return loadFromStorage()?.br ?? DEFAULTS.Brazil;
  });
  const [ng, setNg] = useState<PilotInputs>(() => {
    return loadFromStorage()?.ng ?? DEFAULTS.Nigeria;
  });
  const [history, setHistory] = useState<
    Record<CountryKey, QuarterSnapshot[]>
  >(() => {
    return loadFromStorage()?.history ?? { Brazil: [], Nigeria: [] };
  });

  const persist = useCallback(
    (
      nextBr: PilotInputs,
      nextNg: PilotInputs,
      nextHist: Record<CountryKey, QuarterSnapshot[]>,
    ) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ br: nextBr, ng: nextNg, history: nextHist }),
      );
    },
    [],
  );

  const inputs = tab === "Brazil" ? br : ng;

  const metrics = useMemo(() => computeMetrics(inputs), [inputs]);

  const chartData = useMemo(() => {
    const h = history[tab].slice(-4);
    return h.map((q) => ({
      label: q.label,
      efficiency: Math.round(q.efficiency * 100) / 100,
    }));
  }, [history, tab]);

  const updateField = <K extends keyof PilotInputs>(
    key: K,
    value: PilotInputs[K],
  ) => {
    const next = { ...inputs, [key]: value };
    if (tab === "Brazil") {
      setBr(next);
      persist(next, ng, history);
    } else {
      setNg(next);
      persist(br, next, history);
    }
  };

  const recordQuarter = () => {
    const m = computeMetrics(inputs);
    const label = `${inputs.year} Q${inputs.quarter}`;
    const snap: QuarterSnapshot = {
      ...inputs,
      label,
      ...m,
    };
    const list = [...history[tab], snap].slice(-8);
    const nextHist = { ...history, [tab]: list };
    setHistory(nextHist);
    persist(br, ng, nextHist);
  };

  const resetDefaults = () => {
    setBr(DEFAULTS.Brazil);
    setNg(DEFAULTS.Nigeria);
    setHistory({ Brazil: [], Nigeria: [] });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pilot ROI Tracker</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Brazil and Nigeria pilots — inputs persist in{" "}
          <code className="rounded bg-slate-100 px-1">localStorage</code>.
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="pilot_roi_tracker" country={tab} />

      <div className="flex flex-wrap gap-2">
        {(["Brazil", "Nigeria"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setTab(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === c
                ? "bg-[var(--bg-primary)] text-white"
                : "border border-[var(--border)] bg-white"
            }`}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          onClick={resetDefaults}
          className="ml-auto rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800"
        >
          Reset to defaults
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-bold">Inputs</h2>
          <label className="block text-sm">
            <span className="text-[var(--text-muted)]">Total cost invested ($)</span>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2"
              value={inputs.costInvested}
              onChange={(e) =>
                updateField("costInvested", Number(e.target.value))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--text-muted)]">
              Total $ deployed to grantees ($)
            </span>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2"
              value={inputs.deployed}
              onChange={(e) =>
                updateField("deployed", Number(e.target.value))
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--text-muted)]">NPS (0–100)</span>
            <input
              type="number"
              min={0}
              max={100}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2"
              value={inputs.nps}
              onChange={(e) => updateField("nps", Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--text-muted)]"># of incidents</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2"
              value={inputs.incidents}
              onChange={(e) =>
                updateField("incidents", Number(e.target.value))
              }
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="text-sm">
              <span className="text-[var(--text-muted)]">Year</span>
              <input
                type="number"
                className="mt-1 block w-28 rounded-xl border border-[var(--border)] px-3 py-2"
                value={inputs.year}
                onChange={(e) => updateField("year", Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              <span className="text-[var(--text-muted)]">Quarter</span>
              <select
                className="mt-1 block rounded-xl border border-[var(--border)] px-3 py-2"
                value={inputs.quarter}
                onChange={(e) =>
                  updateField("quarter", Number(e.target.value) as 1 | 2 | 3 | 4)
                }
              >
                {[1, 2, 3, 4].map((q) => (
                  <option key={q} value={q}>
                    Q{q}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={recordQuarter}
            className="gold-gradient w-full rounded-xl py-3 text-sm font-semibold text-white"
          >
            Record this quarter to trend
          </button>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-bold">Computed outputs</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-2 border-b border-[var(--border)] pb-2">
              <dt>Cost per $ deployed</dt>
              <dd className="font-semibold">
                {metrics.costPerDollarDeployed.toFixed(4)}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-[var(--border)] pb-2">
              <dt>Efficiency ($ deployed / $ RPA cost)</dt>
              <dd className="font-semibold">
                {metrics.efficiency.toFixed(2)}×
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Incidents per $10M deployed</dt>
              <dd className="font-semibold">
                {metrics.incidentRate.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold">Quarterly efficiency (last 4 recorded)</h2>
        {chartData.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Record at least one quarter to populate the chart.
          </p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" label={{ value: "Quarter", position: "insideBottom", offset: -12 }} />
                <YAxis label={{ value: "Efficiency (×)", angle: -90, position: "insideLeft", offset: 10 }} />
                <Tooltip formatter={(v) => [`${v}×`, "Efficiency"]} />
                <Bar dataKey="efficiency" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
