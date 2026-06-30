'use client';

/**
 * AppointmentSkeleton – shimmer placeholder for appointment / upcoming-items lists.
 * Renders rows matching the shape of appointment cards or timeline items.
 */
export function AppointmentSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="shimmer flex items-start gap-3 p-3 rounded-[10px]"
          style={{ background: 'var(--bg-inset)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="w-8 h-8 rounded-lg shrink-0"
            style={{ background: 'var(--bg-card)' }}
          />
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3 w-2/3 rounded"
              style={{ background: 'var(--bg-card)' }}
            />
            <div
              className="h-2.5 w-1/2 rounded"
              style={{ background: 'var(--bg-card)' }}
            />
            <div
              className="h-2.5 w-1/3 rounded"
              style={{ background: 'var(--bg-card)' }}
            />
          </div>
          <div
            className="h-5 w-16 rounded shrink-0"
            style={{ background: 'var(--bg-card)' }}
          />
        </div>
      ))}
    </div>
  );
}
