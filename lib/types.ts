export type ModelRecommendation =
  | "Local Partner"
  | "Hybrid"
  | "New Build"
  | "Premature";

export type PillarKey = "policy" | "capital" | "infrastructure" | "talent";

export interface PillarScore {
  score: number;
  justification: string;
}

export interface CountryAnalysis {
  country: string;
  continent: "Sub-Saharan Africa" | "Latin America";
  policy: PillarScore;
  capital: PillarScore;
  infrastructure: PillarScore;
  talent: PillarScore;
  composite: number;
  model: ModelRecommendation;
  fetchedAt: string;
  stats: Array<{ label: string; value: string }>;
  narrative: string[];
}

export interface FeedItem {
  title: string;
  summary: string;
  tag: "Policy" | "Capital Flows" | "Infrastructure" | "Risk";
  source: string;
  sourceUrl?: string;
  date: string;
}

export interface NavItem {
  label: string;
  href?: string;
  items?: NavItem[];
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type ExpansionModelColumn = "New Build" | "Hybrid" | "Local Partner";

export interface RegulatoryRiskItem {
  title: string;
  summary: string;
  date: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface RegulatoryTimelineEvent {
  date: string;
  label: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface ModelColumnRegulatoryDetail {
  regulatoryFit: number;
  executionRisk: number;
  estimatedCostRange: string;
  timelineOperational: string;
  keyRegulatoryRisk: string;
  rpaComplianceIntensity: string;
  bestFitProfile: string;
  examplePrecedent: string;
}

export interface RegulatoryCountryProfile {
  country: string;
  riskLevel: RiskLevel;
  governmentPostureSummary: string;
  recommendedExpansionModel: ExpansionModelColumn;
  prematureNote?: string;
  modelColumns: Record<ExpansionModelColumn, ModelColumnRegulatoryDetail>;
  activeThreats: RegulatoryRiskItem[];
  governmentPosture: RegulatoryRiskItem[];
  recentChanges: RegulatoryRiskItem[];
  timeline12m: RegulatoryTimelineEvent[];
}
