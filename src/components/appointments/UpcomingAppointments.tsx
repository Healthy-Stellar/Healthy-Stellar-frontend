'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, updateAppointmentStatus } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';
import { Appointment } from '@/types';

const STATUS_STYLES: Record<Appointment['status'], string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function AppointmentItem({ appt }: { appt: Appointment }) {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => updateAppointmentStatus(appt.id, 'cancelled'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patient-appointments'] }),
  });

  const canCancel = appt.status === 'pending' || appt.status === 'confirmed';

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="font-medium text-slate-900">Dr. {appt.doctorName}</p>
        <p className="text-xs text-slate-500">
          {new Date(appt.datetime).toLocaleString()} · {appt.type}
        </p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
          {appt.status}
        </span>
      </div>
      {canCancel && (
        <button
          onClick={() => cancelMutation.mutate()}
          disabled={cancelMutation.isPending}
          className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {cancelMutation.isPending ? 'Cancelling…' : 'Cancel'}
        </button>
      )}
    </div>
  );
}

export default function UpcomingAppointments() {
  const { publicKey } = useWalletStore();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['patient-appointments', publicKey],
    queryFn: () => fetchAppointments(publicKey!, 'patient'),
    enabled: !!publicKey,
  });

  const upcoming = appointments?.filter((a) => a.status !== 'cancelled' && a.status !== 'completed') ?? [];

  if (isLoading) return <div className="animate-pulse h-24 rounded-xl bg-slate-200" />;

  if (upcoming.length === 0) return (
    <p className="text-sm text-slate-400 text-center py-4">No upcoming appointments.</p>
  );

  return (
    <div className="space-y-3">
      {upcoming.map((appt) => (
        <AppointmentItem key={appt.id} appt={appt} />
      ))}
    </div>
  );
}
