import axios from 'axios';
import { MedicalRecord, ShareToken, Doctor, TimeSlot, Appointment, NewRecordPayload, EncryptedRecord, StaffMember, PatientAdmission, HospitalMetrics, ComplianceReport } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

// Medical Records
export const fetchRecords = (patientAddress: string) =>
  api.get<MedicalRecord[]>('/records', { params: { patientAddress } }).then((r) => r.data);

export const fetchRecordsPaginated = (patientAddress: string, cursor?: string, limit = 10) =>
  api.get<PaginatedResponse<MedicalRecord>>('/records', {
    params: { patientAddress, cursor, limit },
  }).then((r) => r.data);

export const shareRecord = (recordId: string, providerAddress: string) =>
  api.post<ShareToken>(`/records/${recordId}/share`, { providerAddress }).then((r) => r.data);

// Doctors & Slots
export const fetchDoctors = (specialty?: string, signal?: AbortSignal) =>
  api.get<Doctor[]>('/doctors', { params: specialty ? { specialty } : {}, signal }).then((r) => r.data);

export const fetchDoctorPatientsPaginated = (doctorAddress: string, cursor?: string, limit = 10) =>
  api.get<PaginatedResponse<{ name: string; initials: string; age: number; lastVisit: string; status: string; records: number; addr: string }>>('/doctors/patients', {
    params: { doctorAddress, cursor, limit },
  }).then((r) => r.data);

export const fetchSlots = (doctorId: string) =>
  api.get<TimeSlot[]>(`/doctors/${doctorId}/slots`).then((r) => r.data);

// Appointments
export const fetchAppointments = (address: string, role: 'patient' | 'doctor') =>
  api.get<Appointment[]>('/appointments', { params: { address, role } }).then((r) => r.data);

export const createAppointment = (payload: Omit<Appointment, 'id' | 'status' | 'txHash'>) =>
  api.post<Appointment>('/appointments', payload).then((r) => r.data);

export const cancelAppointment = (id: string) =>
  api.patch<Appointment>(`/appointments/${id}/cancel`).then((r) => r.data);

export const updateAppointmentStatus = (id: string, status: Appointment['status']) =>
  api.patch<Appointment>(`/appointments/${id}/status`, { status }).then((r) => r.data);

// Doctor — create medical record
export const createRecord = (payload: NewRecordPayload) =>
  api.post<MedicalRecord>('/records', payload).then((r) => r.data);

export default api;

// Encrypted record upload
export const uploadEncryptedRecord = (formData: FormData) =>
  api.post<EncryptedRecord>('/records/encrypted', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

// Hospital — metrics, staff, admissions, compliance
export const fetchHospitalMetrics = (hospitalAddress: string) =>
  api.get<HospitalMetrics>('/hospital/metrics', { params: { hospitalAddress } }).then((r) => r.data);

export const fetchStaff = (hospitalAddress: string) =>
  api.get<StaffMember[]>('/hospital/staff', { params: { hospitalAddress } }).then((r) => r.data);

export const fetchAdmissions = (hospitalAddress: string) =>
  api.get<PatientAdmission[]>('/hospital/admissions', { params: { hospitalAddress } }).then((r) => r.data);

export const fetchComplianceReports = (hospitalAddress: string) =>
  api.get<ComplianceReport[]>('/hospital/compliance', { params: { hospitalAddress } }).then((r) => r.data);

export const bulkUpdateStaff = (
  hospitalAddress: string,
  staffIds: string[],
  action: 'activate' | 'deactivate' | 'remove'
) =>
  api.post('/hospital/staff/bulk', { hospitalAddress, staffIds, action }).then((r) => r.data);
