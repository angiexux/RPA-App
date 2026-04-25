import { allCountryAnalyses } from "@/lib/mockData";

/** All benchmark countries with Brazil first, then alphabetical. */
export function getCountryOptionsSorted(): string[] {
  const names = allCountryAnalyses.map((c) => c.country);
  const rest = names.filter((n) => n !== "Brazil").sort();
  return names.includes("Brazil") ? ["Brazil", ...rest] : [...names].sort();
}
