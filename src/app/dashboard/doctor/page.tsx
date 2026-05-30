'use client';

import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppointmentCard from '@/components/doctor/AppointmentCard';
import { fetchAppointments } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';

function DoctorDashboardContent() {
  const { publicKey } = useWalletStore();

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['doctor-appointments', publicKey],
    queryFn: () => fetchAppointments(publicKey!, 'doctor'),
    enabled: !!publicKey,
  });

  const upcoming = appointments?.filter((a) => a.status !== 'cancelled' && a.status !== 'completed') ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Doctor Dashboard</h1>

      {isError && (
        <p className="text-sm text-red-600">Failed to load appointments. Please try again.</p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-20 rounded-xl bg-slate-200" />
          ))}
        </div>
      )}

      {!isLoading && upcoming.length === 0 && !isError && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium text-slate-700">No upcoming appointments</p>
          <p className="text-sm text-slate-400 mt-1">New bookings will appear here.</p>
        </div>
      )}

      {!isLoading && upcoming.length > 0 && (
        <div className="space-y-3">
          {upcoming.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <DoctorDashboardContent />
    </ProtectedRoute>
  );
}
