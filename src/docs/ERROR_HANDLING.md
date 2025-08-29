# Error Handling System - Frontend

This document describes the complete error handling system implemented in the frontend to integrate with backend error codes.

## System Architecture

### 1. Types and Constants (`/src/types/errors.ts`)

Contains all type definitions and constants related to errors:

```typescript
// API error response interface
export interface ApiErrorResponse {
  status: "error";
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}

// Enum with all error codes
export enum ErrorCode {
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  PATIENT_EMAIL_DUPLICATE = "PATIENT_EMAIL_DUPLICATE",
  // ... more codes
}
```

### 2. Error Handling Utilities (`/src/utils/errorHandler.ts`)

Main functions for processing and handling errors:

```typescript
// Processes any error and returns a standardized object
export function processError(error: any): ProcessedError;

// Automatically handles the error (toast + logging)
export function handleError(error: any): ProcessedError;

// Checks if an error should be shown in forms
export function isFormError(error: ProcessedError): boolean;
```

### 3. Notification System (`/src/utils/notifications.ts`)

Enhanced notification system with error integration:

```typescript
// Main notification service
export class NotificationService {
  static success(message: string, title?: string);
  static error(message: string, title?: string);
  static fromError(processedError: ProcessedError);
}

// Context-specific helpers
export const notifications = {
  auth: {
    loginSuccess: () => showSuccess("You have successfully logged in"),
    sessionExpired: () => showWarning("Your session has expired"),
  },
  patients: {
    created: () => showSuccess("Patient created successfully"),
    // ...
  },
};
```

### 4. React Hooks (`/src/hooks/useErrorHandler.ts`)

Specialized hooks for different use cases:

#### `useErrorHandler()` - General Hook

```typescript
const { error, fieldErrors, handleError, withErrorHandling, clearError } =
  useErrorHandler();
```

#### `useFormErrorHandler()` - For Forms

```typescript
const { getFieldProps, handleFormSubmit, hasFieldError, getErrorForField } =
  useFormErrorHandler();
```

#### `useQueryErrorHandler()` - For React Query

```typescript
const { onQueryError, onMutationError } = useQueryErrorHandler();
```

### 5. Updated Axios Interceptor (`/src/services/api/http.ts`)

The interceptor now handles specific error codes and automatic redirects:

```typescript
api.interceptors.response.use(
  (response) => {
    // Automatically unwraps { data: {...} }
    if (response.data && "data" in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Handles automatic redirects for authentication errors
    const LOGIN_REDIRECT_CODES = [
      ErrorCode.AUTH_SESSION_INVALID,
      ErrorCode.AUTH_TOKEN_EXPIRED,
      // ...
    ];

    if (errorCode && LOGIN_REDIRECT_CODES.includes(errorCode)) {
      sessionStorage.clear();
      window.location.href = "/login?session=expired";
    }

    return Promise.reject(errorData || error);
  }
);
```

## Usage Guides

### For Forms

```typescript
function LoginForm() {
  const { error, fieldErrors, getFieldProps, handleFormSubmit, hasFieldError } =
    useFormErrorHandler();

  const onSubmit = async (values) => {
    try {
      await handleFormSubmit(
        () => login(values),
        () => {
          notifications.auth.loginSuccess();
          router.push("/dashboard");
        }
      );
    } catch (processedError) {
      // Error already processed and shown
      if (processedError.code === ErrorCode.AUTH_INVALID_CREDENTIALS) {
        form.setFocus("email");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email")}
        error={hasFieldError("email")}
        helperText={getFieldProps("email").helperText}
      />
    </form>
  );
}
```

### For React Query

```typescript
function PatientsList() {
  const { onQueryError, onMutationError } = useQueryErrorHandler();

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
    onError: onQueryError, // Processes but doesn't show toast
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onError: onMutationError, // Shows toast automatically
    onSuccess: () => {
      notifications.patients.deleted();
      refetch();
    },
  });
}
```

### For Manual API Calls

```typescript
function PatientProfile() {
  const { withErrorHandling } = useErrorHandler();

  const updatePatient = async (data) => {
    const result = await withErrorHandling(
      () => updatePatientAPI(patientId, data),
      {
        loadingState: true, // Maneja loading automáticamente
        onSuccess: () => {
          notifications.patients.updated();
        },
        onError: (error) => {
          if (error.code === ErrorCode.PATIENT_NOT_FOUND) {
            router.push("/patients");
          }
        },
      }
    );
  };
}
```

### For Direct Error Handling

```typescript
async function someFunction() {
  try {
    const result = await someAPICall();
    return result;
  } catch (error) {
    // Usa el manejador global directamente
    const processedError = handleError(error);

    // Manejo específico si es necesario
    if (processedError.code === ErrorCode.SPECIFIC_ERROR) {
      // hacer algo específico
    }
  }
}
```

## Main Error Codes

### Authentication Errors

- `AUTH_INVALID_CREDENTIALS` - Invalid credentials
- `AUTH_SESSION_INVALID` - Invalid session (redirects to login)
- `AUTH_TOKEN_EXPIRED` - Expired token (redirects to login)
- `AUTH_EMAIL_IN_USE` - Email ya registrado

### Patient Errors

- `PATIENT_NOT_FOUND` - Paciente no encontrado
- `PATIENT_EMAIL_DUPLICATE` - Email duplicado en el centro
- `PATIENT_ACCESS_DENIED` - Sin acceso al paciente

### Center Errors

- `CENTER_NOT_FOUND` - Centro no encontrado
- `CENTER_NO_ASSOCIATION` - Usuario sin centro asociado
- `CENTER_INSUFFICIENT_PERMISSIONS` - Permisos insuficientes

### Validation Errors

- `EMAIL_INVALID` - Formato de email inválido
- `PASSWORD_TOO_SHORT` - Contraseña muy corta
- `VALIDATION_FAILED` - Validación general fallida

## Severity Levels

Los errores se clasifican en 4 niveles:

- **CRITICAL**: Requieren atención inmediata (errores de servidor, sesiones inválidas)
- **HIGH**: Errores importantes que bloquean funcionalidad
- **MEDIUM**: Errores que afectan la experiencia del usuario
- **LOW**: Errores informativos o fácilmente recuperables

## Error Flow

1. **Error occurs** in API call
2. **Axios interceptor** captures the error
   - If it's a critical authentication error → Redirects to login
   - Propagates the error with complete structure
3. **Error handling system** processes the error
   - Determines type and severity
   - Decides whether to show in toast or form
4. **Component** receives processed error
   - Can handle specific cases
   - UI updates automatically

## Best Practices

### ✅ Do

- Use the appropriate hooks for each case
- Handle specific error codes when needed
- Use context-specific notifications (`notifications.patients.created()`)
- Clear errors when the user starts typing
- Test different error scenarios

### ❌ Avoid

- Manually handle errors without using the system
- Show technical errors to the final user
- Ignore errors silently
- Duplicate error handling logic
- Don't clear errors in forms

## Testing

```typescript
// Ejemplo de test con el sistema de errores
it("should handle login error correctly", async () => {
  // Mock API to return specific error
  mockLogin.mockRejectedValueOnce({
    status: "error",
    error: {
      code: "AUTH_INVALID_CREDENTIALS",
      message: "Invalid credentials",
    },
  });

  // Render component and submit form
  // Assert that error message is displayed
  // Assert that specific field is focused if needed
});
```

## Migrating Existing Code

1. **Identify** components that manually handle errors
2. **Replace** with the appropriate hooks
3. **Update** tests to use new error codes
4. **Verify** that error flows work correctly
5. **Clean** up duplicate error handling code

This system provides a consistent error handling experience across the entire application, improves the UX, and facilitates code maintenance.
