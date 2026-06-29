'use client';

/**
 * Skeleton loader for KPI / metric cards used across dashboards.
 * Matches the rounded-[14px] card shape with icon, value, label, and sub-label.
 */
export function KpiSkeleton() {
  return (
    <div
      className="rounded-[14px] p-5 animate-pulse"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="h-8 w-8 rounded-[9px] mb-4" style={{ background: 'var(--bg-inset)' }} />
      <div className="h-6 w-16 rounded mb-1.5" style={{ background: 'var(--bg-inset)' }} />
      <div className="h-3 w-20 rounded mb-0.5" style={{ background: 'var(--bg-inset)' }} />
      <div className="h-3 w-12 rounded" style={{ background: 'var(--bg-inset)' }} />
    </div>
  );
}

/**
 * A grid of KPI skeletons. Defaults to 4 cards in 4 columns.
 */
export function KpiGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <KpiSkeleton key={i} />
      ))}
    </div>
  );
}
