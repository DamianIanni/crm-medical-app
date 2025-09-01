// src/services/api/center.ts
import api from "./http";
// import { Center } from "@/types/center";
import { Center } from "@/types/center";
import { UserRole } from "@/types/user";

export const centerService = {
  getAll: async () => {
    const centers = (await api.get("center-selection/all-centers")) as Center[];
    return centers;
  },

  getById: async () => {
    const center = (await api.get(`center/center-actions/me`)) as Center;
    return center;
  },

  create: async (center: Omit<Center, "id">) => {
    return await api.post("create-center", center);
  },

  update: async (id: string, center: Partial<Center>) => {
    return await api.patch(`center/center-actions/${id}`, center);
  },

  delete: async (id: string) => {
    return await api.delete<void>(`center/center-actions/${id}`);
  },

  selectCenter: async (center_id: string, role: UserRole): Promise<void> => {
    await api.post(`center-selection`, { center_id, role });
  },
};
