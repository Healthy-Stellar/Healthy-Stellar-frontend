'use client';

import { Appointment } from '@/types';

interface Props {
  appointment: Appointment;
  onDone: () => void;
}

function buildICS(appt: Appointment): string {
  const start = new Date(appt.datetime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Appointment with Dr. ${appt.doctorName}`,
    `DESCRIPTION:Type: ${appt.type}`,
    `UID:${appt.id}@healthystellar`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function BookingConfirmation({ appointment, onDone }: Props) {
  function downloadICS() {
    const blob = new Blob([buildICS(appointment)], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-center text-center py-12 px-4">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
      <p className="text-sm text-slate-500 mb-1">
        Appointment with <span className="font-medium">Dr. {appointment.doctorName}</span>
      </p>
      <p className="text-sm text-slate-500 mb-1">
        {new Date(appointment.datetime).toLocaleString()} · {appointment.type}
      </p>
      <p className="text-xs text-slate-400 mb-6">Ref: {appointment.id}</p>

      <div className="flex gap-3">
        <button
          onClick={downloadICS}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          📅 Add to Calendar
        </button>
        <button
          onClick={onDone}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Done
        </button>
      </div>
    </div>
  );
}
