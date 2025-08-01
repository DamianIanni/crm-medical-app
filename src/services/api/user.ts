// src/services/api/user.ts
import { request } from './http';

export interface UserPayload {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export async function inviteUser(centerId: string | number, data: UserPayload) {
  return request({
    url: `/${centerId}/users/invite`,
    method: 'POST',
    data,
  });
}

export async function getAllUsers(centerId: string | number) {
  return request({
    url: `/${centerId}/users/`,
    method: 'GET',
  });
}

export async function getUserById(centerId: string | number, userId: string | number) {
  return request({
    url: `/${centerId}/users/${userId}`,
    method: 'GET',
  });
}

export async function updateUser(centerId: string | number, userId: string | number, data: Partial<UserPayload>) {
  return request({
    url: `/${centerId}/users/${userId}`,
    method: 'PATCH',
    data,
  });
}

export async function deleteUser(centerId: string | number, userId: string | number) {
  return request({
    url: `/${centerId}/users/${userId}`,
    method: 'DELETE',
  });
}
