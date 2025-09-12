/**
 * @file useTeam.ts
 * @summary This file contains custom React Query hooks for managing team member data.
 * It provides hooks for creating, updating, and deleting team members,
 * with integrated toast feedback for success and error states.
 */

"use client";

import { useMutation, UseQueryResult, useQuery } from "@tanstack/react-query";
import { ToastFeedback } from "@/components/feedback/toastFeedback";
import { useTranslations } from "next-intl";
import {
  inviteUser,
  updateUser,
  deleteUser,
  // getUserById,
  getAllUsers,
  UserPayload,
} from "@/services/api/user";
import { useInvalidateQuery } from "../useInvalidateQuery";
import { useDeleteState } from "@/components/providers/ContextProvider";
import { DataUserFilter } from "@/lib/schemas/memberSchema";
import { getEntitySessionStorage } from "@/lib/utils";

const getDisplayName = () => {
  const member = getEntitySessionStorage("dataEntityteam");
  const displayName = `${member?.first_name} ${member?.last_name}`;
  return displayName;
};

/**
 * useCreateMember hook.
 * A custom hook that provides a mutation for creating a new team member.
 * It shows a success toast on successful invitation and an error toast if the invitation fails.
 * @returns {object} A mutation object from `@tanstack/react-query`.
 */

export function useCreateMember() {
  const t = useTranslations("Feedback.Team");
  const invalidate = useInvalidateQuery(["allUsers"]);
  return useMutation({
    mutationFn: (data: { email: string; role: "manager" | "employee" }) =>
      inviteUser(data),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: t("inviteSuccess"),
        description: t("inviteSuccess"),
      });
    },
    onError: (error: { error?: { code?: string } }) => {
      // Check if the error is a "AUTH_USER_NOT_FOUND" (user not found)
      if (error?.error?.code === "AUTH_USER_NOT_FOUND") {
        ToastFeedback({
          type: "error",
          title: t("userNotFoundTitle"),
          description: t("userNotFoundDescription"),
        });
      } else {
        ToastFeedback({
          type: "error",
          title: t("inviteError"),
          description: t("inviteError"),
        });
      }
    },
  });
}

/**
 * useUpdateTeamMember hook.
 * A custom hook that provides a mutation for updating an existing team member's information.
 * It displays a success toast upon a successful update and an error toast if the update fails.
 * @returns {object} A mutation object from `@tanstack/react-query`.
 */
export function useUpdateTeamMember() {
  const t = useTranslations("Feedback.Team");
  const invalidate = useInvalidateQuery(["allUsers"]);
  const invalidateAll = useInvalidateQuery(["allUsers"]);
  return useMutation({
    mutationFn: ({
      userId,
      updated,
    }: {
      userId: string;
      updated: Pick<UserPayload, "role">;
    }) => updateUser(userId, updated),
    onSuccess: () => {
      invalidate();
      invalidateAll();
      ToastFeedback({
        type: "success",
        title: t("updateSuccess", { name: getDisplayName() }),
        description: t("updateSuccess", { name: getDisplayName() }),
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

/**
 * useDeleteTeamMember hook.
 * A custom hook that provides a mutation for deleting a team member.
 * It shows an info toast on successful deletion and an error toast if the deletion fails.
 * @returns {object} A mutation object from `@tanstack/react-query`.
 */
export function useDeleteTeamMember() {
  const t = useTranslations("Feedback.Team");
  const invalidate = useInvalidateQuery(["allUsers"]);
  const { setIsDeleting } = useDeleteState();
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
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

// export function useGetSingleUser(userId: string): UseQueryResult<User, Error> {
//   return useQuery<User, Error>({
//     queryKey: ["user", userId],
//     queryFn: () => getUserById(userId),
//     enabled: !!userId,
//     refetchOnMount: true,
//     staleTime: 30_000,
//     refetchOnWindowFocus: false,
//   });
// }

export function useGetUsers(
  centerId: string
): UseQueryResult<DataUserFilter[], Error> {
  return useQuery<DataUserFilter[], Error>({
    queryKey: ["allUsers", centerId],
    queryFn: () => getAllUsers(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
