"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { IntelFeedItem } from "@/components/IntelFeedItem";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getIntelFeedForCountry } from "@/lib/intelFeedData";
import { useAppStore } from "@/store";
import type { FeedItem } from "@/lib/types";

const TAG_FILTERS: Array<"All" | FeedItem["tag"]> = [
  "All",
  "Policy",
  "Capital Flows",
  "Infrastructure",
  "Risk",
];

export function IntelligenceFeed() {
  const activeCountry = useAppStore((state) => state.activeCountry);
  const [tagFilter, setTagFilter] = useState<"All" | FeedItem["tag"]>("All");
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(() => new Date().toISOString());
  const [liveItems, setLiveItems] = useState<FeedItem[] | null>(null);
  const [liveForCountry, setLiveForCountry] = useState<string | null>(null);
  const [feedError, setFeedError] = useState<{
    country: string;
    message: string;
  } | null>(null);

  const seeded = useMemo(
    () => getIntelFeedForCountry(activeCountry),
    [activeCountry],
  );

  const items =
    liveItems && liveForCountry === activeCountry ? liveItems : seeded;

  const filtered = useMemo(() => {
    if (tagFilter === "All") return items;
    return items.filter((item) => item.tag === tagFilter);
  }, [items, tagFilter]);

  const onRefresh = async () => {
    setLoading(true);
    setFeedError(null);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "intel_feed",
          country: activeCountry,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        items?: FeedItem[];
      };
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      if (!data.items?.length) {
        throw new Error("No items returned");
      }
      setLiveItems(data.items);
      setLiveForCountry(activeCountry);
      setFetchedAt(new Date().toISOString());
    } catch (e) {
      setFeedError({
        country: activeCountry,
        message: e instanceof Error ? e.message : "Refresh failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intelligence Feed</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Per-country intelligence for {activeCountry}. Refresh calls Claude on the server; falls back to seeded data if the request fails.
        </p>
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-900">Report-Ready Analysis</p>
            <h2 className="text-lg font-bold text-gray-900">Latest pull highlights</h2>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {liveItems && liveForCountry === activeCountry
                ? `Last fetch ${new Date(fetchedAt).toLocaleString()} · Claude`
                : `Last fetch ${new Date(fetchedAt).toLocaleString()} · Seeded data`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {liveItems && liveForCountry === activeCountry && (
              <button
                type="button"
                onClick={() => { setLiveItems(null); setLiveForCountry(null); }}
                className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold"
              >
                Use seeded data
              </button>
            )}
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh (Claude)"}
            </button>
          </div>
        </div>
        {feedError && feedError.country === activeCountry && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900">
            {feedError.message}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="card space-y-3 p-5">
        <div className="card p-5">
          <p className="metric-label">Filter by tag</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TAG_FILTERS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tag)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  tagFilter === tag
                    ? "gold-gradient text-white"
                    : "border border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="card p-8 text-center text-sm text-[var(--text-muted)]">
              No items for this tag. Try &quot;All&quot; or another theme.
            </div>
          ) : (
            filtered.map((item, index) => (
              <IntelFeedItem
                key={`${item.title}-${item.date}-${index}`}
                item={item}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
