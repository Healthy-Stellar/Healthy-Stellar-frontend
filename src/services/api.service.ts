import axios from 'axios';
import { MedicalRecord, ShareToken, Doctor, TimeSlot, Appointment, NewRecordPayload } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Medical Records
export const fetchRecords = (patientAddress: string) =>
  api.get<MedicalRecord[]>('/records', { params: { patientAddress } }).then((r) => r.data);

export const shareRecord = (recordId: string, providerAddress: string) =>
  api.post<ShareToken>(`/records/${recordId}/share`, { providerAddress }).then((r) => r.data);

// Doctors & Slots
export const fetchDoctors = (specialty?: string) =>
  api.get<Doctor[]>('/doctors', { params: specialty ? { specialty } : {} }).then((r) => r.data);

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
