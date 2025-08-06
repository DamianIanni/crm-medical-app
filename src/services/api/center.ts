// src/services/api/center.ts
import { request } from "./http";
import { Center } from "@/types/center";

export const centerService = {
  getAll: async (): Promise<Center[]> => {
    return request<Center[]>({
      url: "/centers",
      method: "GET",
    });
  },

  getById: async (id: string): Promise<Center> => {
    return request<Center>({
      url: `/centers/${id}`,
      method: "GET",
    });
  },

  create: async (center: Omit<Center, "id">): Promise<Center> => {
    return request<Center>({
      url: "/centers",
      method: "POST",
      data: center,
    });
  },

  update: async (id: string, center: Partial<Center>): Promise<Center> => {
    return request<Center>({
      url: `/centers/${id}`,
      method: "PUT",
      data: center,
    });
  },

  delete: async (id: string): Promise<void> => {
    return request<void>({
      url: `/centers/${id}`,
      method: "DELETE",
    });
  },
};


