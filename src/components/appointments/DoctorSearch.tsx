'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors } from '@/services/api.service';
import { Doctor } from '@/types';

const SPECIALTIES = ['All', 'General', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'];

interface Props {
  onSelect: (doctor: Doctor) => void;
}

export default function DoctorSearch({ onSelect }: Props) {
  const [specialty, setSpecialty] = useState('');

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', specialty],
    queryFn: () => fetchDoctors(specialty || undefined),
  });

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s === 'All' ? '' : s)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              (s === 'All' && !specialty) || specialty === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse h-16 rounded-xl bg-slate-200" />
          ))}
        </div>
      )}

      {!isLoading && doctors?.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">No doctors found for this specialty.</p>
      )}

      {!isLoading && doctors && doctors.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc)}
              className="text-left rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-slate-900">{doc.name}</p>
              <p className="text-xs text-slate-500">{doc.specialty}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
