'use client';

import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RecordCard from '@/components/records/RecordCard';
import { RecordSkeleton } from '@/components/records/RecordSkeleton';
import { fetchRecords } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';

function PatientDashboardContent() {
  const { publicKey } = useWalletStore();

  const { data: records, isLoading, isError } = useQuery({
    queryKey: ['records', publicKey],
    queryFn: () => fetchRecords(publicKey!),
    enabled: !!publicKey,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Medical Records</h1>

      {isError && (
        <p className="text-red-600 text-sm">Failed to load records. Please try again.</p>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <RecordSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && records?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <p className="text-4xl mb-3">🗂️</p>
          <p className="font-medium text-slate-700">No medical records yet</p>
          <p className="text-sm text-slate-400 mt-1">Your records will appear here once a doctor adds them.</p>
        </div>
      )}

      {!isLoading && records && records.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="PATIENT">
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}
