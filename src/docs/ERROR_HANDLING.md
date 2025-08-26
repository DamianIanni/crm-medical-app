# Sistema de Manejo de Errores - Frontend

Este documento describe el sistema completo de manejo de errores implementado en el frontend para integrar con los códigos de error del backend.

## Arquitectura del Sistema

### 1. Tipos y Constantes (`/src/types/errors.ts`)

Contiene toda la definición de tipos y constantes relacionadas con errores:

```typescript
// Interfaz de respuesta de error de la API
export interface ApiErrorResponse {
  status: "error";
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}

// Enum con todos los códigos de error
export enum ErrorCode {
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  PATIENT_EMAIL_DUPLICATE = 'PATIENT_EMAIL_DUPLICATE',
  // ... más códigos
}
```

### 2. Utilidades de Manejo de Errores (`/src/utils/errorHandler.ts`)

Funciones principales para procesar y manejar errores:

```typescript
// Procesa cualquier error y devuelve un objeto estandarizado
export function processError(error: any): ProcessedError

// Maneja automáticamente el error (toast + logging)
export function handleError(error: any): ProcessedError

// Verifica si un error debe mostrarse en formularios
export function isFormError(error: ProcessedError): boolean
```

### 3. Sistema de Notificaciones (`/src/utils/notifications.ts`)

Sistema mejorado de notificaciones con integración de errores:

```typescript
// Servicio principal de notificaciones
export class NotificationService {
  static success(message: string, title?: string)
  static error(message: string, title?: string)
  static fromError(processedError: ProcessedError)
}

// Helpers específicos por contexto
export const notifications = {
  auth: {
    loginSuccess: () => showSuccess("Has iniciado sesión correctamente"),
    sessionExpired: () => showWarning("Tu sesión ha expirado")
  },
  patients: {
    created: () => showSuccess("Paciente creado correctamente"),
    // ...
  }
}
```

### 4. Hooks para React (`/src/hooks/useErrorHandler.ts`)

Hooks especializados para diferentes casos de uso:

#### `useErrorHandler()` - Hook general
```typescript
const {
  error,
  fieldErrors,
  handleError,
  withErrorHandling,
  clearError
} = useErrorHandler();
```

#### `useFormErrorHandler()` - Para formularios
```typescript
const {
  getFieldProps,
  handleFormSubmit,
  hasFieldError,
  getErrorForField
} = useFormErrorHandler();
```

#### `useQueryErrorHandler()` - Para React Query
```typescript
const { onQueryError, onMutationError } = useQueryErrorHandler();
```

### 5. Interceptor de Axios Actualizado (`/src/services/api/http.ts`)

El interceptor ahora maneja códigos de error específicos y redirecciones automáticas:

```typescript
api.interceptors.response.use(
  (response) => {
    // Desenvuelve automáticamente { data: {...} }
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Maneja redirecciones automáticas para errores de autenticación
    const LOGIN_REDIRECT_CODES = [
      ErrorCode.AUTH_SESSION_INVALID,
      ErrorCode.AUTH_TOKEN_EXPIRED,
      // ...
    ];
    
    if (errorCode && LOGIN_REDIRECT_CODES.includes(errorCode)) {
      sessionStorage.clear();
      window.location.href = '/login?session=expired';
    }
    
    return Promise.reject(errorData || error);
  }
);
```

## Guías de Uso

### Para Formularios

```typescript
function LoginForm() {
  const {
    error,
    fieldErrors,
    getFieldProps,
    handleFormSubmit,
    hasFieldError,
  } = useFormErrorHandler();

  const onSubmit = async (values) => {
    try {
      await handleFormSubmit(
        () => login(values),
        () => {
          notifications.auth.loginSuccess();
          router.push('/dashboard');
        }
      );
    } catch (processedError) {
      // Error ya procesado y mostrado
      if (processedError.code === ErrorCode.AUTH_INVALID_CREDENTIALS) {
        form.setFocus('email');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        error={hasFieldError('email')}
        helperText={getFieldProps('email').helperText}
      />
    </form>
  );
}
```

### Para React Query

```typescript
function PatientsList() {
  const { onQueryError, onMutationError } = useQueryErrorHandler();

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getAllPatients,
    onError: onQueryError // Procesa pero no muestra toast
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onError: onMutationError, // Muestra toast automáticamente
    onSuccess: () => {
      notifications.patients.deleted();
      refetch();
    }
  });
}
```

### Para Llamadas API Manuales

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
            router.push('/patients');
          }
        }
      }
    );
  };
}
```

### Para Manejo Directo

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

## Códigos de Error Principales

### Errores de Autenticación
- `AUTH_INVALID_CREDENTIALS` - Credenciales incorrectas
- `AUTH_SESSION_INVALID` - Sesión inválida (redirige al login)
- `AUTH_TOKEN_EXPIRED` - Token expirado (redirige al login)
- `AUTH_EMAIL_IN_USE` - Email ya registrado

### Errores de Pacientes
- `PATIENT_NOT_FOUND` - Paciente no encontrado
- `PATIENT_EMAIL_DUPLICATE` - Email duplicado en el centro
- `PATIENT_ACCESS_DENIED` - Sin acceso al paciente

### Errores de Centro Médico
- `CENTER_NOT_FOUND` - Centro no encontrado
- `CENTER_NO_ASSOCIATION` - Usuario sin centro asociado
- `CENTER_INSUFFICIENT_PERMISSIONS` - Permisos insuficientes

### Errores de Validación
- `EMAIL_INVALID` - Formato de email inválido
- `PASSWORD_TOO_SHORT` - Contraseña muy corta
- `VALIDATION_FAILED` - Validación general fallida

## Niveles de Severidad

Los errores se clasifican en 4 niveles:

- **CRITICAL**: Requieren atención inmediata (errores de servidor, sesiones inválidas)
- **HIGH**: Errores importantes que bloquean funcionalidad
- **MEDIUM**: Errores que afectan la experiencia del usuario
- **LOW**: Errores informativos o fácilmente recuperables

## Flujo de Errores

1. **Error ocurre** en llamada API
2. **Interceptor de Axios** captura el error
   - Si es error de autenticación crítico → Redirige al login
   - Propaga el error con estructura completa
3. **Sistema de manejo** procesa el error
   - Determina tipo y severidad
   - Decide si mostrar en toast o formulario
4. **Componente** recibe error procesado
   - Puede manejar casos específicos
   - UI se actualiza automáticamente

## Mejores Prácticas

### ✅ Hacer
- Usar los hooks apropiados para cada caso
- Manejar códigos de error específicos cuando sea necesario
- Usar las notificaciones contextuales (`notifications.patients.created()`)
- Limpiar errores cuando el usuario empiece a escribir
- Testear diferentes escenarios de error

### ❌ Evitar
- Manejar errores manualmente sin usar el sistema
- Mostrar errores técnicos al usuario final
- Ignorar errores silenciosamente
- Duplicar lógica de manejo de errores
- No limpiar errores en formularios

## Testing

```typescript
// Ejemplo de test con el sistema de errores
it('should handle login error correctly', async () => {
  // Mock API to return specific error
  mockLogin.mockRejectedValueOnce({
    status: 'error',
    error: {
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Invalid credentials'
    }
  });

  // Render component and submit form
  // Assert that error message is displayed
  // Assert that specific field is focused if needed
});
```

## Migración de Código Existente

1. **Identificar** componentes que manejan errores manualmente
2. **Reemplazar** con los hooks apropiados
3. **Actualizar** pruebas para usar los nuevos códigos de error
4. **Verificar** que los flujos de error funcionen correctamente
5. **Limpiar** código de manejo de errores duplicado

Este sistema proporciona una experiencia consistente de manejo de errores en toda la aplicación, mejora la UX y facilita el mantenimiento del código.
