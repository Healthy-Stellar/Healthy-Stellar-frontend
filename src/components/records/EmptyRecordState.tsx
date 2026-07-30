'use client';

import React from 'react';
import { FileText, ShieldCheck, UploadCloud, UserCheck, Database, Plus } from 'lucide-react';

interface EmptyRecordStateProps {
  onAddRecord?: () => void;
  onManageAccess?: () => void;
  showActions?: boolean;
}

export function EmptyRecordState({
  onAddRecord,
  onManageAccess,
  showActions = true,
}: EmptyRecordStateProps) {
  return (
    <div
      className="p-8 sm:p-10 text-center rounded-[14px]"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Icon Badge */}
      <div
        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5"
        style={{
          background: 'rgba(0, 200, 150, 0.08)',
          border: '1px solid rgba(0, 200, 150, 0.2)',
        }}
      >
        <FileText className="w-8 h-8" style={{ color: '#00C896' }} />
      </div>

      {/* Main Message */}
      <h3 className="text-lg font-semibold text-text-1 mb-2">
        No Medical Records Found
      </h3>
      <p className="text-xs text-text-3 max-w-md mx-auto mb-8 leading-relaxed">
        Your Stellar-secured medical ledger is empty. Medical records are encrypted off-chain and referenced immutably on the Stellar blockchain for verified access.
      </p>

      {/* Guidance: How records get added */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left max-w-3xl mx-auto">
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'var(--bg-inset, rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 shrink-0" style={{ color: '#00C896' }} />
            <h4 className="text-xs font-semibold text-text-1">Provider Issuance</h4>
          </div>
          <p className="text-2xs text-text-3 leading-relaxed">
            Your healthcare provider creates and cryptographically signs records after consultations or lab tests.
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: 'var(--bg-inset, rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <UploadCloud className="w-4 h-4 shrink-0" style={{ color: '#00C896' }} />
            <h4 className="text-xs font-semibold text-text-1">Encrypted Upload</h4>
          </div>
          <p className="text-2xs text-text-3 leading-relaxed">
            Upload your own lab reports, prescriptions, or PDFs. Files are client-encrypted before storage.
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: 'var(--bg-inset, rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 shrink-0" style={{ color: '#00C896' }} />
            <h4 className="text-xs font-semibold text-text-1">Bulk EHR Import</h4>
          </div>
          <p className="text-2xs text-text-3 leading-relaxed">
            Import existing electronic health record history from external clinic integrations in batch format.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onAddRecord}
            className="btn-primary rounded-[9px] text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Record
          </button>
          <button
            onClick={onManageAccess}
            className="btn-secondary rounded-[9px] text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Manage Access Grants
          </button>
        </div>
      )}
    </div>
  );
}

export default EmptyRecordState;
