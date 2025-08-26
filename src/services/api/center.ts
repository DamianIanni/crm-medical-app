// src/services/api/center.ts
import api from "./http";
import { Center } from "@/types/center";
import { UserRole } from "@/types/user";

export const centerService = {
  getAll: () => {
    return api.get<Center[]>("center-selection/all-centers");
  },

  getById: () => {
    return api.get<Center>(`center/center-actions/me`);
  },

  create: (center: Omit<Center, "id">) => {
    return api.post<Center>("center/center-actions", center);
  },

  update: (id: string, center: Partial<Center>) => {
    return api.patch<Center>(`center/center-actions/${id}`, center);
  },

  delete: (id: string) => {
    return api.delete<void>(`center/center-actions/${id}`);
  },

  selectCenter: (center_id: string, role: UserRole) => {
    return api.post<void>(`center-selection`, { center_id, role });
  },
};
