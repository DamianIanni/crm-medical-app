// src/services/api/patient.ts
import { request } from "./http";

export interface PatientPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  short_description: string;
  date_of_birth: string;
}

export async function createPatient(data: PatientPayload) {
  return request({
    url: `/center/patients/`,
    method: "POST",
    data,
  });
}

export async function getAllPatients(
  page: number,
  limit: number,
  searchTerm: string
) {
  return request({
    url: `/center/patients/all`,
    method: "GET",
    params: {
      page,
      limit,
      searchTerm,
    },
  });
}

export async function getPatientById(userId: string) {
  return request({
    url: `/center/patients/${userId}`,
    method: "GET",
  });
}

export async function updatePatient(
  patientId: string,
  data: Partial<PatientPayload>
) {
  return request({
    url: `/center/patients/${patientId}`,
    method: "PATCH",
    data,
  });
}

export async function deletePatient(patientId: string) {
  return request({
    url: `/center/patients/${patientId}`,
    method: "DELETE",
  });
}
