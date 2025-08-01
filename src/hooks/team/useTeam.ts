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
import { inviteUser, updateUser, deleteUser, getUserById, getAllUsers, UserPayload } from "@/services/api/user";
import { useInvalidateQuery } from "../useInvalidateQuery";
import { useDeleteState } from "@/components/providers/ContextProvider";

/**
 * useCreateMember hook.
 * A custom hook that provides a mutation for creating a new team member.
 * It shows a success toast on successful invitation and an error toast if the invitation fails.
 * @returns {object} A mutation object from `@tanstack/react-query`.
 */

export function useCreateMember(centerId: string | number) {
  const invalidate = useInvalidateQuery(["allUsers"]);
  return useMutation({
    mutationFn: (data: any) => inviteUser(centerId, data),
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
        title: "Failed to invite team member",
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
export function useUpdateTeamMember(centerId: string | number) {
  const invalidate = useInvalidateQuery(["allUsers"]);
  const invalidateAll = useInvalidateQuery(["allUsers"]);
  return useMutation({
    mutationFn: ({ userId, updated }: { userId: string | number; updated: Partial<UserPayload> }) => updateUser(centerId, userId, updated),
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
export function useDeleteTeamMember(centerId: string | number) {
  const invalidateAll = useInvalidateQuery(["allUsers"]);
  const { setIsDeleting } = useDeleteState();

  return useMutation({
    mutationFn: (userId: string | number) => deleteUser(centerId, userId),
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

export function useGetSingleUser(centerId: string | number, userId: string | number): UseQueryResult<User, Error> {
  return useQuery<User, Error>({
    queryKey: ["user", centerId, userId],
    queryFn: () => getUserById(centerId, userId),
    enabled: !!centerId && !!userId,
    refetchOnMount: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useGetUsers(centerId: string | number): UseQueryResult<User[], Error> {
  return useQuery<User[], Error>({
    queryKey: ["allUsers", centerId],
    queryFn: () => getAllUsers(centerId),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
