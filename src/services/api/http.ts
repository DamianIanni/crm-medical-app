import axios from "axios";
import { ErrorCode } from "@/types/errors";

// Configuración de la API base
const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptor de Respuesta Global ---
api.interceptors.response.use(
  /**
   * 1. Función para respuestas exitosas (onFulfilled)
   * Esta función se ejecuta para cualquier respuesta con código 2xx.
   * Su trabajo es "desenvolver" la respuesta para que el resto de tu
   * aplicación solo reciba los datos de negocio.
   */
  (response) => {
    // Si tu API tiene estructura { data: { ... } }, desenvuelve automáticamente
    // Si la respuesta tiene la estructura esperada con .data, la desenvuelve
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    // Si no, devuelve la respuesta completa
    return response.data;
  },
  
  /**
   * 2. Función para respuestas con error (onRejected)
   * Esta función se ejecuta para cualquier respuesta con código 4xx o 5xx.
   */
  (error) => {
    // Extraer información del error
    const errorData = error.response?.data;
    const errorCode = errorData?.error?.code;
    const status = error.response?.status;

    // Códigos de error que requieren redirección al login
    const LOGIN_REDIRECT_CODES = [
      ErrorCode.AUTH_SESSION_INVALID,
      ErrorCode.AUTH_TOKEN_EXPIRED,
      ErrorCode.AUTH_TOKEN_INVALID,
      ErrorCode.AUTH_ACCESS_DENIED,
    ];

    // Manejo de errores de autenticación con redirección
    if (status === 401 || (errorCode && LOGIN_REDIRECT_CODES.includes(errorCode as ErrorCode))) {
      console.log("Error de autenticación detectado. Redirigiendo al login.", { errorCode, status });
      sessionStorage.clear();
      
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        const redirectUrl = errorCode === ErrorCode.AUTH_SESSION_INVALID 
          ? '/login?session=expired'
          : '/login?auth=required';
        window.location.href = redirectUrl;
      }
    }
    
    // Propagar el error con la estructura completa para que el sistema de manejo de errores
    // pueda procesarlo correctamente
    return Promise.reject(errorData || error);
  }
);

export default api;
