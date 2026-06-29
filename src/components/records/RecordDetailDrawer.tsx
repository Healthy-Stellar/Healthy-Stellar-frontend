'use client';

import { MedicalRecord } from '@/types';

interface Props {
  record: MedicalRecord;
  onClose: () => void;
}

export default function RecordDetailDrawer({ record, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="record-detail-title">
      <div
        className="h-full w-full max-w-md bg-[--bg-card] shadow-xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="record-detail-title" className="text-lg font-semibold text-[--text-1]">Record Details</h2>
          <button onClick={onClose} aria-label="Close record details" className="text-[--text-3] hover:text-[--text-1] text-2xl leading-none">&times;</button>
        </div>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-[--text-2]">Date</dt>
            <dd className="mt-1 text-[--text-1]">{new Date(record.date).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-[--text-2]">Doctor</dt>
            <dd className="mt-1 text-[--text-1]">{record.doctorName}</dd>
          </div>
          <div>
            <dt className="font-medium text-[--text-2]">Diagnosis</dt>
            <dd className="mt-1 text-[--text-1]">{record.diagnosis}</dd>
          </div>
          {record.prescription && (
            <div>
              <dt className="font-medium text-[--text-2]">Prescription</dt>
              <dd className="mt-1 text-[--text-1]">{record.prescription}</dd>
            </div>
          )}
          {record.notes && (
            <div>
              <dt className="font-medium text-[--text-2]">Notes</dt>
              <dd className="mt-1 text-[--text-1] whitespace-pre-wrap">{record.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
