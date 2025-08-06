// src/constants/routes.ts
export const ROUTES = {
  dashboard: "/dashboard/",
  patients: "/dashboard/patients/",
  patientDetail: (id: number | string) => `/dashboard/patients/${id}`,
  patientEdit: (id: number | string) => `/dashboard/patients/${id}/edit`,
  team: "/dashboard/team/",
  teamMemberDetail: (id: number | string) => `/dashboard/team/${id}`,
  teamMemberEdit: (id: number | string) => `/dashboard/team/${id}/edit`,
  centers: "/centers/",
  centerDetail: (id: number | string) => `/centers/${id}`,
  centerEdit: (id: number | string) => `/centers/${id}/edit`,
  centerCreate: "/centers/new",
};
