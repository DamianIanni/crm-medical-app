// // src/services/api/http.ts
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
  try {
    const response: AxiosResponse<T> = await api.request<T>(config);

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("Sesión inválida detectada. Redirigiendo al login.");

      // Limpia cualquier dato de sesión del cliente
      sessionStorage.clear();

      // Redirige forzosamente a la página de login.
      // Usamos window.location.href para una redirección dura que limpia todo el estado de React.
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login?session=expired";
      }
    }

    // Optionally, handle error logging here
    throw error.response?.data || error;
  }
}

export default api;

// src/services/api/http.ts
// import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// // Asumo que lees esto de tus variables de entorno centralizadas
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // 👇🏼 ¡LA LÓGICA VIVE AQUÍ, EN EL INTERCEPTOR! 👇🏼
// api.interceptors.response.use(
//   (response) => {
//     console.log("Response received", response);
//     return response;
//   },

//   // Función que se ejecuta si la respuesta es un error
//   (error) => {
//     console.log("Error received", error);
//     // Comprueba si el error es un 401 Unauthorized
//     if (error.response?.status === 401) {
//       console.log("Sesión inválida detectada. Redirigiendo al login.");

//       // Limpia cualquier dato de sesión del cliente
//       sessionStorage.clear();

//       // Redirige forzosamente a la página de login.
//       // Usamos window.location.href para una redirección dura que limpia todo el estado de React.
//       if (
//         typeof window !== "undefined" &&
//         !window.location.pathname.includes("/login")
//       ) {
//         window.location.href = "/login?session=expired";
//       }
//     }

//     // Propaga el error para que React Query y otros puedan manejarlo si no es un 401.
//     return Promise.reject(error);
//   }
// );

// // Tu función 'request' ahora es más simple y opcional.
// // Su único propósito es ser un atajo para obtener 'response.data'.
// export async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
//   try {
//     const response: AxiosResponse<T> = await api.request<T>(config);
//     return response.data;
//   } catch (error: any) {
//     // El interceptor ya manejó el error 401.
//     // Este 'throw' es para que los hooks de React Query (onError) reciban el error.
//     throw error.response?.data || error;
//   }
// }

// export default api;
