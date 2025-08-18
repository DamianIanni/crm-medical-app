// src/services/api/notes.ts
import { request } from "./http";
import { NewNotePayload } from "@/hooks/patient/usePatient";

export async function createPatientNote(
  patientId: string,
  data: NewNotePayload
) {
  console.log("NOTES", data);
  return request({
    url: `center/patients/${patientId}/notes`,
    method: "POST",
    data,
  });
}

export async function updatePatientNote(
  patientId: string,
  noteId: string,
  data: NewNotePayload
) {
  return request({
    url: `center/patients/${patientId}/notes/${noteId}`,
    method: "PATCH",
    data,
  });
}

export async function deletePatientNote(patientId: string, noteId: string) {
  return request({
    url: `center/patients/${patientId}/notes/${noteId}`,
    method: "DELETE",
  });
}
