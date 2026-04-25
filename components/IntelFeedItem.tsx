import type { FeedItem } from "@/lib/types";

function tagStyles(tag: FeedItem["tag"]) {
  switch (tag) {
    case "Policy":
      return "border-teal-600 bg-teal-50 text-teal-900";
    case "Capital Flows":
      return "border-amber-500 bg-amber-50 text-amber-900";
    case "Infrastructure":
      return "border-slate-400 bg-slate-50 text-slate-800";
    case "Risk":
      return "border-red-400 bg-red-50 text-red-900";
  }
}

export function IntelFeedItem({ item }: { item: FeedItem }) {
  return (
    <article className="card p-5 transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-bold leading-snug">{item.title}</h2>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${tagStyles(
            item.tag,
          )}`}
        >
          {item.tag}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
        {item.summary}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--text-primary)] underline decoration-dotted underline-offset-2"
          >
            {item.source}
          </a>
        ) : (
          <span className="font-medium text-[var(--text-primary)]">{item.source}</span>
        )}
        <span>{item.date}</span>
      </div>
    </article>
  );
}
