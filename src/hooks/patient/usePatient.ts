/**
 * @file usePatient.ts
 * @summary This file contains custom React Query hooks for managing patient data.
 * It provides hooks for creating, updating, and deleting patient records,
 * with integrated toast feedback for success and error states.
 */

"use client";

import {
  useMutation,
  useQuery,
  // UseQueryResult,
  keepPreviousData,
} from "@tanstack/react-query";
import { ToastFeedback } from "@/components/feedback/toastFeedback";
import { useTranslations } from "next-intl";
import { Patient } from "@/types/patient";
import {
  createPatient,
  updatePatient,
  deletePatient,
  getAllPatients,
  // getPatientById,
  PatientPayload,
} from "@/services/api/patient";
import { deletePatientNote } from "@/services/api/notes";
import { useInvalidateQuery } from "../useInvalidateQuery";
import { useDeleteState } from "@/components/providers/ContextProvider";
import { createPatientNote } from "@/services/api/notes";
import { PaginatedPatientsResponse } from "@/services/api/patient";

export type NewNotePayload = {
  note: string;
};

type UpdatePatientVariables = {
  patientId: string;
  updated: Partial<PatientPayload>;
};

export function useCreatePatient() {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["allPatient"]);
  return useMutation<
    Patient, // 1. Tipo de dato que se devuelve en caso de ÉXITO
    Error, // 2. Tipo de dato que se devuelve en caso de ERROR
    PatientPayload // 3. Tipo de dato que recibe la función 'mutate'
  >({
    mutationFn: (data: PatientPayload) => createPatient(data),
    onSuccess: (data) => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: t("createSuccess", { name: data.first_name }),
        description: t("createSuccess", { name: data.first_name }),
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: t("createError"),
        description: t("createError"),
      });
    },
  });
}

export function useUpdatePatient() {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["patient"]);
  const invalidateAll = useInvalidateQuery(["allPatient"]);
  return useMutation<
    PatientPayload, // 1. Tipo de dato que se devuelve en caso de ÉXITO
    Error, // 2. Tipo de dato que se devuelve en caso de ERROR
    UpdatePatientVariables // 3. Tipo de dato que recibe la función 'mutate'
  >({
    mutationFn: ({ patientId, updated }: UpdatePatientVariables) =>
      updatePatient(patientId, updated),
    onSuccess: (data) => {
      invalidate();
      invalidateAll();
      ToastFeedback({
        type: "success",
        title: t("updateSuccess", { name: data.first_name }),
        description: t("updateSuccess", { name: data.first_name }),
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: t("updateError"),
        description: t("updateError"),
      });
    },
  });
}

export function useDeletePatient() {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["allPatient"]);
  const { setIsDeleting } = useDeleteState();
  return useMutation({
    mutationFn: (patientId: string) => deletePatient(patientId),
    onSuccess: () => {
      setIsDeleting(false);
      invalidate();
      ToastFeedback({
        type: "info",
        title: t("deleteSuccess"),
        description: t("deleteSuccess"),
      });
    },
    onError: () => {
      setIsDeleting(false);
      ToastFeedback({
        type: "error",
        title: t("deleteError"),
        description: t("deleteError"),
      });
    },
  });
}

// export function useGetSinglePatient(
//   userId: string
// ): UseQueryResult<Patient, Error> {
//   return useQuery<Patient, Error>({
//     queryKey: ["patient", userId],
//     queryFn: () => getPatientById(userId),
//     enabled: !!userId,
//     refetchOnMount: true,
//     staleTime: 30_000,
//     refetchOnWindowFocus: false,
//   });
// }

export function useCreateNote(patientId: string) {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["patient"]);
  return useMutation({
    mutationFn: (data: { note: string }) => createPatientNote(patientId, data),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: t("noteCreateSuccess"),
        description: t("noteCreateSuccess"),
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: t("noteCreateError"),
        description: t("noteCreateError"),
      });
    },
  });
}

export function useDeleteNote(patientId: string) {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["patient"]);
  return useMutation({
    mutationFn: (noteId: string) => deletePatientNote(patientId, noteId),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "info",
        title: t("noteDeleteSuccess"),
        description: t("noteDeleteSuccess"),
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: t("noteDeleteError"),
        description: t("noteDeleteError"),
      });
    },
  });
}

// 2. Define el tipo de los parámetros que recibirá el hook
type GetPatientsParams = {
  centerId: string | null;
  page: number;
  limit: number;
  search: string;
  enabled: boolean;
};

/**
 * Hook to fetch a paginated and filtered list of patients.
 * @param params - Object containing centerId, page, limit, and search.
 * @returns The result of the React Query.
 */
export function useGetPaginatedPatients(params: GetPatientsParams) {
  const { centerId, page, limit, search, enabled } = params;

  return useQuery<PaginatedPatientsResponse, Error>({
    // 3. The queryKey includes ALL parameters. If any change,
    // React Query will make a new request.
    queryKey: ["allPatient", { centerId, page, limit, search }],

    // 4. The queryFn calls your service with the parameters.
    queryFn: () => getAllPatients(page, limit, search),

    // 5. Only executes the query if centerId is available.
    enabled: enabled,

    // 6. (Optional but recommended) Keeps previous data visible
    //    while the new page loads, for better UX.
    placeholderData: keepPreviousData,
  });
}
