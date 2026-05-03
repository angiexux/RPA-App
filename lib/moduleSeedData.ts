/** Seeded MVP data for Capital Flow, CSO, USAID, Europe, Funding Gap, DAF, Philanthropy, Peers, Directory, Funders, Climate */

export const CSO_METRICS_BY_COUNTRY: Record<
  string,
  {
    reserveRatio: string;
    concentration: string;
    usaidDependency: string;
    survivalRisk: "Low" | "Medium" | "High" | "Critical";
  }
> = {
  Brazil: {
    reserveRatio: "4.2 mo",
    concentration: "0.38",
    usaidDependency: "12%",
    survivalRisk: "Medium",
  },
  Nigeria: {
    reserveRatio: "2.1 mo",
    concentration: "0.52",
    usaidDependency: "34%",
    survivalRisk: "High",
  },
  Kenya: {
    reserveRatio: "5.0 mo",
    concentration: "0.31",
    usaidDependency: "18%",
    survivalRisk: "Medium",
  },
  Colombia: {
    reserveRatio: "3.6 mo",
    concentration: "0.41",
    usaidDependency: "15%",
    survivalRisk: "Medium",
  },
};

export function getCsoMetrics(country: string) {
  return (
    CSO_METRICS_BY_COUNTRY[country] ?? {
      reserveRatio: "3.2 mo",
      concentration: "0.44",
      usaidDependency: "22%",
      survivalRisk: "Medium" as const,
    }
  );
}

export const CSO_USAID_BAR = [
  { name: "ActionAid Nigeria", pct: 42 },
  { name: "CRS Kenya Chapter", pct: 38 },
  { name: "Plan Intl Ethiopia", pct: 35 },
  { name: "World Vision Uganda", pct: 31 },
  { name: "CARE Ghana Regional", pct: 28 },
  { name: "Oxfam Tanzania", pct: 24 },
  { name: "IRC Rwanda Hub", pct: 22 },
  { name: "Save the Children SA", pct: 19 },
  { name: "Mercy Corps Colombia", pct: 16 },
  { name: "Fundación Carvajal", pct: 14 },
];

export const CSO_SCATTER = [
  { name: "ActionAid Nigeria", concentration: 0.62, reserve: 2.1 },
  { name: "Kenya Community Dev. Foundation", concentration: 0.35, reserve: 5.4 },
  { name: "Instituto Phi Brazil", concentration: 0.48, reserve: 3.2 },
  { name: "Réseau Afrique 2000", concentration: 0.71, reserve: 1.8 },
  { name: "Bridgeway Foundation Kenya", concentration: 0.29, reserve: 6.1 },
  { name: "Fundación Carvajal Colombia", concentration: 0.55, reserve: 2.9 },
];

export const CAPITAL_STACKED = [
  { year: "2021", bilateral: 12, foundation: 28, corporate: 9, domestic: 14 },
  { year: "2022", bilateral: 11, foundation: 30, corporate: 10, domestic: 16 },
  { year: "2023", bilateral: 9, foundation: 29, corporate: 11, domestic: 18 },
  { year: "2024", bilateral: 8, foundation: 31, corporate: 12, domestic: 20 },
  { year: "2025", bilateral: 7, foundation: 32, corporate: 13, domestic: 22 },
];

export type CapitalFunderRow = {
  name: string;
  total: string;
  sector: string;
  trend: string;
  sourceUrl?: string;
};

export const CAPITAL_FUNDERS: CapitalFunderRow[] = [
  {
    name: "Ford Foundation",
    total: "$69.6M",
    sector: "Climate, rights",
    trend: "Stable",
    sourceUrl: "https://www.fordfoundation.org/work/our-grants/grants-database/",
  },
  {
    name: "Gates Foundation",
    total: "$54.2M",
    sector: "Health",
    trend: "Up",
    sourceUrl: "https://www.gatesfoundation.org/about/committed-grants",
  },
  {
    name: "Open Society",
    total: "$31.0M",
    sector: "Governance",
    trend: "Down",
    sourceUrl: "https://www.opensocietyfoundations.org/grants",
  },
];

export const CAPITAL_SECTORS = [
  { name: "Health", value: 32 },
  { name: "Climate", value: 24 },
  { name: "Education", value: 18 },
  { name: "Rights", value: 16 },
  { name: "Other", value: 10 },
];

export const USAID_ROWS = [
  { country: "Brazil", gap: 210, pctFilled: 22, pivot: "Domestic + foundation co-funding", sectors: "Amazon, health" },
  { country: "Nigeria", gap: 185, pctFilled: 18, pivot: "Regional pooled funds", sectors: "Health, livelihoods" },
  { country: "Kenya", gap: 92, pctFilled: 31, pivot: "Bilateral substitution", sectors: "Health, governance" },
  { country: "Colombia", gap: 78, pctFilled: 28, pivot: "Climate blended finance", sectors: "Peace, climate" },
  { country: "South Africa", gap: 71, pctFilled: 35, pivot: "Corporate philanthropy", sectors: "Health, education" },
  { country: "Ethiopia", gap: 64, pctFilled: 15, pivot: "Humanitarian carve-outs", sectors: "Food, WASH" },
  { country: "Ukraine", gap: 120, pctFilled: 40, pivot: "European bilaterals", sectors: "Recovery" },
  { country: "Bangladesh", gap: 55, pctFilled: 25, pivot: "MDB + NGO consortia", sectors: "Climate, migration" },
  { country: "Guatemala", gap: 48, pctFilled: 20, pivot: "Regional intermediaries", sectors: "Migration, rights" },
  { country: "Jordan", gap: 42, pctFilled: 33, pivot: "Refugee multi-donor funds", sectors: "Livelihoods" },
  { country: "Lebanon", gap: 38, pctFilled: 17, pivot: "Cash + local NGOs", sectors: "Basic needs" },
  { country: "Honduras", gap: 35, pctFilled: 21, pivot: "US foundation backfill", sectors: "Governance" },
  { country: "Mozambique", gap: 44, pctFilled: 14, pivot: "Climate resilience pools", sectors: "Agriculture" },
  { country: "Philippines", gap: 51, pctFilled: 27, pivot: "Disaster + dev blended", sectors: "DRR, health" },
  { country: "Tanzania", gap: 46, pctFilled: 19, pivot: "Sector baskets", sectors: "Conservation, health" },
];

export const EUROPE_DONORS = [
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    cut: "$1.8B",
    pct: 28,
    sectors: "Gender, governance",
    csos: "420+",
  },
  {
    flag: "🇩🇪",
    name: "Germany",
    cut: "$2.1B",
    pct: 22,
    sectors: "Climate, migration",
    csos: "510+",
  },
  {
    flag: "🇫🇷",
    name: "France",
    cut: "$950M",
    pct: 18,
    sectors: "Education, Sahel",
    csos: "280+",
  },
  {
    flag: "🇳🇱",
    name: "Netherlands",
    cut: "$720M",
    pct: 24,
    sectors: "SRHR, agriculture",
    csos: "190+",
  },
];

export const EUROPE_IMPACT = [
  { donor: "UK", exposed: "Kenya, Nigeria, Bangladesh" },
  { donor: "Germany", exposed: "Mozambique, Ukraine, Jordan" },
  { donor: "France", exposed: "Senegal, Côte d'Ivoire, Lebanon" },
  { donor: "NL", exposed: "Ethiopia, Uganda, Colombia" },
];

export const FUNDING_GAP_LINES = [
  { year: "2021", international: 100, domestic: 42 },
  { year: "2022", international: 94, domestic: 45 },
  { year: "2023", international: 88, domestic: 49 },
  { year: "2024", international: 81, domestic: 54 },
  { year: "2025", international: 76, domestic: 58 },
];

export const FUNDING_SECTOR_GAP = [
  {
    sector: "Health",
    intl: -14,
    domestic: 8,
    net: -6,
    severity: "High",
  },
  {
    sector: "Climate",
    intl: -11,
    domestic: 6,
    net: -5,
    severity: "High",
  },
  {
    sector: "Governance",
    intl: -9,
    domestic: 4,
    net: -5,
    severity: "Medium",
  },
  {
    sector: "Education",
    intl: -7,
    domestic: 5,
    net: -2,
    severity: "Medium",
  },
];

export const DAF_PROVIDERS = [
  {
    name: "CAF America",
    aum: "$4.2B",
    brazil: "Active grant routes",
    nigeria: "Select programs",
    score: 4,
    notes: "Strong compliance stack; case-by-case Nigeria due diligence.",
  },
  {
    name: "GlobalGiving",
    aum: "$600M+",
    brazil: "Crowdfunded + corporate",
    nigeria: "Partner-led",
    score: 4,
    notes: "Flexible but smaller average grant size.",
  },
  {
    name: "Fidelity Charitable",
    aum: "$50B+ DAF",
    brazil: "Limited direct",
    nigeria: "Very limited",
    score: 2,
    notes: "Primarily US-facing; cross-border via intermediaries.",
  },
];

export const PHILANTHROPY_BY_COUNTRY: Record<
  string,
  { corporate: string; individual: string; endowment: string }
> = {
  Brazil: { corporate: "$2.1B", individual: "$890M", endowment: "$1.4B" },
  Nigeria: { corporate: "$420M", individual: "$210M", endowment: "$180M" },
  Kenya: { corporate: "$680M", individual: "$340M", endowment: "$290M" },
  Colombia: { corporate: "$590M", individual: "$260M", endowment: "$310M" },
};

export function getPhilanthropyMetrics(country: string) {
  return (
    PHILANTHROPY_BY_COUNTRY[country] ?? {
      corporate: "$510M",
      individual: "$220M",
      endowment: "$240M",
    }
  );
}

export const PHILANTHROPY_TREND = [
  { y: "2021", v: 100 },
  { y: "2022", v: 104 },
  { y: "2023", v: 109 },
  { y: "2024", v: 115 },
  { y: "2025", v: 121 },
];

export const PEER_ORGS = [
  {
    org: "CAF America",
    aum: "$4.2B",
    countries: "90+",
    services: "Cross-border grantmaking",
    fees: "5–9%",
    overlap: "High",
  },
  {
    org: "GiveIndia",
    aum: "$800M+",
    countries: "1 (India focus)",
    services: "Domestic giving tech",
    fees: "0–5%",
    overlap: "Low",
  },
  {
    org: "BrazilFoundation",
    aum: "$120M+",
    countries: "Brazil",
    services: "Local fiscal + programs",
    fees: "Varies",
    overlap: "Medium",
  },
  {
    org: "RPA",
    aum: "$500M+ flows",
    countries: "70+",
    services: "Fiscal sponsorship",
    fees: "Custom",
    overlap: "Anchor",
  },
];

export const PEER_RADAR = [
  { subject: "Footprint", caf: 95, rpa: 88, giveIndia: 42, brFdn: 72 },
  { subject: "Compliance", caf: 90, rpa: 85, giveIndia: 68, brFdn: 78 },
  { subject: "Tech", caf: 72, rpa: 65, giveIndia: 92, brFdn: 58 },
  { subject: "Brand", caf: 88, rpa: 70, giveIndia: 55, brFdn: 68 },
  { subject: "Fees", caf: 48, rpa: 60, giveIndia: 88, brFdn: 75 },
];

export const DIRECTORY_ROWS = [
  {
    org: "Instituto Phi",
    country: "Brazil",
    aum: "$45M",
    legal: "Associação",
    spec: "Education, youth",
    rel: "High",
  },
  {
    org: "Africa Philanthropy Forum",
    country: "Nigeria",
    aum: "N/A",
    legal: "Trust",
    spec: "Network",
    rel: "Medium",
  },
  {
    org: "Kenya Community Development Foundation",
    country: "Kenya",
    aum: "$28M",
    legal: "Trust",
    spec: "Community grants",
    rel: "High",
  },
  {
    org: "Corporación Opinión Pública",
    country: "Colombia",
    aum: "$12M",
    legal: "NGO",
    spec: "Governance",
    rel: "Medium",
  },
];

export const MAJOR_FUNDERS = [
  {
    name: "Gates Foundation",
    globalSouth: "$2.8B",
    brazil: "$120M",
    nigeria: "$95M",
    backfill: "Neutral",
  },
  {
    name: "Ford Foundation",
    globalSouth: "$1.9B",
    brazil: "$180M",
    nigeria: "$70M",
    backfill: "Actively Filling",
  },
  {
    name: "MacArthur",
    globalSouth: "$420M",
    brazil: "$35M",
    nigeria: "$28M",
    backfill: "Actively Filling",
  },
  {
    name: "Bezos Earth Fund",
    globalSouth: "$650M",
    brazil: "$210M",
    nigeria: "$15M",
    backfill: "Neutral",
  },
  {
    name: "Wellcome",
    globalSouth: "$1.1B",
    brazil: "$40M",
    nigeria: "$55M",
    backfill: "Reducing",
  },
];

export const FUNDER_TREND = [
  { y: "2021", Gates: 100, Ford: 100, Mac: 100 },
  { y: "2022", Gates: 102, Ford: 105, Mac: 98 },
  { y: "2023", Gates: 99, Ford: 108, Mac: 101 },
  { y: "2024", Gates: 97, Ford: 110, Mac: 104 },
  { y: "2025", Gates: 95, Ford: 112, Mac: 106 },
];

export const CLIMATE_DEALS = [
  {
    funder: "ClimateWorks",
    country: "Brazil",
    intermediary: "Instituto A",
    commitment: "$18M",
    sector: "Land use",
    status: "Active",
    date: "2025-11",
  },
  {
    funder: "CLUA",
    country: "Colombia",
    intermediary: "Regional pooled",
    commitment: "$9M",
    sector: "Energy",
    status: "Closing",
    date: "2025-09",
  },
  {
    funder: "Bezos Earth Fund",
    country: "Kenya",
    intermediary: "GlobalGiving",
    commitment: "$22M",
    sector: "Clean cooking",
    status: "Active",
    date: "2026-01",
  },
  {
    funder: "ClimateWorks",
    country: "Nigeria",
    intermediary: "Local NGO fiscal host",
    commitment: "$6M",
    sector: "Adaptation",
    status: "Pipeline",
    date: "2026-02",
  },
];

/** Social-sector deals (parallel to Climate Pipeline). */
export const SOCIAL_DEALS = [
  {
    funder: "MacArthur",
    country: "Brazil",
    intermediary: "Instituto social A",
    commitment: "$4.2M",
    sector: "Justice",
    status: "Active",
    date: "2025-10",
  },
  {
    funder: "Ford Foundation",
    country: "Nigeria",
    intermediary: "National NGO host",
    commitment: "$3.1M",
    sector: "Gender",
    status: "Active",
    date: "2025-12",
  },
  {
    funder: "Open Society",
    country: "Kenya",
    intermediary: "Regional pooled",
    commitment: "$2.4M",
    sector: "Governance",
    status: "Closing",
    date: "2026-01",
  },
  {
    funder: "Mastercard Foundation",
    country: "Colombia",
    intermediary: "Youth consortium",
    commitment: "$5.5M",
    sector: "Livelihoods",
    status: "Pipeline",
    date: "2026-02",
  },
  {
    funder: "Wellcome",
    country: "Brazil",
    intermediary: "Health fiscal host",
    commitment: "$7.8M",
    sector: "Public health",
    status: "Active",
    date: "2025-11",
  },
];
