'use client';

export function RecordSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="h-3 w-1/3 rounded bg-slate-200" />
      <div className="h-4 w-2/3 rounded bg-slate-200" />
      <div className="h-3 w-1/2 rounded bg-slate-200" />
      <div className="h-8 w-20 rounded bg-slate-200 mt-2" />
    </div>
  );
}
