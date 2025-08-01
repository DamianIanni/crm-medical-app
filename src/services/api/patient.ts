// src/services/api/patient.ts
import { request } from './http';

export interface PatientPayload {
  firstName: string;
  lastName: string;
  [key: string]: any;
}

export async function createPatient(centerId: string | number, data: PatientPayload) {
  return request({
    url: `/${centerId}/patients/`,
    method: 'POST',
    data,
  });
}

export async function getAllPatients(centerId: string | number) {
  return request({
    url: `/${centerId}/patients/all`,
    method: 'GET',
  });
}

export async function getPatientById(centerId: string | number, userId: string | number) {
  return request({
    url: `/${centerId}/patients/${userId}`,
    method: 'GET',
  });
}

export async function updatePatient(centerId: string | number, patientId: string | number, data: Partial<PatientPayload>) {
  return request({
    url: `/${centerId}/patients/${patientId}`,
    method: 'PATCH',
    data,
  });
}

export async function deletePatient(centerId: string | number, patientId: string | number) {
  return request({
    url: `/${centerId}/patients/${patientId}`,
    method: 'DELETE',
  });
}

// Notes
export async function createPatientNote(centerId: string | number, patientId: string | number, data: any) {
  return request({
    url: `/${centerId}/patients/${patientId}/notes/`,
    method: 'PUT',
    data,
  });
}

export async function updatePatientNote(centerId: string | number, patientId: string | number, noteId: string | number, data: any) {
  return request({
    url: `/${centerId}/patients/${patientId}/notes/${noteId}`,
    method: 'PATCH',
    data,
  });
}
