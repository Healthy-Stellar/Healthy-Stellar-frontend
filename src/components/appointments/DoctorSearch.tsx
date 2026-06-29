'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors } from '@/services/api.service';
import { Doctor } from '@/types';
import { Loader2 } from 'lucide-react';

const SPECIALTIES = ['All', 'General', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'];
const DEBOUNCE_MS = 300;

interface Props {
  onSelect: (doctor: Doctor) => void;
}

export default function DoctorSearch({ onSelect }: Props) {
  const [specialty, setSpecialty] = useState('');
  const [debouncedSpecialty, setDebouncedSpecialty] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const spinnerTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSpecialtyChange = useCallback((value: string) => {
    setSpecialty(value);
    setShowSpinner(false);

    clearTimeout(debounceTimer.current);
    clearTimeout(spinnerTimer.current);

    spinnerTimer.current = setTimeout(() => setShowSpinner(true), DEBOUNCE_MS);

    debounceTimer.current = setTimeout(() => {
      setDebouncedSpecialty(value);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimer.current);
      clearTimeout(spinnerTimer.current);
    };
  }, []);

  const { data: doctors, isLoading, isFetching } = useQuery({
    queryKey: ['doctors', debouncedSpecialty],
    queryFn: ({ signal }) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const combinedSignal = signal;
      controller.signal.addEventListener('abort', () => {
        // no-op: query cancellation handled by React Query
      });

      return fetchDoctors(debouncedSpecialty || undefined, combinedSignal);
    },
  });

  const loading = isLoading || (isFetching && showSpinner);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => handleSpecialtyChange(s === 'All' ? '' : s)}
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

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="col-span-full flex items-center justify-center py-8 gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching doctors…
          </div>
        </div>
      )}

      {!loading && doctors?.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">No doctors found for this specialty.</p>
      )}

      {!loading && doctors && doctors.length > 0 && (
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
