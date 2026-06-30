'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkImportRecords } from '@/services/api.service';
import { useToast } from '@/hooks/useToast';
import { BulkImportResponse } from '@/types';
import { parseCSV, parseFHIR, validateRow, PreviewRow } from '@/lib/bulkRecordParser';
import { Upload, FileText, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  patientAddress: string;
  onComplete?: (result: BulkImportResponse) => void;
}

const ACCEPTED_FORMATS = '.csv,.json';

export default function BulkRecordImport({ patientAddress, onComplete }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parseProgress, setParseProgress] = useState<'idle' | 'parsing' | 'ready'>('idle');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!preview) throw new Error('No records to import');
      const validRecords = preview.filter((r) => r._valid).map(({ _row, _valid, _errors, ...r }) => r);
      if (validRecords.length === 0) throw new Error('No valid records to import.');
      return bulkImportRecords(patientAddress, validRecords);
    },
    onSuccess: (result) => {
      toast(`Import completed: ${result.imported} imported, ${result.failed} failed.`, 'success');
      queryClient.invalidateQueries({ queryKey: ['encryptedRecords', patientAddress] });
      onComplete?.(result);
    },
    onError: (err: Error) => {
      toast(err.message || 'Import failed. Please try again.', 'error');
    },
  });

  const handleFile = useCallback(
    async (file: File) => {
      setParseProgress('parsing');
      setFileName(file.name);
      setPreview(null);
      try {
        const text = await file.text();
        let rows;
        if (file.name.endsWith('.csv')) {
          rows = parseCSV(text);
        } else if (file.name.endsWith('.json')) {
          rows = parseFHIR(JSON.parse(text));
        } else {
          throw new Error('Unsupported file format.');
        }
        if (rows.length === 0) {
          throw new Error('No records found in the uploaded file.');
        }
        const validated = rows.map(validateRow);
        setPreview(validated);
        setParseProgress('ready');
        toast(`Parsed ${validated.length} records.`, 'info');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to parse file.';
        toast(msg, 'error');
        setParseProgress('idle');
        setFileName('');
      }
    },
    [toast]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearPreview() {
    setPreview(null);
    setFileName('');
    setParseProgress('idle');
    if (inputRef.current) inputRef.current.value = '';
  }

  const validCount = preview?.filter((r) => r._valid).length ?? 0;
  const errorCount = preview ? preview.length - validCount : 0;
  const busy = mutation.isPending;


  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
             style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)' }}>
          <Upload className="w-4 h-4" style={{ color: '#00C896' }} />
        </div>
        <div>
          <p className="font-medium text-slate-900">Bulk Import Medical Records</p>
          <p className="text-xs text-slate-400">Upload a CSV or FHIR JSON file with your records</p>
        </div>
      </div>

      {!preview && (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={parseProgress === 'parsing'}
            className="w-full rounded-lg border-2 border-dashed border-slate-200 py-8 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/30 transition-colors disabled:opacity-50"
          >
            {parseProgress === 'parsing' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-sm text-slate-500">Parsing file…</span>
              </>
            ) : (
              <>
                <FileText className="w-6 h-6 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Click to choose file</span>
                <span className="text-xs text-slate-400">CSV or FHIR JSON accepted</span>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_FORMATS}
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}

      {preview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">{fileName}</span>
              <span className="text-slate-400">—</span>
              <span className="text-slate-600">{preview.length} records</span>
              {errorCount > 0 && (
                <span className="text-red-500 text-xs">({errorCount} with errors)</span>
              )}
            </div>
            <button onClick={clearPreview} className="p-1 rounded hover:bg-slate-200 transition-colors" aria-label="Clear file">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {errorCount > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs font-medium text-red-700 mb-1">Field mapping errors:</p>
              <ul className="space-y-0.5">
                {preview.filter((r) => !r._valid).slice(0, 5).map((r) => (
                  <li key={r._row} className="text-xs text-red-600">
                    Row {r._row}: {r._errors.join(', ')}
                  </li>
                ))}
                {errorCount > 5 && (
                  <li className="text-xs text-red-500">…and {errorCount - 5} more rows with errors</li>
                )}
              </ul>
            </div>
          )}

          <div className="overflow-x-auto max-h-60 overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">#</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Date</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Doctor</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Diagnosis</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {preview.map((row) => (
                  <tr key={row._row} className={row._valid ? '' : 'bg-red-50'}>
                    <td className="px-3 py-2 text-slate-400">{row._row}</td>
                    <td className="px-3 py-2 text-slate-700">{row.date || '—'}</td>
                    <td className="px-3 py-2 text-slate-700">{row.doctorName || '—'}</td>
                    <td className="px-3 py-2 text-slate-700 max-w-[200px] truncate">{row.diagnosis || '—'}</td>
                    <td className="px-3 py-2">
                      {row._valid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearPreview}
              disabled={busy}
              className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={busy || validCount === 0}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing…
                </>
              ) : (
                `Import ${validCount} Record${validCount !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
