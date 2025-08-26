import { 
  ApiErrorResponse, 
  ErrorCode, 
  FallbackErrorMessages, 
  ErrorSeverity, 
  ErrorSeverityMap,
  isApiErrorResponse 
} from "@/types/errors";

/**
 * Processed error interface with i18n support
 */
export interface ProcessedErrorI18n {
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
 * Get error message from translations with fallback
 */
function getErrorMessage(t: any, errorCode: ErrorCode): string {
  try {
    // Try to get from generic errors first
    const genericMessage = t(`Errors.generic.${errorCode}`);
    if (genericMessage && genericMessage !== `Errors.generic.${errorCode}`) {
      return genericMessage;
    }

    // Try category-specific messages
    const categoryMappings = {
      // Auth errors
      AUTH_INVALID_CREDENTIALS: 'auth.AUTH_INVALID_CREDENTIALS',
      AUTH_EMAIL_IN_USE: 'auth.AUTH_EMAIL_IN_USE',
      AUTH_USER_NOT_FOUND: 'auth.AUTH_USER_NOT_FOUND',
      AUTH_PASSWORD_REQUIRED: 'auth.AUTH_PASSWORD_REQUIRED',
      AUTH_TOKEN_INVALID: 'auth.AUTH_TOKEN_INVALID',
      AUTH_TOKEN_EXPIRED: 'auth.AUTH_TOKEN_EXPIRED',
      AUTH_SESSION_INVALID: 'auth.AUTH_SESSION_INVALID',
      AUTH_ACCESS_DENIED: 'auth.AUTH_ACCESS_DENIED',

      // Password reset errors
      PASSWORD_RESET_TOKEN_INVALID: 'password.PASSWORD_RESET_TOKEN_INVALID',
      PASSWORD_RESET_TOKEN_EXPIRED: 'password.PASSWORD_RESET_TOKEN_EXPIRED',

      // Center errors
      CENTER_NOT_FOUND: 'center.CENTER_NOT_FOUND',
      CENTER_USER_NOT_MEMBER: 'center.CENTER_USER_NOT_MEMBER',
      CENTER_INSUFFICIENT_PERMISSIONS: 'center.CENTER_INSUFFICIENT_PERMISSIONS',
      CENTER_USER_ALREADY_EXISTS: 'center.CENTER_USER_ALREADY_EXISTS',
      CENTER_USER_NOT_EXISTS: 'center.CENTER_USER_NOT_EXISTS',
      CENTER_NO_ASSOCIATION: 'center.CENTER_NO_ASSOCIATION',

      // Patient errors
      PATIENT_NOT_FOUND: 'patient.PATIENT_NOT_FOUND',
      PATIENT_EMAIL_DUPLICATE: 'patient.PATIENT_EMAIL_DUPLICATE',
      PATIENT_NOT_IN_CENTER: 'patient.PATIENT_NOT_IN_CENTER',
      PATIENT_ACCESS_DENIED: 'patient.PATIENT_ACCESS_DENIED',

      // User errors
      USER_NOT_FOUND: 'user.USER_NOT_FOUND',
      USER_ALREADY_EXISTS: 'user.USER_ALREADY_EXISTS',
      USER_INVALID_ROLE: 'user.USER_INVALID_ROLE',
      USER_INSUFFICIENT_PRIVILEGES: 'user.USER_INSUFFICIENT_PRIVILEGES',

      // Account errors
      ACCOUNT_NOT_FOUND: 'account.ACCOUNT_NOT_FOUND',
      ACCOUNT_UPDATE_FAILED: 'account.ACCOUNT_UPDATE_FAILED',

      // Note errors
      NOTE_NOT_FOUND: 'notes.NOTE_NOT_FOUND',
      NOTE_ACCESS_DENIED: 'notes.NOTE_ACCESS_DENIED',

      // Validation errors
      EMAIL_REQUIRED: 'validation.EMAIL_REQUIRED',
      EMAIL_INVALID: 'validation.EMAIL_INVALID',
      PASSWORD_TOO_SHORT: 'validation.PASSWORD_TOO_SHORT',
      REQUIRED_FIELD_MISSING: 'validation.REQUIRED_FIELD_MISSING',

      // Permission errors
      ROLE_INVALID: 'permissions.ROLE_INVALID',
      ROLE_INSUFFICIENT: 'permissions.ROLE_INSUFFICIENT',
      PERMISSION_DENIED: 'permissions.PERMISSION_DENIED',
    };

    const categoryKey = categoryMappings[errorCode as keyof typeof categoryMappings];
    if (categoryKey) {
      const categoryMessage = t(`Errors.${categoryKey}`);
      if (categoryMessage && categoryMessage !== `Errors.${categoryKey}`) {
        return categoryMessage;
      }
    }

    // Fallback to hardcoded messages
    return FallbackErrorMessages[errorCode] || 'An unexpected error occurred';
  } catch {
    // If translation fails, use fallback
    return FallbackErrorMessages[errorCode] || 'An unexpected error occurred';
  }
}

/**
 * Processes any error and returns a standardized error object with i18n
 */
export function processErrorI18n(error: any, t?: any): ProcessedErrorI18n {
  // Handle API errors with error codes
  if (isApiErrorResponse(error)) {
    const errorCode = error.error.code as ErrorCode;
    
    return {
      code: errorCode,
      message: t ? getErrorMessage(t, errorCode) : FallbackErrorMessages[errorCode] || error.error.message,
      severity: ErrorSeverityMap[errorCode] || ErrorSeverity.MEDIUM,
      originalError: error,
      details: error.error.details,
      shouldRedirectToLogin: LOGIN_REDIRECT_CODES.includes(errorCode),
    };
  }

  // Handle axios errors without our error structure
  if (error?.response?.data) {
    const fallbackMessage = t ? t('Errors.generic.UNKNOWN_ERROR') : 'An error occurred on the server';
    return {
      code: 'UNKNOWN_API_ERROR',
      message: error.response.data.message || fallbackMessage,
      severity: ErrorSeverity.MEDIUM,
      originalError: error,
      shouldRedirectToLogin: false,
    };
  }

  // Handle network errors
  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network')) {
    return {
      code: 'NETWORK_ERROR',
      message: t ? t('Errors.generic.NETWORK_ERROR') : 'Network error. Please check your internet connection.',
      severity: ErrorSeverity.HIGH,
      originalError: error,
      shouldRedirectToLogin: false,
    };
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT_ERROR',
      message: t ? t('Errors.generic.TIMEOUT_ERROR') : 'The request took too long. Please try again.',
      severity: ErrorSeverity.MEDIUM,
      originalError: error,
      shouldRedirectToLogin: false,
    };
  }

  // Generic error fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: t ? t('Errors.generic.UNKNOWN_ERROR') : 'An unexpected error has occurred. Please try again.',
    severity: ErrorSeverity.MEDIUM,
    originalError: error,
    shouldRedirectToLogin: false,
  };
}

/**
 * Checks if error should be shown in form (instead of toast)
 */
export function isFormErrorI18n(error: ProcessedErrorI18n): boolean {
  return FORM_ERROR_CODES.includes(error.code as ErrorCode);
}

/**
 * Gets field-specific error message for form validation with i18n
 */
export function getFieldErrorI18n(error: ProcessedErrorI18n, field: string, t?: any): string | null {
  if (!isFormErrorI18n(error)) return null;

  try {
    if (!t) return null;

    // Try to get field-specific translation
    const fieldMessage = t(`Errors.fields.${field}.${error.code}`);
    if (fieldMessage && fieldMessage !== `Errors.fields.${field}.${error.code}`) {
      return fieldMessage;
    }

    // Fallback to generic error message
    return getErrorMessage(t, error.code as ErrorCode);
  } catch {
    return null;
  }
}

/**
 * Gets appropriate title based on error severity with i18n
 */
export function getErrorTitleI18n(severity: ErrorSeverity, t?: any): string {
  if (!t) {
    // Fallback titles
    switch (severity) {
      case ErrorSeverity.CRITICAL: return "Critical Error";
      case ErrorSeverity.HIGH: return "Error";
      case ErrorSeverity.MEDIUM: return "Error";
      case ErrorSeverity.LOW: return "Notice";
      default: return "Error";
    }
  }

  try {
    return t(`Errors.titles.${severity}`);
  } catch {
    return "Error";
  }
}

/**
 * Extracts validation errors from API response details with i18n
 */
export function extractValidationErrorsI18n(processedError: ProcessedErrorI18n, t?: any): Record<string, string> {
  if (!processedError.details || !processedError.details.validationErrors) {
    return {};
  }

  const errors: Record<string, string> = {};
  const validationErrors = processedError.details.validationErrors;

  // Handle different validation error formats
  if (Array.isArray(validationErrors)) {
    validationErrors.forEach((error: any) => {
      if (error.field && error.message) {
        // Try to get translated message if error has code
        if (error.code && t) {
          const translatedMessage = getFieldErrorI18n(
            { ...processedError, code: error.code }, 
            error.field, 
            t
          );
          errors[error.field] = translatedMessage || error.message;
        } else {
          errors[error.field] = error.message;
        }
      }
    });
  } else if (typeof validationErrors === 'object') {
    Object.keys(validationErrors).forEach(field => {
      errors[field] = validationErrors[field];
    });
  }

  return errors;
}
