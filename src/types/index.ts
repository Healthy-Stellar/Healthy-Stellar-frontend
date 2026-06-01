export type UserRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL' | 'ADMIN';

export interface User {
  id: string;
  address: string;
  role: UserRole;
  name: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  patientAddress: string;
}

export interface ShareToken {
  token: string;
  expiresAt: string;
  providerAddress: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: string;
}

export interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientAddress: string;
  patientName?: string;
  datetime: string;
  type: 'in-person' | 'telemedicine';
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  fee: number;
  txHash?: string;
}

export interface NewRecordPayload {
  patientAddress: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
}

export interface EncryptedRecord {
  id: string;
  patientAddress: string;
  fileName: string;
  fileType: string;
  contentHash: string;
  encryptedMetadataPointer: string;
  uploadedAt: string;
  txHash?: string;
}

export interface UploadEncryptedRecordPayload {
  patientAddress: string;
  fileName: string;
  fileType: string;
  encryptedFile: ArrayBuffer;
  iv: Uint8Array;
  exportedKey: ArrayBuffer;
}
