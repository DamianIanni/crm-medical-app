// src/services/api/center.ts
import { request } from "./http";
import { Center } from "@/types/center";
import { UserRole } from "@/types/user";

export const centerService = {
  getAll: async (): Promise<Center[]> => {
    return request<Center[]>({
      url: "center-selection/all-centers",
      method: "GET",
    });
  },

  getById: async (): Promise<Center> => {
    return request<Center>({
      url: `center/center-actions/me`,
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

  selectCenter: async (center_id: string, role: UserRole): Promise<void> => {
    const center = { center_id, role };
    return request<void>({
      url: `center-selection`,
      method: "POST",
      data: center,
    });
  },
};
