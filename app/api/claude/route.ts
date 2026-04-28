import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { FeedItem, RegulatoryCountryProfile } from "@/lib/types";
import { PREFERRED_SOURCES } from "@/lib/preferredSources";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

const TAGS: FeedItem["tag"][] = [
  "Policy",
  "Capital Flows",
  "Infrastructure",
  "Risk",
];
const RISK_LEVELS: RegulatoryCountryProfile["riskLevel"][] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];
const EXPANSION_MODELS: RegulatoryCountryProfile["recommendedExpansionModel"][] = [
  "New Build",
  "Hybrid",
  "Local Partner",
];
const SEVERITIES: RegulatoryCountryProfile["activeThreats"][number]["severity"][] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

function extractText(content: Anthropic.Messages.ContentBlock[]): string {
  const first = content[0];
  if (first?.type === "text") {
    return first.text;
  }
  return "";
}

function normalizeTag(tag: unknown): FeedItem["tag"] {
  if (typeof tag === "string" && TAGS.includes(tag as FeedItem["tag"])) {
    return tag as FeedItem["tag"];
  }
  return "Policy";
}

function normalizeSourceUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizeRiskLevel(value: unknown): RegulatoryCountryProfile["riskLevel"] {
  if (
    typeof value === "string" &&
    RISK_LEVELS.includes(value as RegulatoryCountryProfile["riskLevel"])
  ) {
    return value as RegulatoryCountryProfile["riskLevel"];
  }
  return "Medium";
}

function normalizeExpansionModel(
  value: unknown,
): RegulatoryCountryProfile["recommendedExpansionModel"] {
  if (
    typeof value === "string" &&
    EXPANSION_MODELS.includes(
      value as RegulatoryCountryProfile["recommendedExpansionModel"],
    )
  ) {
    return value as RegulatoryCountryProfile["recommendedExpansionModel"];
  }
  return "Hybrid";
}

function normalizeSeverity(
  value: unknown,
): RegulatoryCountryProfile["activeThreats"][number]["severity"] {
  if (
    typeof value === "string" &&
    SEVERITIES.includes(
      value as RegulatoryCountryProfile["activeThreats"][number]["severity"],
    )
  ) {
    return value as RegulatoryCountryProfile["activeThreats"][number]["severity"];
  }
  return "Medium";
}

function sourceCatalogPrompt() {
  return PREFERRED_SOURCES.map(
    (source) =>
      `- ${source.name} | ${source.url} | cadence: ${source.cadence} | latest: ${source.latest} | notable: ${source.notableFor}`,
  ).join("\n");
}

function normalizeSourceList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const r = row as Record<string, unknown>;
      return {
        name: typeof r.name === "string" ? r.name : "",
        url: normalizeSourceUrl(r.url) ?? "",
      };
    })
    .filter((row) => row.name.length > 0 && row.url.length > 0);
}

function parseClaudeJson(raw: string): unknown {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  let body: { action?: string; country?: string; module?: string; userSources?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.action !== "string" || typeof body.country !== "string") {
    return NextResponse.json(
      {
        error: 'Expected JSON body: { "action": "<supported_action>", "country": "<name>" }',
      },
      { status: 400 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  let prompt = "";
  if (body.action === "intel_feed") {
    prompt = `You are a philanthropic sector analyst for Global South fiscal sponsorship and cross-border grantmaking.

Generate exactly 5 concise intelligence items for: ${body.country}.

Return ONLY valid JSON — no markdown fences, no commentary. Shape:
{"items":[{"title":string,"summary":string,"tag":"Policy"|"Capital Flows"|"Infrastructure"|"Risk","source":string,"sourceUrl":string,"date":string}]}

Preferred source catalog (use this list for source attribution):
${sourceCatalogPrompt()}

Rules:
- summary: 2-3 sentences each.
- date: approximate ISO date YYYY-MM-DD for recent developments.
- source: must be one of the source names from the catalog.
- sourceUrl: must be the matching URL from the catalog.
- Mix tags across the 5 items where realistic.`;
  } else if (body.action === "regulatory_risk") {
    prompt = `You are a regulatory intelligence analyst for cross-border philanthropy.

Country: ${body.country}

Return ONLY valid JSON with this exact shape:
{
  "profile": {
    "riskLevel": "Low"|"Medium"|"High"|"Critical",
    "governmentPostureSummary": string,
    "recommendedExpansionModel": "New Build"|"Hybrid"|"Local Partner",
    "activeThreats": [{"title":string,"summary":string,"date":"YYYY-MM-DD","severity":"Low"|"Medium"|"High"|"Critical"}],
    "governmentPosture": [{"title":string,"summary":string,"date":"YYYY-MM-DD","severity":"Low"|"Medium"|"High"|"Critical"}],
    "recentChanges": [{"title":string,"summary":string,"date":"YYYY-MM-DD","severity":"Low"|"Medium"|"High"|"Critical"}],
    "timeline12m": [{"date":"YYYY-MM","label":string,"severity":"Low"|"Medium"|"High"|"Critical"}]
  },
  "sources": [{"name":string,"url":string}]
}

Rules:
- activeThreats: exactly 3 items
- governmentPosture: 2-3 items
- recentChanges: exactly 3 items
- timeline12m: exactly 4 items
- Be concise, specific, and country-relevant.`;
  } else if (body.action === "philanthropy_index") {
    prompt = `You are a philanthropy market analyst.

Country: ${body.country}

Return ONLY valid JSON with this exact shape:
{
  "metrics": {"corporate":string,"individual":string,"endowment":string},
  "trend": [{"y":"2021","v":number},{"y":"2022","v":number},{"y":"2023","v":number},{"y":"2024","v":number},{"y":"2025","v":number}],
  "topCorporateDonors": [{"name":string,"giving":string}],
  "sources": [{"name":string,"url":string}]
}

Rules:
- topCorporateDonors: exactly 3 rows
- trend values should be realistic indexed values roughly 80-180
- Use $ amounts as strings for metrics and donor giving.`;
  } else if (body.action === "capital_flow") {
    prompt = `You are a grant capital-flows analyst.

Country: ${body.country}

Return ONLY valid JSON with this exact shape:
{
  "stacked": [{"year":"2021","bilateral":number,"foundation":number,"corporate":number,"domestic":number},{"year":"2022","bilateral":number,"foundation":number,"corporate":number,"domestic":number},{"year":"2023","bilateral":number,"foundation":number,"corporate":number,"domestic":number},{"year":"2024","bilateral":number,"foundation":number,"corporate":number,"domestic":number},{"year":"2025","bilateral":number,"foundation":number,"corporate":number,"domestic":number}],
  "funders": [{"name":string,"total":string,"sector":string,"trend":string}],
  "sectors": [{"name":string,"value":number}],
  "sources": [{"name":string,"url":string}]
}

Rules:
- funders: exactly 3 rows
- sectors: 4-6 rows, percentages summing near 100
- trend must be one of: "Up", "Down", "Stable".`;
  } else if (body.action === "peer_benchmarking") {
    prompt = `You are a philanthropy intermediary benchmarking analyst.

Country context: ${body.country}

Return ONLY valid JSON with this exact shape:
{
  "peerOrgs": [{"org":string,"aum":string,"countries":string,"services":string,"fees":string,"overlap":string}],
  "peerRadar": [{"subject":string,"caf":number,"rpa":number,"giveIndia":number,"brFdn":number}],
  "sources": [{"name":string,"url":string}]
}

Rules:
- peerOrgs: exactly 4 rows and must include org names CAF America, RPA, GiveIndia, BrazilFoundation
- peerRadar: exactly 5 rows
- all radar scores must be integers from 0 to 100.`;
  } else if (body.action === "module_insight") {
    const userSourceBlock =
      Array.isArray(body.userSources) && body.userSources.length > 0
        ? `\nUser-provided sources to prioritize and cite (fetch and analyze these):\n${body.userSources.map((u) => `- ${u}`).join("\n")}\n`
        : "";
    prompt = `You are a philanthropy intelligence analyst.

Module: ${body.module ?? "general"}
Country context: ${body.country ?? "global"}
${userSourceBlock}
Return ONLY valid JSON:
{
  "highlights":[string,string,string],
  "sources":[{"name":string,"url":string}]
}

Rules:
- highlights: exactly 3 concise bullets, each 1 sentence.
- If user-provided sources are listed above, fetch their content and base highlights on them where relevant.
- sources: cite user-provided sources first if used, then supplement from this preferred catalog:
${sourceCatalogPrompt()}
`;
  } else {
    return NextResponse.json({ error: `Unsupported action: ${body.action}` }, { status: 400 });
  }

  let message: Anthropic.Messages.Message;
  try {
    message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Anthropic request failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const raw = extractText(message.content);
  let parsed: unknown;
  try {
    parsed = parseClaudeJson(raw);
  } catch {
    return NextResponse.json(
      {
        error: "Could not parse JSON from Claude response.",
        detail: raw.slice(0, 800),
      },
      { status: 502 },
    );
  }

  if (body.action === "intel_feed") {
    const itemsUnknown = (parsed as { items?: unknown }).items;
    if (!Array.isArray(itemsUnknown)) {
      return NextResponse.json(
        { error: "Response missing items array" },
        { status: 502 },
      );
    }

    const items: FeedItem[] = [];
    for (const row of itemsUnknown.slice(0, 8)) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      if (typeof r.title !== "string" || typeof r.summary !== "string") continue;
      items.push({
        title: r.title,
        summary: r.summary,
        tag: normalizeTag(r.tag),
        source: typeof r.source === "string" ? r.source : "Claude briefing",
        sourceUrl: normalizeSourceUrl(r.sourceUrl),
        date:
          typeof r.date === "string"
            ? r.date
            : new Date().toISOString().slice(0, 10),
      });
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No valid feed items in Claude response" },
        { status: 502 },
      );
    }

    return NextResponse.json({ items });
  }

  if (body.action === "regulatory_risk") {
    const profile = (parsed as { profile?: unknown }).profile;
    if (!profile || typeof profile !== "object") {
      return NextResponse.json(
        { error: "Response missing profile object" },
        { status: 502 },
      );
    }
    const p = profile as Record<string, unknown>;
    const normalizeItems = (
      value: unknown,
    ): RegulatoryCountryProfile["activeThreats"] => {
      if (!Array.isArray(value)) return [];
      return value
        .filter((row) => row && typeof row === "object")
        .map((row) => {
          const r = row as Record<string, unknown>;
          return {
            title: typeof r.title === "string" ? r.title : "Untitled",
            summary: typeof r.summary === "string" ? r.summary : "",
            date:
              typeof r.date === "string"
                ? r.date
                : new Date().toISOString().slice(0, 10),
            severity: normalizeSeverity(r.severity),
          };
        })
        .filter((row) => row.summary.length > 0);
    };

    const normalizeTimeline = (
      value: unknown,
    ): RegulatoryCountryProfile["timeline12m"] => {
      if (!Array.isArray(value)) return [];
      return value
        .filter((row) => row && typeof row === "object")
        .map((row) => {
          const r = row as Record<string, unknown>;
          return {
            date:
              typeof r.date === "string"
                ? r.date
                : new Date().toISOString().slice(0, 7),
            label: typeof r.label === "string" ? r.label : "Update",
            severity: normalizeSeverity(r.severity),
          };
        });
    };

    return NextResponse.json({
      profile: {
        riskLevel: normalizeRiskLevel(p.riskLevel),
        governmentPostureSummary:
          typeof p.governmentPostureSummary === "string"
            ? p.governmentPostureSummary
            : "No summary provided.",
        recommendedExpansionModel: normalizeExpansionModel(
          p.recommendedExpansionModel,
        ),
        activeThreats: normalizeItems(p.activeThreats),
        governmentPosture: normalizeItems(p.governmentPosture),
        recentChanges: normalizeItems(p.recentChanges),
        timeline12m: normalizeTimeline(p.timeline12m),
      },
      sources: normalizeSourceList((parsed as { sources?: unknown }).sources),
    });
  }

  if (body.action === "philanthropy_index") {
    const p = parsed as {
      metrics?: unknown;
      trend?: unknown;
      topCorporateDonors?: unknown;
      sources?: unknown;
    };
    return NextResponse.json({
      metrics: p.metrics,
      trend: p.trend,
      topCorporateDonors: p.topCorporateDonors,
      sources: normalizeSourceList(p.sources),
    });
  }

  if (body.action === "capital_flow") {
    const p = parsed as {
      stacked?: unknown;
      funders?: unknown;
      sectors?: unknown;
      sources?: unknown;
    };
    return NextResponse.json({
      stacked: p.stacked,
      funders: p.funders,
      sectors: p.sectors,
      sources: normalizeSourceList(p.sources),
    });
  }

  if (body.action === "peer_benchmarking") {
    const p = parsed as {
      peerOrgs?: unknown;
      peerRadar?: unknown;
      sources?: unknown;
    };
    return NextResponse.json({
      peerOrgs: p.peerOrgs,
      peerRadar: p.peerRadar,
      sources: normalizeSourceList(p.sources),
    });
  }

  const p = parsed as { highlights?: unknown; sources?: unknown };
  return NextResponse.json({
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    sources: normalizeSourceList(p.sources),
  });
}
