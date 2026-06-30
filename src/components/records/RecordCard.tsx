'use client';

import { useState } from 'react';
import { MedicalRecord } from '@/types';
import { shareRecord } from '@/services/api.service';
import RecordDetailDrawer from './RecordDetailDrawer';
import { useToast } from '@/hooks/useToast';

interface Props {
  record: MedicalRecord;
}

export default function RecordCard({ record }: Props) {
  const { toast } = useToast();
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
      toast('Failed to generate share token.', 'error');
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <div className="card">
        <p className="text-xs text-[--text-3]">{new Date(record.date).toLocaleDateString()}</p>
        <p className="mt-1 font-semibold text-[--text-1]">{record.diagnosis}</p>
        <p className="text-sm text-[--text-2]">Dr. {record.doctorName}</p>

        {shareInfo && (
          <div className="mt-2 rounded-md bg-[--green-subtle] p-2 text-xs text-[--green]">
            Token: <span className="font-mono break-all">{shareInfo.token}</span>
            <br />Expires: {new Date(shareInfo.expiresAt).toLocaleString()}
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowDrawer(true)}
            className="btn-primary !text-xs !px-3 !py-1.5"
          >
            View
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="rounded-md border border-[--border] px-3 py-1.5 text-xs font-medium text-[--text-2] hover:bg-[--bg-hover] disabled:opacity-50"
          >
            {sharing ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>

      {showDrawer && <RecordDetailDrawer record={record} onClose={() => setShowDrawer(false)} />}
    </>
  );
}
