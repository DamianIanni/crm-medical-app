// src/services/api/user.ts
import { request } from "./http";

export interface UserPayload {
  email: string;
  role: "manager" | "employee";
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

export async function updateUser(
  userId: string,
  data: Pick<UserPayload, "role">
) {
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
