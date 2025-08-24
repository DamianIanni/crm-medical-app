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
  UseQueryResult,
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
  getPatientById,
  PatientPayload,
} from "@/services/api/patient";
import { deletePatientNote } from "@/services/api/notes";
import { useInvalidateQuery } from "../useInvalidateQuery";
import { useDeleteState } from "@/components/providers/ContextProvider";
import { createPatientNote } from "@/services/api/notes";

export type NewNotePayload = {
  note: string;
};

export function useCreatePatient() {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["allPatient"]);
  return useMutation({
    mutationFn: (data: PatientPayload) => createPatient(data),
    onSuccess: (data: Omit<Patient, "id" & "notes">) => {
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
  return useMutation({
    mutationFn: ({
      patientId,
      updated,
    }: {
      patientId: string;
      updated: Partial<PatientPayload>;
    }) => updatePatient(patientId, updated),
    onSuccess: (data: Partial<Patient>) => {
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

export function useGetSinglePatient(
  userId: string
): UseQueryResult<Patient, Error> {
  return useQuery<Patient, Error>({
    queryKey: ["patient", userId],
    queryFn: () => getPatientById(userId),
    enabled: !!userId,
    refetchOnMount: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

// export function useGetPatients(
//   centerId?: string
// ): UseQueryResult<Patient[], Error> {
//   return useQuery<Patient[], Error>({
//     queryKey: ["allPatient", centerId],
//     queryFn: () => getAllPatients(),
//     enabled: !!centerId,
//     staleTime: 60_000,
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

// 1. Define el tipo de la respuesta que esperas de tu API
type PaginatedPatientsResponse = {
  data: Patient[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

// 2. Define el tipo de los parámetros que recibirá el hook
type GetPatientsParams = {
  centerId: string | null;
  page: number;
  limit: number;
  search: string;
  enabled: boolean;
};

/**
 * Hook para obtener una lista paginada y filtrada de pacientes.
 * @param params - Objeto con centerId, page, limit, y search.
 * @returns El resultado de la query de React Query.
 */
export function useGetPaginatedPatients(params: GetPatientsParams) {
  const { centerId, page, limit, search, enabled } = params;

  return useQuery<PaginatedPatientsResponse, Error>({
    // 3. La queryKey incluye TODOS los parámetros. Si alguno cambia,
    // React Query hará una nueva petición.
    queryKey: ["allPatient", { centerId, page, limit, search }],

    // 4. La queryFn llama a tu servicio pasándole los parámetros.
    queryFn: () => getAllPatients(page, limit, search),

    // 5. Solo ejecuta la query si el centerId está disponible.
    enabled: enabled,

    // 6. (Opcional pero recomendado) Mantiene los datos anteriores visibles
    //    mientras se carga la nueva página, para una mejor UX.
    placeholderData: keepPreviousData,
  });
}
