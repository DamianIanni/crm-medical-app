// src/services/api/patient.ts
import { Patient } from "@/types/patient";
import api from "./http";

export interface PatientPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  short_description: string;
  date_of_birth: string;
  notes?: string[];
  id?: string;
  center_id?: string;
}
type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
export interface PaginatedPatientsResponse {
  data: PatientPayload[];
  pagination: Pagination;
}

export const createPatient = async (data: PatientPayload) => {
  const newPatient = (await api.post("/center/patients/", data)) as Patient;
  return newPatient;
};

export const getAllPatients = async (
  page: number,
  limit: number,
  searchTerm: string
) => {
  const patients = (await api.get("/center/patients/all", {
    params: {
      page,
      limit,
      searchTerm,
    },
  })) as PaginatedPatientsResponse;
  return patients;
};

export const getPatientById = (userId: string) => {
  return api.get(`/center/patients/${userId}`);
};

export const updatePatient = async (
  patientId: string,
  data: Partial<PatientPayload>
) => {
  const response = (await api.patch(
    `/center/patients/${patientId}`,
    data
  )) as PatientPayload;
  return response;
};

export const deletePatient = (patientId: string) => {
  return api.delete(`/center/patients/${patientId}`);
};
