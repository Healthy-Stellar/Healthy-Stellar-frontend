'use client';

import { KpiGridSkeleton } from './KpiSkeleton';
import { AppointmentListSkeleton } from './AppointmentSkeleton';
import { PatientListSkeletonGroup } from './PatientListSkeleton';

/**
 * Section header skeleton (title + subtitle).
 */
function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-1">
        <div className="h-4 w-28 rounded" style={{ background: 'var(--bg-inset)' }} />
        <div className="h-3 w-36 rounded" style={{ background: 'var(--bg-inset)' }} />
      </div>
    </div>
  );
}

/**
 * A card panel skeleton (for section wrappers).
 */
function PanelSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] overflow-hidden animate-pulse"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {children}
    </div>
  );
}

/**
 * Full-page dashboard skeleton that matches the dashboard layout.
 * Uses all the specific skeleton sub-components.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <KpiGridSkeleton count={4} />

      {/* Two-column section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column — patient list */}
        <PanelSkeleton>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeaderSkeleton />
          </div>
          <div className="p-4">
            <PatientListSkeletonGroup count={4} />
          </div>
        </PanelSkeleton>

        {/* Right column — appointments */}
        <PanelSkeleton>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeaderSkeleton />
          </div>
          <div className="p-4">
            <AppointmentListSkeleton count={3} />
          </div>
        </PanelSkeleton>
      </div>

      {/* Bottom activity panel */}
      <PanelSkeleton>
        <div className="px-5 py-4 flex items-center justify-between"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeaderSkeleton />
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg" style={{ background: 'var(--bg-inset)' }} />
                <div className="space-y-1.5">
                  <div className="h-3 w-36 rounded" style={{ background: 'var(--bg-inset)' }} />
                  <div className="h-2.5 w-20 rounded" style={{ background: 'var(--bg-inset)' }} />
                </div>
              </div>
              <div className="h-3 w-12 rounded" style={{ background: 'var(--bg-inset)' }} />
            </div>
          ))}
        </div>
      </PanelSkeleton>
    </div>
  );
}
