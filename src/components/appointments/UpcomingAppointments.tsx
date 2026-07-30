'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, cancelAppointment } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';
import { withVideoRoom, isVideoLinkActive } from '@/lib/video';
import { useToast } from '@/hooks/useToast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { Appointment } from '@/types';

export default function UpcomingAppointments() {
  const { publicKey } = useWalletStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['patient-appointments', publicKey],
    queryFn: () => fetchAppointments(publicKey!, 'patient'),
    enabled: !!publicKey,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-appointments', publicKey] });
      toast('Appointment cancelled', 'success');
      setAppointmentToCancel(null);
    },
    onError: () => {
      toast('Failed to cancel appointment', 'error');
    },
  });

  const upcoming =
    appointments?.filter((a) => a.status !== 'cancelled' && a.status !== 'completed') ?? [];

  if (isLoading) return <div className="animate-pulse h-24 rounded-xl bg-surface-card" />;

  if (upcoming.length === 0)
    return <p className="text-sm text-text-3 text-center py-4">No upcoming appointments.</p>;

  return (
    <div className="space-y-3">
      {upcoming.map((appt) => (
        <div
          key={appt.id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface-card p-4"
        >
          <div>
            <p className="font-medium text-text-1">Dr. {appt.doctorName}</p>
            <p className="text-xs text-text-2">
              {new Date(appt.datetime).toLocaleString()} · {appt.type}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                appt.status === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {appt.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {appt.type === 'telemedicine' && isVideoLinkActive(appt) && (
              <a
                href={appt.videoRoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Join Video Call
              </a>
            )}
            <button
              onClick={() => setAppointmentToCancel(appt)}
              disabled={cancelMutation.isPending}
              className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ))}

      {appointmentToCancel && (
        <ConfirmDialog
          title="Cancel appointment"
          message={`Are you sure you want to cancel your appointment with Dr. ${appointmentToCancel.doctorName}?`}
          confirmLabel="Cancel appointment"
          cancelLabel="Keep appointment"
          isLoading={cancelMutation.isPending}
          onConfirm={() => cancelMutation.mutate(appointmentToCancel.id)}
          onCancel={() => setAppointmentToCancel(null)}
        />
      )}
    </div>
  );
}
