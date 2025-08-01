// src/services/api/center.ts
import { request } from './http';

export interface CenterPayload {
  name: string;
  address?: string;
  [key: string]: any;
}

export async function createCenter(data: CenterPayload) {
  return request({
    url: '/center-actions/',
    method: 'POST',
    data,
  });
}

export async function getAllCenters() {
  return request({
    url: '/center-actions/all-centers',
    method: 'GET',
  });
}

export async function getCenterById(centerId: string | number) {
  return request({
    url: `/center-actions/${centerId}`,
    method: 'GET',
  });
}

export async function updateCenter(centerId: string | number, data: Partial<CenterPayload>) {
  return request({
    url: `/center-actions/${centerId}`,
    method: 'PATCH',
    data,
  });
}

export async function deleteCenter(centerId: string | number) {
  return request({
    url: `/center-actions/${centerId}`,
    method: 'DELETE',
  });
}
