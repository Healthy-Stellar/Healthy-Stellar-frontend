'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSlots } from '@/services/api.service';
import { TimeSlot } from '@/types';

interface Props {
  doctorId: string;
  selected: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

function groupByDate(slots: TimeSlot[]) {
  return slots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    const date = new Date(slot.datetime).toLocaleDateString();
    (acc[date] ??= []).push(slot);
    return acc;
  }, {});
}

export default function SlotPicker({ doctorId, selected, onSelect }: Props) {
  const { data: slots, isLoading } = useQuery({
    queryKey: ['slots', doctorId],
    queryFn: () => fetchSlots(doctorId),
  });

  if (isLoading) return <div className="animate-pulse h-32 rounded-xl bg-slate-200" />;

  const grouped = groupByDate(slots?.filter((s) => s.available) ?? []);
  const dates = Object.keys(grouped);

  if (dates.length === 0) return <p className="text-sm text-slate-400">No available slots.</p>;

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <p className="text-xs font-medium text-slate-500 mb-2">{date}</p>
          <div className="flex flex-wrap gap-2">
            {grouped[date].map((slot) => (
              <button
                key={slot.id}
                onClick={() => onSelect(slot)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selected?.id === slot.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {new Date(slot.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
