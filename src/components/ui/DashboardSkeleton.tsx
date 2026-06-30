'use client';

/**
 * DashboardSkeleton – shimmer placeholder for data tables / record lists.
 * Renders table rows with animated pulse that match the actual table structure.
 */
export function DashboardSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="shimmer px-5 py-3.5 flex items-center gap-4"
        >
          <div
            className="w-7 h-7 rounded-full shrink-0"
            style={{ background: 'var(--bg-inset)' }}
          />
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3 rounded w-1/3"
              style={{ background: 'var(--bg-inset)' }}
            />
            <div
              className="h-2.5 rounded w-1/4"
              style={{ background: 'var(--bg-inset)' }}
            />
          </div>
          <div
            className="h-6 w-16 rounded shrink-0"
            style={{ background: 'var(--bg-inset)' }}
          />
          <div
            className="h-6 w-20 rounded shrink-0 hidden sm:block"
            style={{ background: 'var(--bg-inset)' }}
          />
        </div>
      ))}
    </div>
  );
}
