/**
 * @file usePatient.ts
 * @summary This file contains custom React Query hooks for managing patient data.
 * It provides hooks for creating, updating, and deleting patient records,
 * with integrated toast feedback for success and error states.
 */

"use client";

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { ToastFeedback } from "@/components/feedback/toastFeedback";
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
  const invalidate = useInvalidateQuery(["allPatient"]);
  return useMutation({
    mutationFn: (data: PatientPayload) => createPatient(data),
    onSuccess: (data: Omit<Patient, "id" & "notes">) => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: "Patient created",
        description: `Patient ${data.first_name} added successfully.`,
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to create patient",
        description: "Please try again later.",
      });
    },
  });
}

export function useUpdatePatient() {
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
        title: "Patient updated",
        description: `Patient ${data.first_name} updated successfully.`,
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to update patient",
        description: "Please try again later.",
      });
    },
  });
}

export function useDeletePatient() {
  const invalidate = useInvalidateQuery(["allPatient"]);
  const { setIsDeleting } = useDeleteState();
  return useMutation({
    mutationFn: (patientId: string) => deletePatient(patientId),
    onSuccess: () => {
      setIsDeleting(false);
      invalidate();
      ToastFeedback({
        type: "info",
        title: "Patient Deleted",
        description: `Patient deleted successfully.`,
      });
    },
    onError: () => {
      setIsDeleting(false);
      ToastFeedback({
        type: "error",
        title: "Failed to delete patient",
        description: "Please try again later.",
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
  const invalidate = useInvalidateQuery(["allPatient", patientId]);
  return useMutation<void, Error, NewNotePayload>({
    mutationFn: (data: NewNotePayload) => createPatientNote(patientId, data),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: "Note created",
        description: `Note added successfully.`,
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to create note",
        description: "Please try again later.",
      });
    },
  });
}

export function useDeleteNote(patientId: string) {
  const invalidate = useInvalidateQuery(["allPatient", patientId]);
  return useMutation<string, unknown, string>({
    mutationFn: (noteId: string) => deletePatientNote(patientId, noteId),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: "Note deleted",
        description: `Note deleted successfully.`,
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to delete note",
        description: "Please try again later.",
      });
    },
  });
}
