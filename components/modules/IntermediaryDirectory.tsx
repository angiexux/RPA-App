"use client";

import { useMemo, useState } from "react";
import { ModuleClaudeRefresh } from "@/components/ModuleClaudeRefresh";
import { DIRECTORY_ROWS } from "@/lib/moduleSeedData";

export function IntermediaryDirectory() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const [rel, setRel] = useState("All");

  const countries = useMemo(() => {
    const u = new Set(DIRECTORY_ROWS.map((r) => r.country));
    return ["All", ...Array.from(u)];
  }, []);

  const filtered = useMemo(() => {
    return DIRECTORY_ROWS.filter((row) => {
      const matchQ =
        q.trim() === "" ||
        row.org.toLowerCase().includes(q.toLowerCase()) ||
        row.spec.toLowerCase().includes(q.toLowerCase());
      const matchC = country === "All" || row.country === country;
      const matchR = rel === "All" || row.rel === rel;
      return matchQ && matchC && matchR;
    });
  }, [q, country, rel]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intermediary Directory</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Searchable table — expand row detail in a later pass; seeded orgs for
          MVP.
        </p>
      </div>
      <ModuleClaudeRefresh moduleKey="intermediary_directory" country={country} />

      <div className="card flex flex-wrap gap-4 p-5">
        <input
          type="search"
          placeholder="Search name or specialization…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-[200px] flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={rel}
          onChange={(e) => setRel(e.target.value)}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
        >
          <option value="All">All relevance</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-[var(--bg-secondary)]">
            <tr className="text-left text-[var(--text-muted)]">
              <th className="px-4 py-3">Org</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">AUM</th>
              <th className="px-4 py-3">Legal</th>
              <th className="px-4 py-3">Specialization</th>
              <th className="px-4 py-3">RPA relevance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.org}
                className="border-t border-[var(--border)] hover:bg-amber-50/50"
              >
                <td className="px-4 py-3 font-medium">{row.org}</td>
                <td className="px-4 py-3">{row.country}</td>
                <td className="px-4 py-3">{row.aum}</td>
                <td className="px-4 py-3">{row.legal}</td>
                <td className="px-4 py-3">{row.spec}</td>
                <td className="px-4 py-3">{row.rel}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-[var(--text-muted)]">
            No rows match filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
