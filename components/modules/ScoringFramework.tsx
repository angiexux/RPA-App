"use client";

const PILLARS = [
  {
    num: 1,
    name: "Policy Environment",
    indicators: "Ease of nonprofit registration, foreign funding restrictions, tax incentives, compliance burden",
    weight: "25%",
    criteria: "1 = Highly restrictive → 5 = Highly enabling",
  },
  {
    num: 2,
    name: "Capital Flow Maturity",
    indicators: "Volume of international giving, diversity of sources, intermediary adoption, cross-border mechanisms",
    weight: "30%",
    criteria: "1 = Nascent/fragmented → 5 = Mature/diverse",
  },
  {
    num: 3,
    name: "Financial & Technical Infrastructure",
    indicators: "Existing fiscal sponsors, re-granting capacity, back-office providers, legal expertise",
    weight: "25%",
    criteria: "1 = Minimal capacity → 5 = Well-established",
  },
  {
    num: 4,
    name: "Talent & Ecosystem",
    indicators: "Availability of professionals, philanthropic associations, knowledge infrastructure, governance",
    weight: "20%",
    criteria: "1 = Severe gaps → 5 = Deep talent pool",
  },
];

const FEATURES = [
  {
    title: "Systematic",
    desc: "Removes subjective bias",
  },
  {
    title: "Comparable",
    desc: "Apples-to-apples across countries",
  },
  {
    title: "Adaptable",
    desc: "Applicable to Kenya, India, Mexico, etc.",
  },
  {
    title: "Living Tool",
    desc: "Scores update as ecosystems evolve",
  },
];

export function ScoringFramework() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)] mb-2">
          Scoring System
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Feasibility &amp; Impact Scoring Framework
        </h1>
        <p className="max-w-3xl text-sm text-[var(--text-muted)] leading-relaxed">
          We developed a <strong>15-indicator scoring system</strong> to systematically assess fiscal
          intermediary viability. Each indicator is scored 1–5 based on desk research,
          policy analysis, and stakeholder validation.
        </p>
      </div>

      {/* Scoring Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-4 text-left font-semibold w-[22%]">Pillar</th>
              <th className="px-6 py-4 text-left font-semibold w-[38%]">Indicators (examples)</th>
              <th className="px-6 py-4 text-left font-semibold w-[10%]">Weight</th>
              <th className="px-6 py-4 text-left font-semibold w-[30%]">Scoring Criteria</th>
            </tr>
          </thead>
          <tbody>
            {PILLARS.map((pillar, i) => (
              <tr
                key={pillar.num}
                className={`border-b border-[var(--border)] ${i % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
              >
                <td className="px-6 py-5 align-top">
                  <span className="font-semibold text-[var(--accent-gold)]">
                    {pillar.num}. {pillar.name}
                  </span>
                </td>
                <td className="px-6 py-5 align-top text-[var(--text-muted)] leading-relaxed">
                  {pillar.indicators}
                </td>
                <td className="px-6 py-5 align-top font-bold text-slate-900">
                  {pillar.weight}
                </td>
                <td className="px-6 py-5 align-top text-[var(--text-muted)] leading-relaxed">
                  {pillar.criteria}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="card p-5 bg-slate-50 border border-slate-200"
          >
            <p className="font-bold text-slate-900 mb-1">{f.title}</p>
            <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Methodology note */}
      <div className="card p-5 border-l-4 border-[var(--accent-gold)]">
        <p className="font-semibold text-[var(--text-primary)] mb-2">How scores are derived</p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Each of the four pillars is assessed across multiple indicators sourced from the Global
          Philanthropy Environment Index (GPEI), OECD Private Philanthropy for Development,
          CAF World Giving Index, CIVICUS Monitor, World Bank Doing Business indicators,
          and Candid philanthropic databases. Pillar scores are aggregated into a composite
          using the weighted formula above. Scores are directional — not precise rankings —
          and should inform initial market triage ahead of deeper due diligence.
        </p>
      </div>
    </div>
  );
}
