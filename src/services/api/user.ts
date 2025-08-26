// src/services/api/user.ts
import api from "./http";

export interface UserPayload {
  email: string;
  role: "manager" | "employee";
}

export const inviteUser = (data: UserPayload) => {
  return api.post(`/center/users/`, data);
};

export const getAllUsers = () => {
  return api.get(`/center/users`);
};

export const getUserById = (userId: string) => {
  return api.get(`/center/users/${userId}`);
};

export const updateUser = (userId: string, data: Pick<UserPayload, "role">) => {
  return api.patch(`/center/users/${userId}`, data);
};

export const deleteUser = (userId: string) => {
  return api.delete(`/center/users/${userId}`);
};
