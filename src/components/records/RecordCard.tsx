'use client';

import { useState } from 'react';
import { MedicalRecord } from '@/types';
import { shareRecord } from '@/services/api.service';
import RecordDetailDrawer from './RecordDetailDrawer';

interface Props {
  record: MedicalRecord;
}

export default function RecordCard({ record }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareInfo, setShareInfo] = useState<{ token: string; expiresAt: string } | null>(null);

  async function handleShare() {
    const provider = prompt('Enter provider Stellar address:');
    if (!provider) return;
    setSharing(true);
    try {
      const result = await shareRecord(record.id, provider);
      setShareInfo({ token: result.token, expiresAt: result.expiresAt });
    } catch {
      alert('Failed to generate share token.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs text-slate-400">{new Date(record.date).toLocaleDateString()}</p>
        <p className="mt-1 font-semibold text-slate-900">{record.diagnosis}</p>
        <p className="text-sm text-slate-500">Dr. {record.doctorName}</p>

        {shareInfo && (
          <div className="mt-2 rounded-md bg-green-50 p-2 text-xs text-green-700">
            Token: <span className="font-mono break-all">{shareInfo.token}</span>
            <br />Expires: {new Date(shareInfo.expiresAt).toLocaleString()}
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowDrawer(true)}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
          >
            View
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {sharing ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>

      {showDrawer && <RecordDetailDrawer record={record} onClose={() => setShowDrawer(false)} />}
    </>
  );
}
