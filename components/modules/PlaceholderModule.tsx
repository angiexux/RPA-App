export function PlaceholderModule({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="metric-label">Module</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">{summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="metric-label">Status</p>
          <p className="mt-2 text-xl font-bold">Shell ready</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Route, navigation, and global summary wiring are in place.
          </p>
        </div>
        <div className="card p-5">
          <p className="metric-label">Next step</p>
          <p className="mt-2 text-xl font-bold">Add module-specific data</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Replace this placeholder with charts, tables, and live fetch logic.
          </p>
        </div>
        <div className="card p-5">
          <p className="metric-label">Data mode</p>
          <p className="mt-2 text-xl font-bold">Seeded MVP</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            The app is scaffolded so you can extend each module incrementally.
          </p>
        </div>
      </div>
    </div>
  );
}
