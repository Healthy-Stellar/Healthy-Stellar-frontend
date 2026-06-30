'use client';

/**
 * KpiSkeleton – shimmer placeholders for KPI / stat cards.
 * Renders a grid of pulse-animated blocks that match the shape of real KPI cards.
 */
export function KpiSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="shimmer rounded-[14px] p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-8 h-8 rounded-[9px]"
              style={{ background: 'var(--bg-inset)' }}
            />
            <div
              className="w-14 h-7 rounded"
              style={{ background: 'var(--bg-inset)' }}
            />
          </div>
          <div
            className="h-8 w-16 rounded mb-1"
            style={{ background: 'var(--bg-inset)' }}
          />
          <div
            className="h-3 w-24 rounded"
            style={{ background: 'var(--bg-inset)' }}
          />
          <div
            className="h-3 w-20 rounded mt-2"
            style={{ background: 'var(--bg-inset)' }}
          />
        </div>
      ))}
    </div>
  );
}
