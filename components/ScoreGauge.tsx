export function ScoreGauge({ value }: { value: number }) {
  const normalized = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white shadow-sm">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(var(--accent-gold) ${normalized}%, #e5e7eb ${normalized}% 100%)`,
        }}
      />
      <div className="absolute inset-[14px] rounded-full bg-[var(--bg-secondary)]" />
      <div className="relative text-center">
        <p className="metric-label">Composite</p>
        <p className="text-4xl font-bold">{value.toFixed(2)}</p>
        <p className="text-sm text-[var(--text-muted)]">out of 5.00</p>
      </div>
    </div>
  );
}
