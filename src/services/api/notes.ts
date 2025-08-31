// src/services/api/notes.ts
import api from "./http";
import { NewNotePayload } from "@/hooks/patient/usePatient";

export const createPatientNote = (patientId: string, data: NewNotePayload) => {
  return api.post(`center/patients/${patientId}/notes`, data);
};

export const updatePatientNote = (
  patientId: string,
  noteId: string,
  data: NewNotePayload
) => {
  return api.patch(`center/patients/${patientId}/notes/${noteId}`, data);
};

export const deletePatientNote = (patientId: string, noteId: string) => {
  return api.delete(`center/patients/${patientId}/notes/${noteId}`);
};
