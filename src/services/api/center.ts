// src/services/api/center.ts
import { request } from "./http";

export interface Center {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface CreateCenterBody {
  name: string;
  phone: string;
  address: string;
}

export interface UpdateCenterBody {
  name?: string;
  phone?: string;
  address?: string;
}

export async function getCenters() {
  return request<Center[]>({
    url: "/center-actions/all-centers",
    method: "GET",
  });
}

export async function createCenter(data: CreateCenterBody) {
  return request<Center>({
    url: "/center-actions/",
    method: "POST",
    data,
  });
}

export async function getCenter(centerId: string) {
  return request<Center>({
    url: `/center-actions/${centerId}`,
    method: "GET",
  });
}

export async function updateCenter(centerId: string, data: UpdateCenterBody) {
  return request<Center>({
    url: `/center-actions/${centerId}`,
    method: "PATCH",
    data,
  });
}

export async function deleteCenter(centerId: string) {
  return request<Center>({
    url: `/center-actions/${centerId}`,
    method: "DELETE",
  });
}
