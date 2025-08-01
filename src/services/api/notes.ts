// src/services/api/notes.ts
import { request } from './http';

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
