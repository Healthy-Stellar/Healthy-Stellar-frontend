'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RecordCard from '@/components/records/RecordCard';
import { RecordSkeleton } from '@/components/records/RecordSkeleton';
import MedicalRecordUpload from '@/components/records/MedicalRecordUpload';
import { fetchRecords } from '@/services/api.service';
import { useWalletStore } from '@/store/useWalletStore';
import { EncryptedRecord } from '@/types';

function PatientDashboardContent() {
  const { publicKey } = useWalletStore();
  const queryClient = useQueryClient();
  const [optimisticRecords, setOptimisticRecords] = useState<EncryptedRecord[]>([]);

  const { data: records, isLoading, isError } = useQuery({
    queryKey: ['records', publicKey],
    queryFn: () => fetchRecords(publicKey!),
    enabled: !!publicKey,
  });

  function handleUploaded(record: EncryptedRecord) {
    setOptimisticRecords((prev) => [record, ...prev]);
    queryClient.invalidateQueries({ queryKey: ['records', publicKey] });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Medical Records</h1>

      {publicKey && (
        <div className="mb-8">
          <MedicalRecordUpload patientAddress={publicKey} onUploaded={handleUploaded} />
        </div>
      )}

      {isError && (
        <p className="text-red-600 text-sm">Failed to load records. Please try again.</p>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <RecordSkeleton key={i} />)}
        </div>
      )}

      {optimisticRecords.length > 0 && (
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          {optimisticRecords.map((r) => (
            <div key={r.id} className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
              <p className="font-semibold text-green-800 truncate">{r.fileName}</p>
              <p className="text-xs text-green-600 mt-1 font-mono break-all">{r.contentHash}</p>
              <p className="text-xs text-green-500 mt-1">Uploaded just now · encrypted</p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && records?.length === 0 && optimisticRecords.length === 0 && (
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
