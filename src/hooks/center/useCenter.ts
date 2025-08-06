"use client";

import { useQuery } from "@tanstack/react-query";
import { centerService } from "@/services/api/center";

export const useGetCenters = () => {
  return useQuery({
    queryKey: ["centers"],
    queryFn: centerService.getAll,
  });
};

export const useGetSingleCenter = (id: string) => {
  return useQuery({
    queryKey: ["center", id],
    queryFn: () => centerService.getById(id),
    enabled: !!id,
  });
};
