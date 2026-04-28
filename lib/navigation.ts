import { NavSection } from "@/lib/types";

export const navigation: NavSection[] = [
  {
    heading: "Core Market Intelligence",
    items: [
      { label: "Expansion Screener", href: "/expansion-screener" },
      { label: "Feasibility Scorecard", href: "/feasibility-scorecard" },
      { label: "Model Matrix", href: "/model-matrix" },
    ],
  },
  {
    heading: "Policy",
    items: [
      { label: "Regulatory Risk Monitor", href: "/regulatory-risk" },
      { label: "Intelligence Feed", href: "/intelligence-feed" },
      { label: "CSO Health Monitor", href: "/cso-health" },
    ],
  },
  {
    heading: "Capital Flow",
    items: [
      { label: "Capital Flow Tracker", href: "/capital-flow" },
      { label: "USAID Withdrawal Map", href: "/usaid-withdrawal" },
      { label: "European Bilateral Cuts", href: "/european-cuts" },
      { label: "Funding Gap Dashboard", href: "/funding-gap" },
    ],
  },
  {
    heading: "Infrastructure",
    items: [
      { label: "DAF Cross-Border Monitor", href: "/daf-monitor" },
      { label: "Philanthropy Index", href: "/philanthropy-index" },
    ],
  },
  {
    heading: "Talent",
    items: [
      {
        label: "Competition: Donor & Funder Intelligence",
        items: [
          { label: "Major Funder Tracker", href: "/major-funder-tracker" },
          { label: "Climate Pipeline", href: "/climate-pipeline" },
          { label: "Social Pipeline", href: "/social-pipeline" },
        ],
      },
    ],
  },
  {
    heading: "Portfolio & Operations (Pilot)",
    items: [
      { label: "Project Risk Dashboard", href: "/project-risk" },
      { label: "Pilot ROI Tracker", href: "/pilot-roi" },
    ],
  },
  {
    heading: "Settings",
    items: [
      { label: "Source Settings", href: "/settings" },
    ],
  },
];

export const routeTitles: Record<string, string> = {
  "expansion-screener": "Expansion Screener",
  "feasibility-scorecard": "Feasibility Scorecard",
  "model-matrix": "Model Matrix",
  "regulatory-risk": "Regulatory Risk Monitor",
  "intelligence-feed": "Intelligence Feed",
  "cso-health": "CSO Health Monitor",
  "capital-flow": "Capital Flow Tracker",
  "usaid-withdrawal": "USAID Withdrawal Map",
  "european-cuts": "European Bilateral Cuts",
  "funding-gap": "Funding Gap Dashboard",
  "daf-monitor": "DAF Cross-Border Monitor",
  "philanthropy-index": "Philanthropy Index",
  "major-funder-tracker": "Major Funder Tracker",
  "climate-pipeline": "Climate Pipeline",
  "social-pipeline": "Social Pipeline",
  "project-risk": "Project Risk Dashboard",
  "pilot-roi": "Pilot ROI Tracker",
  "settings": "Source Settings",
};
