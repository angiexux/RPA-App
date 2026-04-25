export interface PreferredSource {
  name: string;
  url: string;
  cadence: string;
  latest: string;
  notableFor: string;
}

export const PREFERRED_SOURCES: PreferredSource[] = [
  {
    name: "Global Philanthropy Environment Index (GPEI)",
    url: "https://globalindices.indianapolis.iu.edu/environment-index/index.html",
    cadence: "3-4 years",
    latest: "2025",
    notableFor: "Market entry enablement assessment",
  },
  {
    name: "Global Philanthropy Tracker",
    url: "https://globalindices.indianapolis.iu.edu/tracker/index.html",
    cadence: "~2-3 years",
    latest: "2023",
    notableFor: "Cross-border flow data",
  },
  {
    name: "OECD Centre on Philanthropy",
    url: "https://www.oecd.org/en/about/programmes/centre-on-philanthropy.html",
    cadence: "3-4 years",
    latest: "2026",
    notableFor: "Deep country and sector data",
  },
  {
    name: "CAF World Giving Report",
    url: "https://cafamerica.org/reports/world-giving-report/",
    cadence: "Annual",
    latest: "2025",
    notableFor: "Individual giving culture at country level",
  },
  {
    name: "IssueLab",
    url: "https://issuelab.org/",
    cadence: "Ongoing",
    latest: "Real-time",
    notableFor: "Funding along issue areas",
  },
  {
    name: "Africa Wealth Report",
    url: "https://www.henleyglobal.com/publications/africa-wealth-report-2024",
    cadence: "Annual",
    latest: "2024",
    notableFor: "UHNWI mapping",
  },
  {
    name: "Global Multidimensional Poverty Index (MPI)",
    url: "https://hdr.undp.org/content/2025-global-multidimensional-poverty-index-mpi#/indicies/MPI",
    cadence: "Bi-annual",
    latest: "2025",
    notableFor: "Poverty index tracking",
  },
  {
    name: "Human Development Report",
    url: "https://hdr.undp.org/content/human-development-report-2025",
    cadence: "Annual",
    latest: "2025",
    notableFor: "Human development index",
  },
  {
    name: "Gender Social Norms Index (GSNI)",
    url: "https://hdr.undp.org/content/2023-gender-social-norms-index-gsni#/indicies/GSNI",
    cadence: "Bi-annual",
    latest: "2023",
    notableFor: "Gender norms tracker",
  },
  {
    name: "Africa Industrialization Index",
    url: "https://www.afdb.org/en/documents/africa-industrialization-index-2022",
    cadence: "Irregular",
    latest: "2022",
    notableFor: "Industrialization by country",
  },
  {
    name: "UNICEF Country Profiles",
    url: "https://data.unicef.org/adp/country-profiles/",
    cadence: "Annual",
    latest: "2026",
    notableFor: "Country key indices",
  },
  {
    name: "UN SDG Progress Report",
    url: "https://unstats.un.org/sdgs/report/2025/",
    cadence: "Annual",
    latest: "2025",
    notableFor: "SDG progress",
  },
  {
    name: "UN SDG Indicators",
    url: "https://unstats.un.org/sdgs/report/2025/Goal-01/",
    cadence: "Annual",
    latest: "2025",
    notableFor: "SDG indicators",
  },
  {
    name: "CIVICUS Monitor Global Findings",
    url: "https://monitor.civicus.org/globalfindings_2024/",
    cadence: "Annual",
    latest: "2024",
    notableFor: "Operating environment",
  },
  {
    name: "CIVICUS State of Civil Society Report",
    url: "https://publications.civicus.org/publications/2025-state-of-civil-society-report/",
    cadence: "Annual",
    latest: "2025",
    notableFor: "Civic space",
  },
  {
    name: "Bridgespan Collaborative Landscape",
    url: "https://www.bridgespan.org/insights/philanthropic-collaborative-landscape",
    cadence: "Annual",
    latest: "2025 / updated March 2026",
    notableFor: "Intermediary and collaborative structures",
  },
  {
    name: "Candid",
    url: "https://candid.org/",
    cadence: "Ongoing",
    latest: "Real-time",
    notableFor: "Foundation grants mapping and repository access",
  },
];
