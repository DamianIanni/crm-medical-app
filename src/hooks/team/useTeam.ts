/**
 * @file useTeam.ts
 * @summary This file contains custom React Query hooks for managing team member data.
 * It provides hooks for creating, updating, and deleting team members,
 * with integrated toast feedback for success and error states.
 */

"use client";

import { useMutation, UseQueryResult, useQuery } from "@tanstack/react-query";
import { ToastFeedback } from "@/components/feedback/toastFeedback";
import { User } from "@/types/user";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
} from "@/app/api/simulatedAPI/userMethods";
import { useInvalidateQuery } from "../useInvalidateQuery";
import { useDeleteState } from "@/components/providers/ContextProvider";

/**
 * useCreateMember hook.
 * A custom hook that provides a mutation for creating a new team member.
 * It shows a success toast on successful invitation and an error toast if the invitation fails.
 * @returns {object} A mutation object from `@tanstack/react-query`.
 */

export function useCreateMember() {
  const invalidate = useInvalidateQuery(["allUsers"]);
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data: Partial<User>) => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: "Team member invited",
        description: `Team member ${data.firstName} invited successfully.`,
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to invite patient", // Note: Typo in original "inivite", corrected to "invite".
        description: "Please try again later.",
      });
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
  const invalidate = useInvalidateQuery(["user"]);
  const invalidateAll = useInvalidateQuery(["allUsers"]);

  return useMutation({
    mutationFn: ({ id, updated }: { id: number; updated: Partial<User> }) =>
      updateUser(id, updated),
    onSuccess: (data: Partial<User>) => {
      invalidate();
      invalidateAll();
      ToastFeedback({
        type: "success",
        title: "Team member updated",
        description: `Team member ${data.firstName} updated successfully.`,
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to update team member",
        description: "Please try again later.",
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
  const invalidateAll = useInvalidateQuery(["allUsers"]);
  const { setIsDeleting } = useDeleteState();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      setIsDeleting(false);
      invalidateAll();
      ToastFeedback({
        type: "info",
        title: "Deleted",
        description: `Team member deleted successfully.`,
      });
    },
    onError: () => {
      setIsDeleting(false);

      ToastFeedback({
        type: "error",
        title: "Failed to delete team member",
        description: "Please try again later.",
      });
    },
  });
}

export function useGetSingleUser(userId: number): UseQueryResult<User, Error> {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    refetchOnMount: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useGetUsers(): UseQueryResult<User[], Error> {
  return useQuery<User[], Error>({
    queryKey: ["allUsers"],
    queryFn: () => getUsers(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
