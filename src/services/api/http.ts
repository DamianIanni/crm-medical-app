// src/services/api/http.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // adjust if you need cookies/auth
});

// Generic request wrapper
export async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  console.log("CONFIG", config);

  try {
    const response: AxiosResponse<T> = await api.request<T>(config);
    console.log(response);

    return response.data;
  } catch (error: any) {
    // Optionally, handle error logging here
    throw error.response?.data || error;
  }
}

export default api;
