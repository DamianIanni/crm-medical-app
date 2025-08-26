// src/services/api/patient.ts
import api from "./http";

export interface PatientPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  short_description: string;
  date_of_birth: string;
}

// Las funciones ahora son simples líneas que devuelven la llamada de axios.
// El interceptor se encargará de todo lo demás.
export const createPatient = (data: PatientPayload) => {
  return api.post('/center/patients/', data);
};

export const getAllPatients = (page: number, limit: number, searchTerm: string) => {
  return api.get('/center/patients/all', {
    params: {
      page,
      limit,
      searchTerm,
    },
  });
};

export const getPatientById = (userId: string) => {
  return api.get(`/center/patients/${userId}`);
};

export const updatePatient = (patientId: string, data: Partial<PatientPayload>) => {
  return api.patch(`/center/patients/${patientId}`, data);
};

export const deletePatient = (patientId: string) => {
  return api.delete(`/center/patients/${patientId}`);
};
