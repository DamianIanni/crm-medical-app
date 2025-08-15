// src/services/api/auth.ts
import { request } from "./http";

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

export async function register(data: RegisterBody) {
  return request({
    url: "/auth/register",
    method: "POST",
    data,
  });
}

export async function login(data: LoginBody) {
  return request({
    url: "/auth/login",
    method: "POST",
    data,
  });
}

export async function getCurrentUser() {
  return request({
    url: "/account/me",
    method: "GET",
  });
}

export async function userLogout() {
  return request({
    url: "/auth/logout",
    method: "POST",
  });
}

export async function acceptInvitation(center_id: string) {
  return request({
    url: `/account/accept/${center_id}`,
    method: "POST",
  });
}

export async function rejectInvitation(center_id: string) {
  return request({
    url: `/account/reject/${center_id}`,
    method: "POST",
  });
}
