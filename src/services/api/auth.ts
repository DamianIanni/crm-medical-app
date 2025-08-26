// src/services/api/auth.ts
import api from "./http";

export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export const register = (data: RegisterBody) => {
  return api.post("/auth/register", data);
};

export const login = (data: LoginBody) => {
  return api.post("/auth/login", data);
};

export const getCurrentUser = () => {
  return api.get("/account/me");
};

export const userLogout = () => {
  return api.post("/auth/logout");
};

export const acceptInvitation = (center_id: string) => {
  return api.post(`/account/accept/${center_id}`);
};

export const rejectInvitation = (center_id: string) => {
  return api.post(`/account/reject/${center_id}`);
};

export const sendResetPasswordEmail = (email: string) => {
  return api.post(`/auth/forgot-password`, { email });
};

export const resetPassword = (token: string, password: string) => {
  return api.post(`/auth/reset-password/${token}`, { password });
};
