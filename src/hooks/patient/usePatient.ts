/**
 * @file usePatient.ts
 * @summary This file contains custom React Query hooks for managing patient data.
 * It provides hooks for creating, updating, and deleting patient records,
 * with integrated toast feedback for success and error states.
 */

"use client";

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
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

export function useGetPatients(
  centerId?: string
): UseQueryResult<Patient[], Error> {
  return useQuery<Patient[], Error>({
    queryKey: ["allPatient", centerId],
    queryFn: () => getAllPatients(),
    enabled: !!centerId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateNote(patientId: string) {
  const t = useTranslations("Feedback.Patient");
  const invalidate = useInvalidateQuery(["patient"]);
  return useMutation({
    mutationFn: (data: { note: string }) =>
      createPatientNote(patientId, data.note),
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
