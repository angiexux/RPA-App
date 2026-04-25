import { getCountryAnalysis } from "@/lib/mockData";
import {
  type ExpansionModelColumn,
  type ModelColumnRegulatoryDetail,
  type RegulatoryCountryProfile,
  type RegulatoryRiskItem,
  type RegulatoryTimelineEvent,
  type RiskLevel,
} from "@/lib/types";
import { recommendModel } from "@/lib/scoring";

function riskLevelFromPolicy(policy: number): RiskLevel {
  if (policy >= 4) return "Low";
  if (policy >= 3) return "Medium";
  if (policy >= 2) return "High";
  return "Critical";
}

function pickHighestRegulatoryFit(
  cols: Record<ExpansionModelColumn, ModelColumnRegulatoryDetail>,
): ExpansionModelColumn {
  const order: ExpansionModelColumn[] = [
    "Local Partner",
    "Hybrid",
    "New Build",
  ];
  let best: ExpansionModelColumn = "Hybrid";
  let bestScore = -1;

  order.forEach((key) => {
    const score = cols[key].regulatoryFit;
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  });

  return best;
}

function baseColumnDetail(
  model: ExpansionModelColumn,
  country: string,
): ModelColumnRegulatoryDetail {
  const shared = {
    "New Build": {
      regulatoryFit: 2.5,
      executionRisk: 4,
      estimatedCostRange: "$2.5M–$6M (legal, licensing, staffing)",
      timelineOperational: "18–36 months",
      keyRegulatoryRisk:
        "Greenfield registration and ongoing compliance without local sponsor cover",
      rpaComplianceIntensity: "Very high — full ownership of filings and audits",
      bestFitProfile:
        "Markets with enabling law but thin intermediary bench where RPA must own the stack",
      examplePrecedent:
        "Rare; most Global South entries pair with an existing fiscal host first",
    },
    Hybrid: {
      regulatoryFit: 3.5,
      executionRisk: 3,
      estimatedCostRange: "$800K–$2.5M (joint ops + compliance layer)",
      timelineOperational: "9–18 months",
      keyRegulatoryRisk:
        "Dual reporting lines if sponsor and RPA processes diverge",
      rpaComplianceIntensity: "High — shared control with local sponsor",
      bestFitProfile:
        "Moderate policy friction with credible local partners and partial infrastructure",
      examplePrecedent:
        "Common pattern for first fiscal expansion in middle-income markets",
    },
    "Local Partner": {
      regulatoryFit: 4.2,
      executionRisk: 2.2,
      estimatedCostRange: "$400K–$1.2M (partner diligence + integration)",
      timelineOperational: "6–12 months",
      keyRegulatoryRisk:
        "Partner governance gaps or sudden policy shifts affecting sponsor status",
      rpaComplianceIntensity: "Moderate — reliance on partner systems with oversight",
      bestFitProfile:
        "Enabling policy, mature fiscal sponsors, and strong professional services",
      examplePrecedent:
        "Typical for Brazil-style markets with established fiscal intermediaries",
    },
  } satisfies Record<ExpansionModelColumn, Omit<ModelColumnRegulatoryDetail, never>>;

  const row = shared[model];
  return {
    ...row,
    regulatoryFit: row.regulatoryFit + (country.length % 3) * 0.1,
    executionRisk: Math.min(
      5,
      Math.max(1, row.executionRisk + (country.length % 2) * 0.2),
    ),
  };
}

function tweakColumnsForPolicy(
  policyScore: number,
  columns: Record<ExpansionModelColumn, ModelColumnRegulatoryDetail>,
): Record<ExpansionModelColumn, ModelColumnRegulatoryDetail> {
  const penalty = policyScore < 2.5 ? 1.2 : policyScore < 3 ? 0.6 : 0;
  const next = { ...columns };
  (Object.keys(next) as ExpansionModelColumn[]).forEach((key) => {
    const cell = { ...next[key] };
    cell.regulatoryFit = Math.max(
      1,
      Math.min(5, cell.regulatoryFit - penalty + (policyScore - 3) * 0.15),
    );
    cell.executionRisk = Math.max(
      1,
      Math.min(5, cell.executionRisk + penalty * 0.4),
    );
    next[key] = cell;
  });
  return next;
}

const DETAIL: Partial<
  Record<
    string,
    {
      posture: string;
      threats: RegulatoryRiskItem[];
      governmentPosture: RegulatoryRiskItem[];
      recentChanges: RegulatoryRiskItem[];
      timeline: RegulatoryTimelineEvent[];
    }
  >
> = {
  Brazil: {
    posture:
      "Federal enabling environment for philanthropy with active subnational tax variation (ITCMD) and periodic NGO oversight updates.",
    threats: [
      {
        title: "Subnational ITCMD and donation tax treatment",
        summary:
          "States continue to interpret donation exemptions differently; cross-border flows require state-level diligence beyond federal registration.",
        date: "2026-01-12",
        severity: "High",
      },
      {
        title: "AML / banking scrutiny on international transfers",
        summary:
          "Banks apply enhanced due diligence for nonprofit inbound flows; settlement timelines can slip without pre-cleared documentation.",
        date: "2025-11-03",
        severity: "Medium",
      },
      {
        title: "Civil society advocacy friction",
        summary:
          "Select advocacy-adjacent funding faces reputational and compliance review in polarized political cycles.",
        date: "2025-09-18",
        severity: "Medium",
      },
    ],
    governmentPosture: [
      {
        title: "Generally permissive federal framework",
        summary:
          "Philanthropic vehicles exist, but operational reality is shaped by tax administration and banking practice as much as statute.",
        date: "2026-02-01",
        severity: "Low",
      },
      {
        title: "Coordination across ministries",
        summary:
          "Multiple agencies touch nonprofit and financial flows; sponsors must maintain disciplined documentation across channels.",
        date: "2025-10-22",
        severity: "Medium",
      },
    ],
    recentChanges: [
      {
        title: "ITCMD reform debate post-2026 window",
        summary:
          "Expect continued adjustments to exemption tests; treat state tables as live data rather than static reference.",
        date: "2026-03-05",
        severity: "High",
      },
      {
        title: "Reporting modernization for larger NGOs",
        summary:
          "Incremental pushes toward digital filings increase compliance surface area for cross-border intermediaries.",
        date: "2025-12-14",
        severity: "Medium",
      },
    ],
    timeline: [
      { date: "2026-03", label: "ITCMD reform signals and state updates", severity: "High" },
      { date: "2026-01", label: "Banking KYC tightening for nonprofit accounts", severity: "Medium" },
      { date: "2025-11", label: "Federal NGO reporting clarification round", severity: "Low" },
      { date: "2025-08", label: "Philanthropy coalition commentary on cross-border rules", severity: "Medium" },
    ],
  },
  Nigeria: {
    posture:
      "Foreign funding is workable but compliance-heavy; SCUML, CAC, and FX channels create multi-step clearance for inbound grants.",
    threats: [
      {
        title: "SCUML / AML reporting load",
        summary:
          "Registration and ongoing reporting requirements can bottleneck first inbound transfers without experienced local counsel.",
        date: "2026-02-08",
        severity: "High",
      },
      {
        title: "FX liquidity and banking rails",
        summary:
          "Grant settlement timing depends on bank appetite and documentation quality; delays cascade to grantee cash flow.",
        date: "2025-12-01",
        severity: "High",
      },
      {
        title: "Civic space monitoring",
        summary:
          "Operational sensitivity remains elevated for advocacy-linked portfolios; scenario planning is part of compliance, not only comms.",
        date: "2025-09-30",
        severity: "Medium",
      },
    ],
    governmentPosture: [
      {
        title: "Technically enabling with heavy paperwork",
        summary:
          "Law allows foreign philanthropy, but execution depends on disciplined multi-agency sequencing and local partner quality.",
        date: "2026-01-15",
        severity: "Medium",
      },
    ],
    recentChanges: [
      {
        title: "Reporting cadence adjustments",
        summary:
          "Expect iterative regulatory housekeeping; treat compliance calendars as quarterly-reviewed artifacts.",
        date: "2025-11-20",
        severity: "Medium",
      },
      {
        title: "Bank onboarding requirements",
        summary:
          "Institutions tightened nonprofit KYC packs; sponsor letters and source-of-funds narratives must be investor-grade.",
        date: "2025-10-05",
        severity: "High",
      },
    ],
    timeline: [
      { date: "2026-02", label: "SCUML reporting window + sponsor alignment", severity: "High" },
      { date: "2025-12", label: "FX channel stress for grant settlement", severity: "Critical" },
      { date: "2025-09", label: "CAC / governance housekeeping wave", severity: "Medium" },
      { date: "2025-06", label: "International NGO policy commentary cycle", severity: "Medium" },
    ],
  },
  Kenya: {
    posture:
      "East Africa hub with active NGO sector; regulatory practice emphasizes registration discipline and banking partner quality.",
    threats: [
      {
        title: "NGO regulatory filings and board governance",
        summary:
          "Mid-size organizations face periodic compliance reviews; cross-border sponsors should align reporting calendars early.",
        date: "2026-01-20",
        severity: "Medium",
      },
      {
        title: "Election-cycle sensitivity",
        summary:
          "Civic space narratives can tighten around polls; scenario planning belongs in compliance, not only communications.",
        date: "2025-10-12",
        severity: "Medium",
      },
      {
        title: "Bank partner rotation",
        summary:
          "Correspondent banking changes can disrupt settlement paths; maintain alternate rails for grant disbursement.",
        date: "2025-08-30",
        severity: "Low",
      },
    ],
    governmentPosture: [
      {
        title: "Generally workable with strong partners",
        summary:
          "Kenya rewards organizations that invest in local governance, audit readiness, and transparent grant ledgers.",
        date: "2026-02-02",
        severity: "Low",
      },
    ],
    recentChanges: [
      {
        title: "Digital reporting pilots",
        summary:
          "Incremental moves toward online filings reduce paper burden but increase data hygiene expectations.",
        date: "2025-11-08",
        severity: "Low",
      },
    ],
    timeline: [
      { date: "2026-04", label: "Compliance calendar + sponsor QA", severity: "Medium" },
      { date: "2026-01", label: "Banking partner KYC refresh", severity: "Medium" },
      { date: "2025-09", label: "Sector coalition policy notes", severity: "Low" },
      { date: "2025-05", label: "Cross-border grant desk review", severity: "Low" },
    ],
  },
  Colombia: {
    posture:
      "Latin American market with established nonprofit ecosystem; regulatory attention focuses on cross-border flows and conflict-sensitive geographies.",
    threats: [
      {
        title: "Subnational implementation variance",
        summary:
          "Federal rules interact with local administration; grant routes should be validated with regional counsel.",
        date: "2026-02-14",
        severity: "Medium",
      },
      {
        title: "AML monitoring on international transfers",
        summary:
          "Banks may request enhanced documentation for first-time nonprofit counterparties.",
        date: "2025-12-03",
        severity: "Medium",
      },
      {
        title: "Program geography sensitivity",
        summary:
          "Certain geographies carry elevated diligence expectations for funders; map exposure during design.",
        date: "2025-09-09",
        severity: "High",
      },
    ],
    governmentPosture: [
      {
        title: "Moderately enabling with mature legal market",
        summary:
          "Colombia offers strong professional services; the constraint is operational risk management rather than permissioning alone.",
        date: "2026-01-28",
        severity: "Low",
      },
    ],
    recentChanges: [
      {
        title: "Philanthropy coalition commentary",
        summary:
          "Sector groups continue to publish interpretation notes on cross-border grant mechanics.",
        date: "2025-11-30",
        severity: "Low",
      },
    ],
    timeline: [
      { date: "2026-03", label: "Regional counsel review checkpoint", severity: "Medium" },
      { date: "2025-12", label: "Banking documentation pack update", severity: "Medium" },
      { date: "2025-08", label: "Cross-border desk guidance", severity: "Low" },
      { date: "2025-05", label: "INGO policy forum cycle", severity: "Low" },
    ],
  },
};

function defaultNarrativeBlocks(
  country: string,
  policyScore: number,
): {
  posture: string;
  threats: RegulatoryRiskItem[];
  governmentPosture: RegulatoryRiskItem[];
  recentChanges: RegulatoryRiskItem[];
  timeline: RegulatoryTimelineEvent[];
} {
  const level = riskLevelFromPolicy(policyScore);
  return {
    posture: `${country}'s regulatory posture is assessed as ${level.toLowerCase()} based on the policy pillar score (${policyScore.toFixed(1)}/5). Use the three-column model comparison below before committing capital.`,
    threats: [
      {
        title: "Compliance burden and documentation depth",
        summary: `In ${country}, inbound philanthropic flows typically require disciplined sponsor coordination and bank-ready evidence packs.`,
        date: "2026-01-10",
        severity: policyScore < 2.5 ? "High" : "Medium",
      },
      {
        title: "Policy implementation variance",
        summary:
          "Formal rules may diverge from operational practice; local counsel and sponsor QA remain mandatory.",
        date: "2025-11-18",
        severity: "Medium",
      },
      {
        title: "Reputational sensitivity for advocacy portfolios",
        summary:
          "Even where legal, certain issue areas attract scrutiny; map scenarios before public positioning.",
        date: "2025-09-22",
        severity: "Low",
      },
    ],
    governmentPosture: [
      {
        title: "Overall government stance toward foreign philanthropy",
        summary: `Signals are mixed: ${country} may be workable with partners, but treat registration and reporting as living processes.`,
        date: "2026-02-01",
        severity: "Medium",
      },
    ],
    recentChanges: [
      {
        title: "Incremental regulatory housekeeping",
        summary:
          "Expect periodic reporting tweaks rather than single ‘big bang’ reforms; monitor sponsor bulletins and banking guidance.",
        date: "2025-12-12",
        severity: "Medium",
      },
    ],
    timeline: [
      { date: "2026-03", label: "Quarterly compliance review checkpoint", severity: "Medium" },
      { date: "2026-01", label: "Banking partner renewal / KYC refresh", severity: "Medium" },
      { date: "2025-10", label: "Sponsor governance and board approvals", severity: "Low" },
      { date: "2025-07", label: "Policy commentary + sector coalition updates", severity: "Low" },
    ],
  };
}

export function getRegulatoryProfile(country: string): RegulatoryCountryProfile | null {
  const analysis = getCountryAnalysis(country);
  if (!analysis) {
    return null;
  }

  const model = recommendModel(analysis.composite);
  const policyScore = analysis.policy.score;

  const detail = DETAIL[country] ?? defaultNarrativeBlocks(country, policyScore);

  const columns: Record<ExpansionModelColumn, ModelColumnRegulatoryDetail> = {
    "New Build": baseColumnDetail("New Build", country),
    Hybrid: baseColumnDetail("Hybrid", country),
    "Local Partner": baseColumnDetail("Local Partner", country),
  };

  const tuned = tweakColumnsForPolicy(policyScore, columns);
  const recommendedColumn = pickHighestRegulatoryFit(tuned);

  return {
    country,
    riskLevel: riskLevelFromPolicy(policyScore),
    governmentPostureSummary: detail.posture,
    recommendedExpansionModel: recommendedColumn,
    prematureNote:
      model === "Premature"
        ? "Composite score is below the expansion threshold. The three columns still frame trade-offs for a defensive or staged mandate, but default posture should be pause or partner-led discovery."
        : undefined,
    modelColumns: tuned,
    activeThreats: detail.threats,
    governmentPosture: detail.governmentPosture,
    recentChanges: detail.recentChanges,
    timeline12m: detail.timeline,
  };
}
