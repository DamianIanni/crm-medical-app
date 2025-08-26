import { useState, useCallback } from 'react';
import { 
  handleError, 
  processError, 
  isFormError, 
  getFieldError, 
  extractValidationErrors,
  ProcessedError
} from '@/utils/errorHandler';

/**
 * Hook for handling errors with state management and form integration
 */
export function useErrorHandler() {
  const [error, setError] = useState<ProcessedError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle error and determine if it should be shown as toast or form error
   */
  const handleErrorWithState = useCallback((error: any) => {
    const processedError = processError(error);
    setError(processedError);

    if (isFormError(processedError)) {
      // Extract validation errors for form fields
      const validationErrors = extractValidationErrors(processedError);
      setFieldErrors(validationErrors);
    } else {
      // Clear form errors for non-form errors and let the global handler show toast
      setFieldErrors({});
      handleError(error); // This will show toast if appropriate
    }

    return processedError;
  }, []);

  /**
   * Clear all errors
   */
  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  /**
   * Clear specific field error
   */
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Get error for specific field
   */
  const getErrorForField = useCallback((field: string): string | null => {
    // First check specific field errors from validation
    if (fieldErrors[field]) {
      return fieldErrors[field];
    }

    // Then check if current error applies to this field
    if (error) {
      return getFieldError(error, field);
    }

    return null;
  }, [error, fieldErrors]);

  /**
   * Check if there's an error for specific field
   */
  const hasFieldError = useCallback((field: string): boolean => {
    return !!getErrorForField(field);
  }, [getErrorForField]);

  /**
   * Wrapper for async operations with error handling
   */
  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      loadingState?: boolean;
      clearErrorsFirst?: boolean;
      onError?: (error: ProcessedError) => void;
      onSuccess?: (result: T) => void;
    }
  ): Promise<T | null> => {
    const { 
      loadingState = false, 
      clearErrorsFirst = true,
      onError,
      onSuccess 
    } = options || {};

    try {
      if (clearErrorsFirst) {
        clearError();
      }
      
      if (loadingState) {
        setIsLoading(true);
      }

      const result = await operation();
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const processedError = handleErrorWithState(err);
      
      if (onError) {
        onError(processedError);
      }

      return null;
    } finally {
      if (loadingState) {
        setIsLoading(false);
      }
    }
  }, [handleErrorWithState, clearError]);

  return {
    // State
    error,
    fieldErrors,
    isLoading,
    
    // Error handling
    handleError: handleErrorWithState,
    clearError,
    clearFieldError,
    
    // Field-specific helpers
    getErrorForField,
    hasFieldError,
    
    // Async wrapper
    withErrorHandling,
  };
}

/**
 * Hook specifically for form error handling
 */
export function useFormErrorHandler() {
  const {
    error,
    fieldErrors,
    handleError,
    clearError,
    clearFieldError,
    getErrorForField,
    hasFieldError,
  } = useErrorHandler();

  /**
   * Get form field props for integration with form libraries
   */
  const getFieldProps = useCallback((fieldName: string) => ({
    error: hasFieldError(fieldName),
    helperText: getErrorForField(fieldName) || '',
    onFocus: () => clearFieldError(fieldName),
  }), [hasFieldError, getErrorForField, clearFieldError]);

  /**
   * Handle form submission with error handling
   */
  const handleFormSubmit = useCallback(async <T>(
    submitFn: () => Promise<T>,
    onSuccess?: (result: T) => void
  ) => {
    try {
      clearError();
      const result = await submitFn();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const processedError = handleError(err);
      throw processedError; // Re-throw for form library to handle if needed
    }
  }, [clearError, handleError]);

  return {
    error,
    fieldErrors,
    getFieldProps,
    handleFormSubmit,
    clearError,
    clearFieldError,
    getErrorForField,
    hasFieldError,
  };
}

/**
 * Hook for React Query integration
 */
export function useQueryErrorHandler() {
  const { handleError } = useErrorHandler();

  /**
   * Error handler for React Query queries
   */
  const onQueryError = useCallback((error: any) => {
    // Don't show toast for query errors by default - let components decide
    return processError(error);
  }, []);

  /**
   * Error handler for React Query mutations
   */
  const onMutationError = useCallback((error: any) => {
    // Show toast for mutation errors by default
    return handleError(error);
  }, [handleError]);

  return {
    onQueryError,
    onMutationError,
  };
}
