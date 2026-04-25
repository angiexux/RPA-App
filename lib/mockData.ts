import { computeComposite, recommendModel } from "@/lib/scoring";
import { CountryAnalysis } from "@/lib/types";

const rawScores = [
  {
    country: "Brazil",
    continent: "Latin America" as const,
    policy: 3.5,
    capital: 4,
    infrastructure: 4.5,
    talent: 3.5,
    stats: [
      { label: "Fiscal sponsors", value: "140+" },
      { label: "Major funders", value: "Ford, Gates, CLUA" },
      { label: "Policy change", value: "ITCMD reform under review" },
    ],
  },
  {
    country: "Nigeria",
    continent: "Sub-Saharan Africa" as const,
    policy: 2.5,
    capital: 2.5,
    infrastructure: 2,
    talent: 2.5,
    stats: [
      { label: "Fiscal sponsors", value: "Limited full-service capacity" },
      { label: "Major funders", value: "MacArthur, Ford, Gates" },
      { label: "Policy change", value: "AML and SCUML friction persists" },
    ],
  },
  { country: "Kenya", continent: "Sub-Saharan Africa" as const, policy: 3.6, capital: 3.7, infrastructure: 3.4, talent: 3.8, stats: [{ label: "Fiscal sponsors", value: "Growing intermediary market" }, { label: "Major funders", value: "CIFF, Gates, Mastercard" }, { label: "Policy change", value: "Moderate NGO oversight" }] },
  { country: "Ghana", continent: "Sub-Saharan Africa" as const, policy: 3.3, capital: 3.1, infrastructure: 2.9, talent: 3.2, stats: [{ label: "Fiscal sponsors", value: "Emerging local support" }, { label: "Major funders", value: "USAID backfill opportunities" }, { label: "Policy change", value: "Stable civil society environment" }] },
  { country: "South Africa", continent: "Sub-Saharan Africa" as const, policy: 4.1, capital: 3.9, infrastructure: 4.2, talent: 4, stats: [{ label: "Fiscal sponsors", value: "Mature service ecosystem" }, { label: "Major funders", value: "DGMT, Ford, Gates" }, { label: "Policy change", value: "Predictable regulatory administration" }] },
  { country: "Ethiopia", continent: "Sub-Saharan Africa" as const, policy: 2.3, capital: 2.7, infrastructure: 2.1, talent: 2.4, stats: [{ label: "Fiscal sponsors", value: "Low intermediary depth" }, { label: "Major funders", value: "Humanitarian-heavy flows" }, { label: "Policy change", value: "Heightened operational sensitivity" }] },
  { country: "Rwanda", continent: "Sub-Saharan Africa" as const, policy: 3.8, capital: 3.1, infrastructure: 2.8, talent: 3.4, stats: [{ label: "Fiscal sponsors", value: "Small but coordinated market" }, { label: "Major funders", value: "Health and climate concentrated" }, { label: "Policy change", value: "High state coordination" }] },
  { country: "Tanzania", continent: "Sub-Saharan Africa" as const, policy: 2.9, capital: 3, infrastructure: 2.6, talent: 2.8, stats: [{ label: "Fiscal sponsors", value: "Limited full-stack operators" }, { label: "Major funders", value: "Conservation and health" }, { label: "Policy change", value: "Registration friction persists" }] },
  { country: "Uganda", continent: "Sub-Saharan Africa" as const, policy: 2.7, capital: 2.9, infrastructure: 2.4, talent: 2.7, stats: [{ label: "Fiscal sponsors", value: "Thin intermediary coverage" }, { label: "Major funders", value: "Large bilateral exposure" }, { label: "Policy change", value: "Civic space risk remains elevated" }] },
  { country: "Senegal", continent: "Sub-Saharan Africa" as const, policy: 3.2, capital: 2.9, infrastructure: 2.7, talent: 3.1, stats: [{ label: "Fiscal sponsors", value: "Moderate legal-advisory support" }, { label: "Major funders", value: "Regional francophone appeal" }, { label: "Policy change", value: "Periodic election-linked uncertainty" }] },
  { country: "Côte d'Ivoire", continent: "Sub-Saharan Africa" as const, policy: 3, capital: 2.8, infrastructure: 2.5, talent: 2.9, stats: [{ label: "Fiscal sponsors", value: "Developing service providers" }, { label: "Major funders", value: "Agriculture and youth sectors" }, { label: "Policy change", value: "Cross-border structuring still hard" }] },
  { country: "Mozambique", continent: "Sub-Saharan Africa" as const, policy: 2.4, capital: 2.5, infrastructure: 2.1, talent: 2.3, stats: [{ label: "Fiscal sponsors", value: "Limited trusted operators" }, { label: "Major funders", value: "Extractives and resilience themes" }, { label: "Policy change", value: "Operational compliance burden high" }] },
  { country: "Zimbabwe", continent: "Sub-Saharan Africa" as const, policy: 1.9, capital: 2.2, infrastructure: 1.8, talent: 2.2, stats: [{ label: "Fiscal sponsors", value: "Very constrained" }, { label: "Major funders", value: "Selective humanitarian support" }, { label: "Policy change", value: "Policy volatility remains high" }] },
  { country: "Colombia", continent: "Latin America" as const, policy: 3.8, capital: 3.7, infrastructure: 3.8, talent: 3.6, stats: [{ label: "Fiscal sponsors", value: "Strong nonprofit ecosystem" }, { label: "Major funders", value: "Peacebuilding and climate flows" }, { label: "Policy change", value: "Stable grantmaking pathways" }] },
  { country: "Mexico", continent: "Latin America" as const, policy: 3.4, capital: 3.8, infrastructure: 3.6, talent: 3.5, stats: [{ label: "Fiscal sponsors", value: "Robust legal support market" }, { label: "Major funders", value: "Corporate and family office mix" }, { label: "Policy change", value: "Compliance complexity is manageable" }] },
  { country: "Argentina", continent: "Latin America" as const, policy: 2.8, capital: 3.2, infrastructure: 3.1, talent: 3.2, stats: [{ label: "Fiscal sponsors", value: "Capable but volatile environment" }, { label: "Major funders", value: "Domestic donor concentration" }, { label: "Policy change", value: "Economic volatility affects execution" }] },
  { country: "Chile", continent: "Latin America" as const, policy: 4, capital: 3.5, infrastructure: 3.7, talent: 3.8, stats: [{ label: "Fiscal sponsors", value: "Strong governance baseline" }, { label: "Major funders", value: "Climate and innovation active" }, { label: "Policy change", value: "Comparatively low policy risk" }] },
  { country: "Peru", continent: "Latin America" as const, policy: 3.1, capital: 3, infrastructure: 2.9, talent: 3, stats: [{ label: "Fiscal sponsors", value: "Selective intermediary coverage" }, { label: "Major funders", value: "Extractives and health" }, { label: "Policy change", value: "Political instability affects timing" }] },
  { country: "Ecuador", continent: "Latin America" as const, policy: 3, capital: 2.8, infrastructure: 2.8, talent: 2.9, stats: [{ label: "Fiscal sponsors", value: "Light operational depth" }, { label: "Major funders", value: "Conservation flows notable" }, { label: "Policy change", value: "Moderate legal friction" }] },
  { country: "Bolivia", continent: "Latin America" as const, policy: 2.5, capital: 2.4, infrastructure: 2.1, talent: 2.4, stats: [{ label: "Fiscal sponsors", value: "Thin ecosystem" }, { label: "Major funders", value: "Issue-specific support only" }, { label: "Policy change", value: "Foreign funding scrutiny elevated" }] },
  { country: "Paraguay", continent: "Latin America" as const, policy: 2.9, capital: 2.6, infrastructure: 2.5, talent: 2.7, stats: [{ label: "Fiscal sponsors", value: "Early-stage market" }, { label: "Major funders", value: "Agriculture and youth themes" }, { label: "Policy change", value: "Moderate paperwork burden" }] },
  { country: "Uruguay", continent: "Latin America" as const, policy: 4.2, capital: 3.2, infrastructure: 3.3, talent: 3.5, stats: [{ label: "Fiscal sponsors", value: "Small but capable ecosystem" }, { label: "Major funders", value: "Stable domestic philanthropy" }, { label: "Policy change", value: "Low-risk operating climate" }] },
  { country: "Guatemala", continent: "Latin America" as const, policy: 2.6, capital: 2.8, infrastructure: 2.4, talent: 2.7, stats: [{ label: "Fiscal sponsors", value: "Limited quality providers" }, { label: "Major funders", value: "Migration and health concentrated" }, { label: "Policy change", value: "Civic space concerns remain" }] },
  { country: "Costa Rica", continent: "Latin America" as const, policy: 4.1, capital: 3.3, infrastructure: 3.4, talent: 3.6, stats: [{ label: "Fiscal sponsors", value: "Stable institutional environment" }, { label: "Major funders", value: "Environment and education" }, { label: "Policy change", value: "Low friction relative to region" }] },
];

function sentenceFor(country: string, area: string, score: number) {
  if (score >= 4) {
    return `${country} shows strong ${area.toLowerCase()} readiness with visible institutional depth and relatively low execution friction.`;
  }

  if (score >= 3) {
    return `${country} has workable ${area.toLowerCase()} conditions, but expansion would still require targeted diligence and local partner validation.`;
  }

  if (score >= 2) {
    return `${country} presents meaningful ${area.toLowerCase()} constraints that would likely slow early setup and increase operating complexity.`;
  }

  return `${country} currently faces severe ${area.toLowerCase()} barriers that make near-term expansion premature without a major external shift.`;
}

export const allCountryAnalyses: CountryAnalysis[] = rawScores.map((entry) => {
  const composite = computeComposite(entry);

  return {
    country: entry.country,
    continent: entry.continent,
    policy: {
      score: entry.policy,
      justification: sentenceFor(entry.country, "Policy", entry.policy),
    },
    capital: {
      score: entry.capital,
      justification: sentenceFor(entry.country, "Capital Flows", entry.capital),
    },
    infrastructure: {
      score: entry.infrastructure,
      justification: sentenceFor(entry.country, "Infrastructure", entry.infrastructure),
    },
    talent: {
      score: entry.talent,
      justification: sentenceFor(entry.country, "Talent", entry.talent),
    },
    composite,
    model: recommendModel(composite),
    fetchedAt: "2026-04-18T18:00:00Z",
    stats: entry.stats,
    narrative: [
      `${entry.country} is positioned as a ${recommendModel(composite).toLowerCase()} candidate in this MVP based on its weighted composite score of ${composite}.`,
      `The current view uses seeded benchmark data so the shell, scoring logic, and navigation can be exercised before live OpenAI-backed retrieval is wired in.`,
      `Operationally, RPA should treat this as a triage layer: compare policy friction, capital availability, intermediary infrastructure, and talent depth before escalating to a bespoke diligence memo.`,
    ],
  };
});

export const featuredCountries = ["Brazil", "Nigeria", "Kenya", "Colombia"];

export function getCountryAnalysis(country: string) {
  return allCountryAnalyses.find((item) => item.country === country);
}
