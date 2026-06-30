'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, updateAppointmentStatus } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';
import { Appointment } from '@/types';
import { Calendar, Clock } from 'lucide-react';

const STATUS_COLORS: Record<Appointment['status'], string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => updateAppointmentStatus(appointment.id, 'cancelled'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patient-appointments'] }),
  });

  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-slate-900">Dr. {appointment.doctorName}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {new Date(appointment.datetime).toLocaleString()} · {appointment.type}
          </p>
          {appointment.notes && (
            <p className="text-xs text-slate-400 mt-1 italic">{appointment.notes}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[appointment.status]}`}>
          {appointment.status}
        </span>
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
    </div>
  );
}

export default function PatientAppointmentsPage() {
  const { publicKey } = useWalletStore();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['patient-appointments', publicKey],
    queryFn: () => fetchAppointments(publicKey!, 'patient'),
    enabled: !!publicKey,
  });

  const upcoming = appointments?.filter(
    (a) => a.status !== 'cancelled' && a.status !== 'completed'
  ) ?? [];

  const past = appointments?.filter(
    (a) => a.status === 'cancelled' || a.status === 'completed'
  ) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-20 rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your scheduled appointments</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">
            No upcoming appointments.
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Past ({past.length})
          </h2>
          <div className="space-y-3 opacity-70">
            {past.map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
