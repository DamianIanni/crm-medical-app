import axios from "axios";
import { ErrorCode } from "@/types/errors";
// import { handleError } from "@/utils/errorHandler";

// Base API configuration
// Dynamically select API URL based on environment
// const API_BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.BASE_URL // Production URL
//     : process.env.BASE_URL_DEV || "http://localhost:4000/api"; // Development URL with fallback

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Global Response Interceptor ---
api.interceptors.response.use(
  /**
   * 1. Success Response Handler (onFulfilled)
   * This function runs for any 2xx response.
   * It unwraps the response so the rest of the application
   * only receives the business data.
   */
  (response) => {
    // If the API has a { data: { ... } } structure, unwrap it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response.data.data;
    }
    // Otherwise return the full response
    return response.data;
  },

  /**
   * 2. Error Response Handler (onRejected)
   * This function runs for any 4xx or 5xx response.
   */
  (error) => {
    // Extract error information
    const errorData = error.response?.data;
    const errorCode = errorData?.error?.code;
    const status = error.response?.status;

    // Error codes that require login redirect
    const LOGIN_REDIRECT_CODES = [
      ErrorCode.AUTH_SESSION_INVALID,
      ErrorCode.AUTH_TOKEN_EXPIRED,
      ErrorCode.AUTH_TOKEN_INVALID,
      ErrorCode.AUTH_ACCESS_DENIED,
    ];

    // Handle authentication errors with redirect
    if (
      status === 401 ||
      (errorCode && LOGIN_REDIRECT_CODES.includes(errorCode as ErrorCode))
    ) {
      console.log("Authentication error detected. Redirecting to login.", {
        errorCode,
        status,
      });
      sessionStorage.clear();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        const redirectUrl =
          errorCode === ErrorCode.AUTH_SESSION_INVALID
            ? "/login?session=expired"
            : "/login?auth=required";
        window.location.href = redirectUrl;
      }
    }

    // // Process the error through our error handling system
    // const processedError = handleError(error);

    // // Return a rejected promise with the processed error
    // return Promise.reject(processedError);
    return Promise.reject(errorData || error);
  }
);

export default api;
