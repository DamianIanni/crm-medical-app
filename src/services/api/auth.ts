// src/services/api/auth.ts
import { request } from "./http";

export interface RegisterBody {
  email: string;
  password: string;
  name?: string;
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
  console.log("loginBody", data);

  return request({
    url: "/auth/login",
    method: "POST",
    data,
  });
}

export async function getCurrentUser() {
  return request({
    // update route later, the user shoeld be authenticated to logout
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
