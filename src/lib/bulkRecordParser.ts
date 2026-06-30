import { BulkRecordImportRow } from '@/types';

export function parseCSV(text: string): BulkRecordImportRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error('CSV file must have a header row and at least one data row.');

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const dateIdx = headers.findIndex((h) => h === 'date');
  const doctorIdx = headers.findIndex((h) => h === 'doctorname' || h === 'doctor' || h === 'doctor_name');
  const diagnosisIdx = headers.findIndex((h) => h === 'diagnosis');
  const prescriptionIdx = headers.findIndex((h) => h === 'prescription');
  const notesIdx = headers.findIndex((h) => h === 'notes');

  if (dateIdx === -1 || doctorIdx === -1 || diagnosisIdx === -1) {
    throw new Error(
      'CSV must contain at least "date", "doctorName", and "diagnosis" columns. Found: ' +
        headers.join(', ')
    );
  }

  const records: BulkRecordImportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    records.push({
      date: cols[dateIdx] || '',
      doctorName: cols[doctorIdx] || '',
      diagnosis: cols[diagnosisIdx] || '',
      prescription: prescriptionIdx >= 0 ? cols[prescriptionIdx] || '' : undefined,
      notes: notesIdx >= 0 ? cols[notesIdx] || '' : undefined,
    });
  }
  return records;
}

export function parseFHIR(json: Record<string, unknown>): BulkRecordImportRow[] {
  const entries = (json.entry as Array<Record<string, unknown>>) ?? [];
  if (entries.length === 0) {
    throw new Error('FHIR bundle contains no entries.');
  }

  return entries.map((entry) => {
    const resource = entry.resource as Record<string, unknown> | undefined;
    const codeText =
      ((resource?.code as Record<string, unknown>)?.coding as Array<Record<string, unknown>>)?.[0]
        ?.display as string | undefined;

    return {
      date: (resource?.date as string) || '',
      doctorName: (resource?.performer as Array<Record<string, unknown>>)?.[0]?.display as string || '',
      diagnosis: codeText || ((resource?.reasonCode as Array<Record<string, unknown>>)?.[0]?.text as string) || '',
      notes: (resource?.note?.[0]?.text as string) || undefined,
    };
  });
}

export interface PreviewRow extends BulkRecordImportRow {
  _row: number;
  _valid: boolean;
  _errors: string[];
}

export function validateRow(row: BulkRecordImportRow, idx: number): PreviewRow {
  const errors: string[] = [];
  if (!row.date) errors.push('Missing date');
  if (!row.doctorName) errors.push('Missing doctorName');
  if (!row.diagnosis) errors.push('Missing diagnosis');
  return { ...row, _row: idx + 1, _valid: errors.length === 0, _errors: errors };
}
