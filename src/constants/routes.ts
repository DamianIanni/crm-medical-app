// src/constants/routes.ts
export const ROUTES = {
  dashboard: "/dashboard/",
  patients: "/dashboard/patients/",
  patientDetail: (id: string) => `/dashboard/patients/${id}`,
  patientEdit: (id: string) => `/dashboard/patients/${id}/edit`,
  team: "/dashboard/team/",
  teamMemberDetail: (id: string) => `/dashboard/team/${id}`,
  teamMemberEdit: (id: string) => `/dashboard/team/${id}/edit`,
  centers: "/centers/",
  centerDetail: (id: string) => `/centers/${id}`,
  centerEdit: (id: string) => `/centers/${id}/edit`,
  centerCreate: "/centers/new",
};
