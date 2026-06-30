'use client';

export function RecordSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[--border] bg-[--bg-card] p-4 space-y-3">
      <div className="h-3 w-1/3 rounded bg-[--bg-inset]" />
      <div className="h-4 w-2/3 rounded bg-[--bg-inset]" />
      <div className="h-3 w-1/2 rounded bg-[--bg-inset]" />
      <div className="h-8 w-20 rounded bg-[--bg-inset] mt-2" />
    </div>
  );
}
