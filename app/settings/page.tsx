"use client";

import { useEffect, useState } from "react";
import { Save, Trash2, Plus } from "lucide-react";
import { useUserSources } from "@/hooks/useUserSources";

const COUNTRIES = ["Brazil", "Nigeria", "Kenya", "Colombia", "South Africa", "Ethiopia", "Ukraine", "Bangladesh"];

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

function UrlList({
  label,
  description,
  urls,
  onChange,
}: {
  label: string;
  description: string;
  urls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [draft, setDraft] = useState(urls.join("\n"));
  const [saved, setSaved] = useState(false);

  useEffect(() => { setDraft(urls.join("\n")); }, [urls]);

  const lines = draft.split("\n").map((l) => l.trim()).filter(Boolean);
  const invalid = lines.filter((l) => !isValidUrl(l));

  const handleSave = () => {
    onChange(lines.filter((l) => isValidUrl(l)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card p-5 space-y-3">
      <div>
        <h2 className="text-lg font-bold">{label}</h2>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <textarea
        className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
        rows={6}
        placeholder={"https://example.com/report\nhttps://another-source.org/data"}
        value={draft}
        onChange={(e) => { setDraft(e.target.value); setSaved(false); }}
      />
      {invalid.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {invalid.length} invalid URL{invalid.length > 1 ? "s" : ""} will be skipped:{" "}
          {invalid.map((u) => <code key={u} className="ml-1">{u}</code>)}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save"}
        </button>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={() => { setDraft(""); onChange([]); }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        )}
        <span className="text-xs text-[var(--text-muted)]">
          {lines.filter(isValidUrl).length} valid URL{lines.filter(isValidUrl).length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data, setGlobal, setForCountry } = useUserSources();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Source Settings</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Add URLs you want Claude to reference when generating Report-Ready Analysis highlights.
          Global sources are included on every refresh. Country sources are added when that
          country is selected. One URL per line.
        </p>
      </div>

      <div className="card p-5 space-y-2">
        <p className="metric-label">How it works</p>
        <ol className="list-decimal pl-4 space-y-1 text-sm text-[var(--text-muted)]">
          <li>Paste report URLs below (annual reports, government databases, news sources, etc.)</li>
          <li>Hit <strong>Save</strong> — URLs are stored in your browser (localStorage)</li>
          <li>On any page, click <strong>Refresh (Claude)</strong> — your URLs are sent to Claude alongside the module context</li>
          <li>Claude fetches, analyzes, and cites those sources in the highlights it returns</li>
        </ol>
        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong>Note:</strong> Claude will attempt to read these URLs. Pages behind login walls or paywalls cannot be accessed. Best results with publicly accessible PDFs, government data portals, and open databases.
        </div>
      </div>

      <UrlList
        label="Global sources"
        description="Included in every Claude refresh regardless of country or module."
        urls={data.global}
        onChange={setGlobal}
      />

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Country-specific sources</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Only included when the matching country is selected.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => {
            const count = (data.byCountry[c] ?? []).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCountry(c)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCountry === c
                    ? "gold-gradient text-white"
                    : "border border-[var(--border)] bg-white"
                }`}
              >
                {c}
                {count > 0 && (
                  <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-gold)] text-[10px] text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <UrlList
          key={selectedCountry}
          label={`${selectedCountry} sources`}
          description={`Only sent to Claude when ${selectedCountry} is the selected country.`}
          urls={data.byCountry[selectedCountry] ?? []}
          onChange={(urls) => setForCountry(selectedCountry, urls)}
        />
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">All saved sources</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Read-only overview of everything currently stored.</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Global ({data.global.length})</p>
            {data.global.length === 0 ? (
              <p className="mt-1 text-xs text-[var(--text-muted)]">None saved.</p>
            ) : (
              <ul className="mt-1 space-y-1">
                {data.global.map((url) => (
                  <li key={url} className="text-xs">
                    <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 underline break-all">{url}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {Object.entries(data.byCountry).filter(([, v]) => v.length > 0).map(([country, urls]) => (
            <div key={country}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{country} ({urls.length})</p>
              <ul className="mt-1 space-y-1">
                {urls.map((url) => (
                  <li key={url} className="text-xs">
                    <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 underline break-all">{url}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
