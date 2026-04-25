export function LoadingSkeleton() {
  return (
    <div className="card animate-pulse space-y-4 p-5">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="h-8 w-36 rounded bg-slate-200" />
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="h-3 w-5/6 rounded bg-slate-100" />
      <div className="h-3 w-4/6 rounded bg-slate-100" />
    </div>
  );
}
