// src/services/api/center.ts
import { request } from "./http";
import { Center } from "@/types/center";

export const centerService = {
  getAll: async (): Promise<Center[]> => {
    return request<Center[]>({
      url: "center/center-actions/all-centers",
      method: "GET",
    });
  },

  getById: async (id: string): Promise<Center> => {
    return request<Center>({
      url: `center/center-actions/${id}`,
      method: "GET",
    });
  },

  create: async (center: Omit<Center, "id">): Promise<Center> => {
    return request<Center>({
      url: "center/center-actions",
      method: "POST",
      data: center,
    });
  },

  update: async (id: string, center: Partial<Center>): Promise<Center> => {
    return request<Center>({
      url: `center/center-actions/${id}`,
      method: "PATCH",
      data: center,
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>({
      url: `center/center-actions/${id}`,
      method: "DELETE",
    });
  },
};
