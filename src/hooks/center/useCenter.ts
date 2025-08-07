"use client";

import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { centerService } from "@/services/api/center";
import { Center } from "@/types/center";
import { ToastFeedback } from "@/components/feedback/toastFeedback";

// Helper hook for invalidating queries
function useInvalidateQuery(keys: string[]) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: keys });
}

// Helper hook for delete state management
function useDeleteState() {
  const setIsDeleting = (isDeleting: boolean) => {
    // This can be expanded to use a proper state management solution
    // For now, we'll just use it as a placeholder
    return isDeleting;
  };
  return { setIsDeleting };
}

/**
 * Hook to get all centers
 * @returns {UseQueryResult} A query result object from `@tanstack/react-query`
 */
export function useGetAllCenters(): UseQueryResult<Center[], Error> {
  return useQuery<Center[], Error>({
    queryKey: ["allCenters"],
    queryFn: () => centerService.getAll(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get a single center by ID
 * @param {string} id - The center ID
 * @returns {UseQueryResult} A query result object from `@tanstack/react-query`
 */
export function useGetCenterById(id: string): UseQueryResult<Center, Error> {
  return useQuery<Center, Error>({
    queryKey: ["center", id],
    queryFn: () => centerService.getById(id),
    enabled: !!id,
    refetchOnMount: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to create a new center
 * @returns {object} A mutation object from `@tanstack/react-query`
 */
export function useCreateCenter() {
  const invalidate = useInvalidateQuery(["allCenters"]);
  return useMutation({
    mutationFn: (center: Omit<Center, "id">) => centerService.create(center),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: "Center Created",
        description: "Center created successfully.",
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to create center",
        description: "Please try again later.",
      });
    },
  });
}

/**
 * Hook to update an existing center
 * @returns {object} A mutation object from `@tanstack/react-query`
 */
export function useUpdateCenter() {
  const invalidate = useInvalidateQuery(["allCenters"]);
  return useMutation({
    mutationFn: ({ id, center }: { id: string; center: Partial<Center> }) =>
      centerService.update(id, center),
    onSuccess: () => {
      invalidate();
      ToastFeedback({
        type: "success",
        title: "Center Updated",
        description: "Center updated successfully.",
      });
    },
    onError: () => {
      ToastFeedback({
        type: "error",
        title: "Failed to update center",
        description: "Please try again later.",
      });
    },
  });
}

/**
 * Hook to delete a center
 * @returns {object} A mutation object from `@tanstack/react-query`
 */
export function useDeleteCenter() {
  const invalidate = useInvalidateQuery(["allCenters"]);
  const { setIsDeleting } = useDeleteState();
  return useMutation({
    mutationFn: (id: string) => centerService.delete(id),
    onSuccess: () => {
      setIsDeleting(false);
      invalidate();
      ToastFeedback({
        type: "info",
        title: "Center Deleted",
        description: "Center deleted successfully.",
      });
    },
    onError: () => {
      setIsDeleting(false);
      ToastFeedback({
        type: "error",
        title: "Failed to delete center",
        description: "Please try again later.",
      });
    },
  });
}

export const useGetSingleCenter = (id: string) => {
  return useQuery({
    queryKey: ["center", id],
    queryFn: () => centerService.getById(id),
    enabled: !!id,
  });
};
