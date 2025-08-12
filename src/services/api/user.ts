// src/services/api/user.ts
import { request } from "./http";

export interface UserPayload {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export async function inviteUser(data: UserPayload) {
  return request({
    url: `/center/users/`,
    method: "POST",
    data,
  });
}

export async function getAllUsers() {
  return request({
    url: `/center/users`,
    method: "GET",
  });
}

export async function getUserById(userId: string) {
  return request({
    url: `/center/users/${userId}`,
    method: "GET",
  });
}

export async function updateUser(userId: string, data: Partial<UserPayload>) {
  return request({
    url: `/center/users/${userId}`,
    method: "PATCH",
    data,
  });
}

export async function deleteUser(userId: string) {
  return request({
    url: `/center/users/${userId}`,
    method: "DELETE",
  });
}
