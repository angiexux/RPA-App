import type { FeedItem } from "@/lib/types";

const SEEDED: Record<string, FeedItem[]> = {
  Brazil: [
    {
      title: "State-level ITCMD positions shift ahead of federal guidance",
      summary:
        "Several states signaled updated donation tax interpretations; fiscal sponsors are advising grantmakers to reconfirm exemption tests before Q3 disbursements.",
      tag: "Policy",
      source: "Brazil Philanthropy Forum",
      sourceUrl: "https://www.abcr.org.br/",
      date: "2026-03-12",
    },
    {
      title: "Major banks tighten nonprofit onboarding packs",
      summary:
        "Institutions requested stronger source-of-funds narratives for inbound international grants, extending settlement timelines for first-time counterparties.",
      tag: "Risk",
      source: "CIVICUS Monitor — Brazil",
      sourceUrl: "https://monitor.civicus.org/country/brazil/",
      date: "2026-02-28",
    },
    {
      title: "Climate and Amazon portfolios attract blended finance interest",
      summary:
        "Corporate and foundation co-investment vehicles continued to route through established fiscal hosts with mature compliance stacks.",
      tag: "Capital Flows",
      source: "OECD Private Philanthropy for Development",
      sourceUrl: "https://www.oecd.org/development/private-philanthropy-for-development.htm",
      date: "2026-02-14",
    },
    {
      title: "Fiscal intermediary capacity remains concentrated in hubs",
      summary:
        "Full-service sponsor coverage is strong in major metros but thinner for remote grantee portfolios without travel budgets.",
      tag: "Infrastructure",
      source: "Candid — Fiscal Sponsorship Landscape",
      sourceUrl: "https://candid.org/explore-issues/fiscal-sponsorship",
      date: "2026-01-30",
    },
    {
      title: "Advocacy-adjacent funding under reputational review",
      summary:
        "Some portfolios with civic engagement themes faced additional diligence cycles tied to election-year sensitivity.",
      tag: "Risk",
      source: "CIVICUS State of Civil Society Report",
      sourceUrl: "https://www.civicus.org/index.php/state-of-civil-society-report-2023",
      date: "2026-01-08",
    },
  ],
  Nigeria: [
    {
      title: "SCUML reporting window drives sponsor coordination",
      summary:
        "Intermediaries batch compliance updates ahead of annual cycles; delays ripple to first-time international grant routes.",
      tag: "Policy",
      source: "SCUML — Special Control Unit Against Money Laundering",
      sourceUrl: "https://www.scuml.gov.ng/",
      date: "2026-03-05",
    },
    {
      title: "FX liquidity stress shows up in grant settlement timing",
      summary:
        "Grantees report longer gaps between approval and cash in bank, elevating cash-flow risk for smaller organizations.",
      tag: "Capital Flows",
      source: "CBN — Central Bank of Nigeria Reports",
      sourceUrl: "https://www.cbn.gov.ng/documents/annualreport.asp",
      date: "2026-02-22",
    },
    {
      title: "CAC governance housekeeping wave",
      summary:
        "Board documentation and annual filings are under sharper review; sponsors are pre-clearing governance packets.",
      tag: "Infrastructure",
      source: "CAC — Corporate Affairs Commission Nigeria",
      sourceUrl: "https://www.cac.gov.ng/",
      date: "2026-02-01",
    },
    {
      title: "Civic space narratives affect partner risk ratings",
      summary:
        "Even lawful programs can face elevated scrutiny when issues touch sensitive themes; scenario planning is now default.",
      tag: "Risk",
      source: "CIVICUS Monitor — Nigeria",
      sourceUrl: "https://monitor.civicus.org/country/nigeria/",
      date: "2026-01-18",
    },
    {
      title: "USAID contraction reshapes sub-Saharan grantmaking",
      summary:
        "Funders explore pooled vehicles and regional intermediaries to preserve delivery while reducing direct operational load.",
      tag: "Capital Flows",
      source: "OECD Development Finance Statistics",
      sourceUrl: "https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/",
      date: "2025-12-12",
    },
  ],
  Kenya: [
    {
      title: "Digital reporting pilots expand for larger NGOs",
      summary:
        "Regulators continue incremental modernization; organizations that invested in data hygiene see faster clearance.",
      tag: "Policy",
      source: "NGOs Coordination Board — Kenya",
      sourceUrl: "https://www.ngobureau.go.ke/",
      date: "2026-03-01",
    },
    {
      title: "Regional pooled funds gain traction",
      summary:
        "Climate and health portfolios route through intermediaries with established East Africa desks.",
      tag: "Capital Flows",
      source: "CAF World Giving Index — Kenya",
      sourceUrl: "https://www.cafonline.org/about-us/publications/2023-publications/caf-world-giving-index",
      date: "2026-02-10",
    },
    {
      title: "Audit readiness separates sponsor-ready grantees",
      summary:
        "Smaller organizations that lack audit trails face sponsor hesitation despite strong programs.",
      tag: "Infrastructure",
      source: "Bridgespan: Effective Philanthropy",
      sourceUrl: "https://www.bridgespan.org/insights/library/philanthropy/effective-philanthropy",
      date: "2026-01-25",
    },
    {
      title: "Election-cycle sensitivity for civic-adjacent grants",
      summary:
        "Scenario planning is treated as compliance, not communications-only work, for certain portfolios.",
      tag: "Risk",
      source: "CIVICUS Monitor — Kenya",
      sourceUrl: "https://monitor.civicus.org/country/kenya/",
      date: "2025-12-20",
    },
    {
      title: "Nairobi hub effects on professional services",
      summary:
        "Legal and finance talent pools remain concentrated; remote grantee support budgets are rising.",
      tag: "Infrastructure",
      source: "World Bank — Kenya Economic Update",
      sourceUrl: "https://www.worldbank.org/en/country/kenya/publication/kenya-economic-update",
      date: "2025-11-08",
    },
  ],
  Colombia: [
    {
      title: "Regional implementation variance for cross-border grants",
      summary:
        "Federal frameworks interact with local administration; counsel recommend route-specific validation.",
      tag: "Policy",
      source: "GPEI — Global Philanthropy Environment Index",
      sourceUrl: "https://philanthropyindiana.org/gpei",
      date: "2026-02-27",
    },
    {
      title: "Peacebuilding and climate portfolios steady inbound interest",
      summary:
        "Foundations continue to favor intermediaries with conflict-sensitive diligence playbooks.",
      tag: "Capital Flows",
      source: "OECD Private Philanthropy for Development",
      sourceUrl: "https://www.oecd.org/development/private-philanthropy-for-development.htm",
      date: "2026-02-03",
    },
    {
      title: "Strong legal market lowers setup friction",
      summary:
        "Professional services depth is a structural advantage versus thinner intermediary benches elsewhere.",
      tag: "Infrastructure",
      source: "World Bank — Doing Business: Colombia",
      sourceUrl: "https://www.worldbank.org/en/country/colombia",
      date: "2026-01-15",
    },
    {
      title: "Geography-sensitive programs face extra diligence",
      summary:
        "Certain geographies trigger enhanced monitoring expectations from banks and sponsors alike.",
      tag: "Risk",
      source: "CIVICUS Monitor — Colombia",
      sourceUrl: "https://monitor.civicus.org/country/colombia/",
      date: "2025-12-01",
    },
    {
      title: "Corporate co-funding experiments expand",
      summary:
        "Blended structures increasingly route through established fiscal hosts rather than bespoke SPVs.",
      tag: "Capital Flows",
      source: "CAF America: Cross-Border Giving",
      sourceUrl: "https://www.cafamerica.org/resources/",
      date: "2025-11-14",
    },
  ],
};

const TAG_ROTATION: FeedItem["tag"][] = [
  "Policy",
  "Capital Flows",
  "Infrastructure",
  "Risk",
  "Policy",
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const TAG_SOURCE_URLS: Record<FeedItem["tag"], { source: string; sourceUrl: string }> = {
  "Policy":          { source: "CIVICUS Monitor", sourceUrl: "https://monitor.civicus.org/" },
  "Capital Flows":   { source: "OECD Development Finance", sourceUrl: "https://www.oecd.org/dac/financing-sustainable-development/development-finance-data/" },
  "Infrastructure":  { source: "Candid — Nonprofit Data", sourceUrl: "https://candid.org/" },
  "Risk":            { source: "CIVICUS State of Civil Society", sourceUrl: "https://www.civicus.org/index.php/state-of-civil-society-report-2023" },
};

function genericItemsForCountry(country: string): FeedItem[] {
  const base = hashString(country);
  return TAG_ROTATION.map((tag, index) => ({
    title: `${country}: market signal ${index + 1}`,
    summary: `Seeded intelligence item for ${country}. Replace with live Claude web search results in production. This entry emphasizes ${tag.toLowerCase()} themes relevant to fiscal intermediary expansion.`,
    tag,
    source: TAG_SOURCE_URLS[tag].source,
    sourceUrl: TAG_SOURCE_URLS[tag].sourceUrl,
    date: `2026-${String(((base + index) % 3) + 1).padStart(2, "0")}-${String(((base >> (index + 3)) % 27) + 1).padStart(2, "0")}`,
  }));
}

export function getIntelFeedForCountry(country: string): FeedItem[] {
  return SEEDED[country] ?? genericItemsForCountry(country);
}
