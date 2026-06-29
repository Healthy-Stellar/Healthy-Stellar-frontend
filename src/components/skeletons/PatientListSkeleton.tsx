'use client';

/**
 * Skeleton loader for a single patient / record list item.
 * Matches the patient row shape used in doctor and patient dashboards.
 */
export function PatientListSkeleton() {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-[10px] animate-pulse"
      style={{ background: 'var(--bg-inset)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--bg-card)' }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-1/3 rounded" style={{ background: 'var(--bg-card)' }} />
        <div className="h-2.5 w-1/5 rounded" style={{ background: 'var(--bg-card)' }} />
      </div>
      <div className="h-5 w-14 rounded-full shrink-0" style={{ background: 'var(--bg-card)' }} />
    </div>
  );
}

/**
 * A list of patient list skeletons.
 */
export function PatientListSkeletonGroup({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <PatientListSkeleton key={i} />
      ))}
    </div>
  );
}
