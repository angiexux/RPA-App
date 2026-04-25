"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import {
  PROJECT_RISK_MOCK,
  type ProjectRiskLevel,
  type ProjectRiskRow,
} from "@/lib/projectRiskMock";

const TABS: Array<"All" | ProjectRiskLevel> = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];

function riskClass(level: ProjectRiskLevel): string {
  switch (level) {
    case "Critical":
      return "bg-red-600 text-white";
    case "High":
      return "bg-orange-500 text-white";
    case "Medium":
      return "bg-amber-400 text-amber-950";
    case "Low":
      return "bg-emerald-600 text-white";
  }
}

function toCsv(rows: ProjectRiskRow[]) {
  const header = [
    "Project Name",
    "Country",
    "Sector",
    "Risk Level",
    "Compliance Status",
    "Recommended Action",
  ];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.country}"`,
        `"${r.sector}"`,
        r.risk,
        `"${r.compliance.replace(/"/g, '""')}"`,
        `"${r.action.replace(/"/g, '""')}"`,
      ].join(","),
    ),
  ];
  return lines.join("\n");
}

export function ProjectRiskDashboard() {
  const [tab, setTab] = useState<"All" | ProjectRiskLevel>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PROJECT_RISK_MOCK.filter((row) => {
      if (tab !== "All" && row.risk !== tab) return false;
      if (!needle) return true;
      return (
        row.name.toLowerCase().includes(needle) ||
        row.country.toLowerCase().includes(needle)
      );
    });
  }, [tab, q]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-risk-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Risk Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
            Mock portfolio across Brazil, Nigeria, Kenya, and Colombia — filter
            by risk, search by project or country, export to CSV.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-4 py-3 text-sm font-semibold text-white"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
      <ModuleClaudeRefresh moduleKey="project_risk_dashboard" country="Portfolio" />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t
                ? "gold-gradient text-white"
                : "border border-[var(--border)] bg-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card p-5">
        <label className="block text-sm">
          <span className="text-[var(--text-muted)]">
            Search project name or country
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Lagos or Brazil"
            className="mt-2 w-full max-w-md rounded-xl border border-[var(--border)] px-3 py-2"
          />
        </label>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-[var(--bg-secondary)]">
            <tr className="text-left text-[var(--text-muted)]">
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Compliance</th>
              <th className="px-4 py-3">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[var(--border)] hover:bg-amber-50/40"
              >
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3">{row.country}</td>
                <td className="px-4 py-3">{row.sector}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${riskClass(
                      row.risk,
                    )}`}
                  >
                    {row.risk}
                  </span>
                </td>
                <td className="px-4 py-3">{row.compliance}</td>
                <td className="px-4 py-3">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--text-muted)]">
            No projects match your filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
