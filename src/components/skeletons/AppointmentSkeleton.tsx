'use client';

/**
 * Skeleton loader for a single appointment card.
 * Matches the appointment card shape used in patient and doctor dashboards.
 */
export function AppointmentSkeleton() {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-[10px] animate-pulse"
      style={{ background: 'var(--bg-inset)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: 'var(--bg-card)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded" style={{ background: 'var(--bg-card)' }} />
        <div className="h-2.5 w-1/3 rounded" style={{ background: 'var(--bg-card)' }} />
        <div className="h-2.5 w-1/4 rounded" style={{ background: 'var(--bg-card)' }} />
      </div>
      <div className="h-5 w-16 rounded-full shrink-0 mt-1" style={{ background: 'var(--bg-card)' }} />
    </div>
  );
}

/**
 * A list of appointment skeletons.
 */
export function AppointmentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <AppointmentSkeleton key={i} />
      ))}
    </div>
  );
}
