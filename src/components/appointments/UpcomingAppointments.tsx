'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, cancelAppointment } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';

export default function UpcomingAppointments() {
  const { publicKey } = useWalletStore();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['patient-appointments', publicKey],
    queryFn: () => fetchAppointments(publicKey!, 'patient'),
    enabled: !!publicKey,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patient-appointments'] }),
  });

  const upcoming = appointments?.filter((a) => a.status !== 'cancelled' && a.status !== 'completed') ?? [];

  if (isLoading) return <div className="animate-pulse h-24 rounded-xl bg-slate-200" />;

  if (upcoming.length === 0) return (
    <p className="text-sm text-slate-400 text-center py-4">No upcoming appointments.</p>
  );

  return (
    <div className="space-y-3">
      {upcoming.map((appt) => (
        <div key={appt.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <p className="font-medium text-slate-900">Dr. {appt.doctorName}</p>
            <p className="text-xs text-slate-500">
              {new Date(appt.datetime).toLocaleString()} · {appt.type}
            </p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {appt.status}
            </span>
          </div>
          <button
            onClick={() => cancelMutation.mutate(appt.id)}
            disabled={cancelMutation.isPending}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
