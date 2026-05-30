'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '@/types';
import { updateAppointmentStatus } from '@/services/api.service';
import NewRecordForm from './NewRecordForm';
import RecordDetailDrawer from '@/components/records/RecordDetailDrawer';
import { fetchRecords } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';

interface Props {
  appointment: Appointment;
}

const STATUS_COLORS: Record<Appointment['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AppointmentCard({ appointment }: Props) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<import('@/types').MedicalRecord | null>(null);

  const { data: patientRecords } = useQuery({
    queryKey: ['patient-records', appointment.patientAddress],
    queryFn: () => fetchRecords(appointment.patientAddress),
    enabled: expanded,
  });

  const statusMutation = useMutation({
    mutationFn: (status: Appointment['status']) => updateAppointmentStatus(appointment.id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] }),
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <p className="font-semibold text-slate-900">{appointment.patientName ?? appointment.patientAddress.slice(0, 8) + '…'}</p>
          <p className="text-xs text-slate-500">
            {new Date(appointment.datetime).toLocaleString()} · {appointment.type}
          </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 space-y-4">
          {/* Status actions */}
          {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
            <div className="flex gap-2">
              {appointment.status === 'pending' && (
                <button
                  onClick={() => statusMutation.mutate('confirmed')}
                  disabled={statusMutation.isPending}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  Confirm
                </button>
              )}
              {appointment.status === 'confirmed' && (
                <button
                  onClick={() => statusMutation.mutate('completed')}
                  disabled={statusMutation.isPending}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500 disabled:opacity-50"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => statusMutation.mutate('cancelled')}
                disabled={statusMutation.isPending}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Patient medical history */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Patient History</p>
            {!patientRecords && <p className="text-xs text-slate-400">Loading…</p>}
            {patientRecords?.length === 0 && <p className="text-xs text-slate-400">No records found.</p>}
            {patientRecords && patientRecords.length > 0 && (
              <ul className="space-y-1">
                {patientRecords.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedRecord(r)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {new Date(r.date).toLocaleDateString()} — {r.diagnosis}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* New record form */}
          <div>
            <button
              onClick={() => setShowRecordForm((v) => !v)}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              {showRecordForm ? 'Hide form' : '+ Add Medical Record'}
            </button>
            {showRecordForm && (
              <div className="mt-3">
                <NewRecordForm
                  patientAddress={appointment.patientAddress}
                  onSuccess={() => setShowRecordForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {selectedRecord && (
        <RecordDetailDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}
