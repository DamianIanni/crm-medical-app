// Error types matching backend error system
export interface ApiErrorResponse {
  status: "error";
  error: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
}

// All error codes from the backend
export enum ErrorCode {
  // Generic Errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Authentication Errors
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_EMAIL_IN_USE = "AUTH_EMAIL_IN_USE",
  AUTH_USER_NOT_FOUND = "AUTH_USER_NOT_FOUND",
  AUTH_PASSWORD_REQUIRED = "AUTH_PASSWORD_REQUIRED",
  AUTH_TOKEN_INVALID = "AUTH_TOKEN_INVALID",
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_SESSION_INVALID = "AUTH_SESSION_INVALID",
  AUTH_ACCESS_DENIED = "AUTH_ACCESS_DENIED",

  // Password Reset Errors
  PASSWORD_RESET_TOKEN_INVALID = "PASSWORD_RESET_TOKEN_INVALID",
  PASSWORD_RESET_TOKEN_EXPIRED = "PASSWORD_RESET_TOKEN_EXPIRED",

  // Center Related Errors
  CENTER_NOT_FOUND = "CENTER_NOT_FOUND",
  CENTER_USER_NOT_MEMBER = "CENTER_USER_NOT_MEMBER",
  CENTER_INSUFFICIENT_PERMISSIONS = "CENTER_INSUFFICIENT_PERMISSIONS",
  CENTER_USER_ALREADY_EXISTS = "CENTER_USER_ALREADY_EXISTS",
  CENTER_USER_NOT_EXISTS = "CENTER_USER_NOT_EXISTS",
  CENTER_NO_ASSOCIATION = "CENTER_NO_ASSOCIATION",

  // Patient Related Errors
  PATIENT_NOT_FOUND = "PATIENT_NOT_FOUND",
  PATIENT_EMAIL_DUPLICATE = "PATIENT_EMAIL_DUPLICATE",
  PATIENT_NOT_IN_CENTER = "PATIENT_NOT_IN_CENTER",
  PATIENT_ACCESS_DENIED = "PATIENT_ACCESS_DENIED",

  // User Related Errors
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  USER_INVALID_ROLE = "USER_INVALID_ROLE",
  USER_INSUFFICIENT_PRIVILEGES = "USER_INSUFFICIENT_PRIVILEGES",

  // Account Related Errors
  ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
  ACCOUNT_UPDATE_FAILED = "ACCOUNT_UPDATE_FAILED",

  // Note Related Errors
  NOTE_NOT_FOUND = "NOTE_NOT_FOUND",
  NOTE_ACCESS_DENIED = "NOTE_ACCESS_DENIED",

  // Validation Specific Errors
  EMAIL_REQUIRED = "EMAIL_REQUIRED",
  EMAIL_INVALID = "EMAIL_INVALID",
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
  REQUIRED_FIELD_MISSING = "REQUIRED_FIELD_MISSING",

  // Role and Permission Errors
  ROLE_INVALID = "ROLE_INVALID",
  ROLE_INSUFFICIENT = "ROLE_INSUFFICIENT",
  PERMISSION_DENIED = "PERMISSION_DENIED",
}

// Note: Error messages should now be obtained through the translation system
// This is kept as fallback for cases where translations are not available
export const FallbackErrorMessages: Record<ErrorCode, string> = {
  // Generic Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    "An internal server error has occurred. Please try again later.",
  [ErrorCode.VALIDATION_FAILED]:
    "The submitted data is not valid. Please review the information.",
  [ErrorCode.RESOURCE_NOT_FOUND]: "The requested resource was not found.",
  [ErrorCode.UNAUTHORIZED]: "You are not authorized to access this resource.",
  [ErrorCode.FORBIDDEN]:
    "Access forbidden. You do not have sufficient permissions.",

  // Authentication Errors
  [ErrorCode.AUTH_INVALID_CREDENTIALS]:
    "Invalid email or password. Please check your credentials.",
  [ErrorCode.AUTH_EMAIL_IN_USE]:
    "This email is already registered. Use a different email.",
  [ErrorCode.AUTH_USER_NOT_FOUND]: "No account found with this email.",
  [ErrorCode.AUTH_PASSWORD_REQUIRED]: "Password is required.",
  [ErrorCode.AUTH_TOKEN_INVALID]:
    "Invalid authentication token. Please login again.",
  [ErrorCode.AUTH_TOKEN_EXPIRED]:
    "Your session has expired. Please login again.",
  [ErrorCode.AUTH_SESSION_INVALID]: "Invalid session. Please login again.",
  [ErrorCode.AUTH_ACCESS_DENIED]: "Access denied. Authentication required.",

  // Password Reset Errors
  [ErrorCode.PASSWORD_RESET_TOKEN_INVALID]:
    "The password reset token is invalid or has expired.",
  [ErrorCode.PASSWORD_RESET_TOKEN_EXPIRED]:
    "The password reset token has expired.",

  // Center Related Errors
  [ErrorCode.CENTER_NOT_FOUND]: "Medical center not found.",
  [ErrorCode.CENTER_USER_NOT_MEMBER]:
    "You are not a member of this medical center.",
  [ErrorCode.CENTER_INSUFFICIENT_PERMISSIONS]:
    "You do not have sufficient permissions in this medical center.",
  [ErrorCode.CENTER_USER_ALREADY_EXISTS]:
    "The user already exists in this medical center.",
  [ErrorCode.CENTER_USER_NOT_EXISTS]:
    "The user does not exist in this medical center.",
  [ErrorCode.CENTER_NO_ASSOCIATION]:
    "No medical center is associated with your account.",

  // Patient Related Errors
  [ErrorCode.PATIENT_NOT_FOUND]: "Patient not found.",
  [ErrorCode.PATIENT_EMAIL_DUPLICATE]:
    "A patient with this email already exists in your medical center.",
  [ErrorCode.PATIENT_NOT_IN_CENTER]:
    "The patient is not in your medical center.",
  [ErrorCode.PATIENT_ACCESS_DENIED]: "You do not have access to this patient.",

  // User Related Errors
  [ErrorCode.USER_NOT_FOUND]: "User not found.",
  [ErrorCode.USER_ALREADY_EXISTS]: "The user already exists.",
  [ErrorCode.USER_INVALID_ROLE]: "Invalid user role.",
  [ErrorCode.USER_INSUFFICIENT_PRIVILEGES]: "Insufficient privileges.",

  // Account Related Errors
  [ErrorCode.ACCOUNT_NOT_FOUND]: "Account not found.",
  [ErrorCode.ACCOUNT_UPDATE_FAILED]: "Failed to update account.",

  // Note Related Errors
  [ErrorCode.NOTE_NOT_FOUND]: "Note not found.",
  [ErrorCode.NOTE_ACCESS_DENIED]: "You do not have access to this note.",

  // Validation Specific Errors
  [ErrorCode.EMAIL_REQUIRED]: "Email is required.",
  [ErrorCode.EMAIL_INVALID]: "Invalid email format.",
  [ErrorCode.PASSWORD_TOO_SHORT]: "Password must be at least 6 characters.",
  [ErrorCode.REQUIRED_FIELD_MISSING]: "There are required fields missing.",

  // Role and Permission Errors
  [ErrorCode.ROLE_INVALID]: "Invalid role.",
  [ErrorCode.ROLE_INSUFFICIENT]: "Insufficient role privileges.",
  [ErrorCode.PERMISSION_DENIED]: "Permission denied.",
};

// Error severity levels for UI feedback
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Map error codes to severity levels
export const ErrorSeverityMap: Record<ErrorCode, ErrorSeverity> = {
  // Critical - require immediate attention/action
  [ErrorCode.AUTH_SESSION_INVALID]: ErrorSeverity.CRITICAL,
  [ErrorCode.AUTH_TOKEN_EXPIRED]: ErrorSeverity.CRITICAL,
  [ErrorCode.INTERNAL_SERVER_ERROR]: ErrorSeverity.CRITICAL,

  // High - important errors that block functionality
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: ErrorSeverity.HIGH,
  [ErrorCode.AUTH_ACCESS_DENIED]: ErrorSeverity.HIGH,
  [ErrorCode.FORBIDDEN]: ErrorSeverity.HIGH,
  [ErrorCode.CENTER_INSUFFICIENT_PERMISSIONS]: ErrorSeverity.HIGH,
  [ErrorCode.USER_INSUFFICIENT_PRIVILEGES]: ErrorSeverity.HIGH,

  // Medium - errors that affect user experience
  [ErrorCode.VALIDATION_FAILED]: ErrorSeverity.MEDIUM,
  [ErrorCode.RESOURCE_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ErrorCode.PATIENT_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ErrorCode.USER_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ErrorCode.CENTER_NOT_FOUND]: ErrorSeverity.MEDIUM,

  // Low - informational or easily recoverable
  [ErrorCode.AUTH_EMAIL_IN_USE]: ErrorSeverity.LOW,
  [ErrorCode.PATIENT_EMAIL_DUPLICATE]: ErrorSeverity.LOW,
  [ErrorCode.EMAIL_INVALID]: ErrorSeverity.LOW,
  [ErrorCode.PASSWORD_TOO_SHORT]: ErrorSeverity.LOW,
  [ErrorCode.REQUIRED_FIELD_MISSING]: ErrorSeverity.LOW,

  // Default mappings for remaining codes
  [ErrorCode.UNAUTHORIZED]: ErrorSeverity.MEDIUM,
  [ErrorCode.AUTH_USER_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ErrorCode.AUTH_PASSWORD_REQUIRED]: ErrorSeverity.MEDIUM,
  [ErrorCode.AUTH_TOKEN_INVALID]: ErrorSeverity.HIGH,
  [ErrorCode.PASSWORD_RESET_TOKEN_INVALID]: ErrorSeverity.MEDIUM,
  [ErrorCode.PASSWORD_RESET_TOKEN_EXPIRED]: ErrorSeverity.MEDIUM,
  [ErrorCode.CENTER_USER_NOT_MEMBER]: ErrorSeverity.MEDIUM,
  [ErrorCode.CENTER_USER_ALREADY_EXISTS]: ErrorSeverity.LOW,
  [ErrorCode.CENTER_USER_NOT_EXISTS]: ErrorSeverity.MEDIUM,
  [ErrorCode.CENTER_NO_ASSOCIATION]: ErrorSeverity.HIGH,
  [ErrorCode.PATIENT_NOT_IN_CENTER]: ErrorSeverity.MEDIUM,
  [ErrorCode.PATIENT_ACCESS_DENIED]: ErrorSeverity.HIGH,
  [ErrorCode.USER_ALREADY_EXISTS]: ErrorSeverity.LOW,
  [ErrorCode.USER_INVALID_ROLE]: ErrorSeverity.MEDIUM,
  [ErrorCode.ACCOUNT_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ErrorCode.ACCOUNT_UPDATE_FAILED]: ErrorSeverity.MEDIUM,
  [ErrorCode.NOTE_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [ErrorCode.NOTE_ACCESS_DENIED]: ErrorSeverity.HIGH,
  [ErrorCode.EMAIL_REQUIRED]: ErrorSeverity.LOW,
  [ErrorCode.ROLE_INVALID]: ErrorSeverity.MEDIUM,
  [ErrorCode.ROLE_INSUFFICIENT]: ErrorSeverity.HIGH,
  [ErrorCode.PERMISSION_DENIED]: ErrorSeverity.HIGH,
};

// Type guard to check if error has the expected structure
// export function isApiErrorResponse(error: any): error is ApiErrorResponse {
//   return (
//     error &&
//     typeof error === 'object' &&
//     error.status === 'error' &&
//     error.error &&
//     typeof error.error.code === 'string' &&
//     typeof error.error.message === 'string'
//   );
// }
