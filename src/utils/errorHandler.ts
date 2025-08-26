import { 
  ApiErrorResponse, 
  ErrorCode, 
  ErrorMessages, 
  ErrorSeverity, 
  ErrorSeverityMap,
  isApiErrorResponse 
} from "@/types/errors";
import NotificationService from "@/utils/notifications";

/**
 * Processed error interface for consistent error handling
 */
export interface ProcessedError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  originalError?: any;
  details?: Record<string, any>;
  shouldRedirectToLogin: boolean;
}

/**
 * Error codes that require redirect to login
 */
const LOGIN_REDIRECT_CODES = [
  ErrorCode.AUTH_SESSION_INVALID,
  ErrorCode.AUTH_TOKEN_EXPIRED,
  ErrorCode.AUTH_TOKEN_INVALID,
  ErrorCode.AUTH_ACCESS_DENIED,
];

/**
 * Error codes that should show form-specific errors instead of toast
 */
const FORM_ERROR_CODES = [
  ErrorCode.EMAIL_INVALID,
  ErrorCode.EMAIL_REQUIRED,
  ErrorCode.PASSWORD_TOO_SHORT,
  ErrorCode.REQUIRED_FIELD_MISSING,
  ErrorCode.VALIDATION_FAILED,
  ErrorCode.AUTH_INVALID_CREDENTIALS,
  ErrorCode.AUTH_EMAIL_IN_USE,
  ErrorCode.PATIENT_EMAIL_DUPLICATE,
];

/**
 * Processes any error and returns a standardized error object
 */
export function processError(error: any): ProcessedError {
  // Handle API errors with error codes
  if (isApiErrorResponse(error)) {
    const errorCode = error.error.code as ErrorCode;
    
    return {
      code: errorCode,
      message: ErrorMessages[errorCode] || error.error.message,
      severity: ErrorSeverityMap[errorCode] || ErrorSeverity.MEDIUM,
      originalError: error,
      details: error.error.details,
      shouldRedirectToLogin: LOGIN_REDIRECT_CODES.includes(errorCode),
    };
  }

  // Handle axios errors without our error structure
  if (error?.response?.data) {
    return {
      code: 'UNKNOWN_API_ERROR',
      message: error.response.data.message || 'Ha ocurrido un error en el servidor',
      severity: ErrorSeverity.MEDIUM,
      originalError: error,
      shouldRedirectToLogin: false,
    };
  }

  // Handle network errors
  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
      severity: ErrorSeverity.HIGH,
      originalError: error,
      shouldRedirectToLogin: false,
    };
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT_ERROR',
      message: 'La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.',
      severity: ErrorSeverity.MEDIUM,
      originalError: error,
      shouldRedirectToLogin: false,
    };
  }

  // Generic error fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
    severity: ErrorSeverity.MEDIUM,
    originalError: error,
    shouldRedirectToLogin: false,
  };
}

/**
 * Shows appropriate error notification based on error type
 */
export function showErrorToast(processedError: ProcessedError): void {
  // Use the enhanced notification service
  NotificationService.fromError(processedError);
}

/**
 * Handles error with automatic toast notification and login redirect if needed
 */
export function handleError(error: any): ProcessedError {
  const processedError = processError(error);

  // Handle login redirect for auth errors (this should be handled by axios interceptor)
  if (processedError.shouldRedirectToLogin) {
    console.log("Auth error detected, should redirect to login");
    // The axios interceptor should handle the actual redirect
  }

  // Don't show toast for form errors - let components handle these
  if (!FORM_ERROR_CODES.includes(processedError.code as ErrorCode)) {
    showErrorToast(processedError);
  }

  // Log error for debugging
  if (processedError.severity === ErrorSeverity.CRITICAL) {
    console.error('Critical error:', processedError.originalError);
  } else {
    console.warn('Error:', processedError.originalError);
  }

  return processedError;
}

/**
 * Checks if error should be shown in form (instead of toast)
 */
export function isFormError(error: ProcessedError): boolean {
  return FORM_ERROR_CODES.includes(error.code as ErrorCode);
}

/**
 * Gets field-specific error message for form validation
 */
export function getFieldError(error: ProcessedError, field: string): string | null {
  if (!isFormError(error)) return null;

  // Map error codes to specific fields
  const fieldErrorMap: Record<string, Record<string, string>> = {
    email: {
      [ErrorCode.EMAIL_INVALID]: 'Formato de email inválido',
      [ErrorCode.EMAIL_REQUIRED]: 'El email es requerido',
      [ErrorCode.AUTH_EMAIL_IN_USE]: 'Este email ya está registrado',
      [ErrorCode.PATIENT_EMAIL_DUPLICATE]: 'Ya existe un paciente con este email',
    },
    password: {
      [ErrorCode.PASSWORD_TOO_SHORT]: 'La contraseña debe tener al menos 6 caracteres',
      [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Contraseña incorrecta',
    },
  };

  return fieldErrorMap[field]?.[error.code] || null;
}

/**
 * Extracts validation errors from API response details
 */
export function extractValidationErrors(processedError: ProcessedError): Record<string, string> {
  if (!processedError.details || !processedError.details.validationErrors) {
    return {};
  }

  const errors: Record<string, string> = {};
  const validationErrors = processedError.details.validationErrors;

  // Handle different validation error formats
  if (Array.isArray(validationErrors)) {
    validationErrors.forEach((error: any) => {
      if (error.field && error.message) {
        errors[error.field] = error.message;
      }
    });
  } else if (typeof validationErrors === 'object') {
    Object.keys(validationErrors).forEach(field => {
      errors[field] = validationErrors[field];
    });
  }

  return errors;
}

/**
 * Utility to handle React Query errors
 */
export function handleQueryError(error: any) {
  return handleError(error);
}

/**
 * Utility to handle mutation errors
 */
export function handleMutationError(error: any) {
  return handleError(error);
}
