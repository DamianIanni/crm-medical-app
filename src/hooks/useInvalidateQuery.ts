import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateQuery(queryKey: (string | number)[]) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey });
  };
}
