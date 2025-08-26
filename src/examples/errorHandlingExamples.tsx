/**
 * Error Handling Integration Examples
 * 
 * This file demonstrates different patterns for integrating the new error
 * handling system with various scenarios in your application.
 */

import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormErrorHandler, useErrorHandler, useQueryErrorHandler } from '@/hooks/useErrorHandler';
import { handleError } from '@/utils/errorHandler';
import { notifications } from '@/utils/notifications';
import { ErrorCode } from '@/types/errors';

// API services
import { 
  createPatient, 
  getAllPatients, 
  updatePatient, 
  deletePatient 
} from '@/services/api/patient';
import { PatientPayload } from '@/services/api/patient';

/**
 * Example 1: React Query Integration - Patient List Component
 */
export function PatientListExample() {
  const { onQueryError, onMutationError } = useQueryErrorHandler();

  // Query with automatic error handling
  const {
    data: patients,
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['patients'],
    queryFn: () => getAllPatients(1, 10, ''),
    onError: (error) => {
      // Process error but don't show toast - let component handle it
      const processedError = onQueryError(error);
      
      // Handle specific error cases
      if (processedError.code === ErrorCode.CENTER_NO_ASSOCIATION) {
        // Maybe redirect to center selection
      }
    }
  });

  // Mutation with automatic error handling
  const deletePatientMutation = useMutation({
    mutationFn: deletePatient,
    onError: onMutationError, // This will show toast automatically
    onSuccess: () => {
      notifications.patients.deleted();
      refetch();
    }
  });

  const handleDeletePatient = (patientId: string) => {
    deletePatientMutation.mutate(patientId);
  };

  // Show custom error UI for query errors if needed
  if (queryError) {
    const processedError = onQueryError(queryError);
    
    if (processedError.code === ErrorCode.CENTER_NO_ASSOCIATION) {
      return (
        <div className="text-center p-8">
          <h3>No tienes un centro médico asociado</h3>
          <p>Contacta con tu administrador para obtener acceso.</p>
        </div>
      );
    }

    return (
      <div className="text-center p-8">
        <p>Error al cargar pacientes: {processedError.message}</p>
        <button onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      {isLoading && <p>Cargando pacientes...</p>}
      {patients?.map((patient: any) => (
        <div key={patient.id}>
          <span>{patient.first_name} {patient.last_name}</span>
          <button 
            onClick={() => handleDeletePatient(patient.id)}
            disabled={deletePatientMutation.isLoading}
          >
            {deletePatientMutation.isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 2: Form with Enhanced Error Handling
 */
export function CreatePatientFormExample() {
  const [formData, setFormData] = React.useState<PatientPayload>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    short_description: '',
    date_of_birth: '',
  });

  const {
    error,
    fieldErrors,
    hasFieldError,
    getErrorForField,
    handleFormSubmit,
    clearFieldError,
  } = useFormErrorHandler();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleFormSubmit(
        () => createPatient(formData),
        () => {
          notifications.patients.created();
          // Reset form
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            short_description: '',
            date_of_birth: '',
          });
        }
      );
    } catch (processedError: any) {
      // Additional handling if needed
      if (processedError.code === ErrorCode.PATIENT_EMAIL_DUPLICATE) {
        // Focus on email field
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof PatientPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (hasFieldError(field)) {
      clearFieldError(field);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Nombre *</label>
        <input
          value={formData.first_name}
          onChange={(e) => handleFieldChange('first_name', e.target.value)}
          className={hasFieldError('first_name') ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {hasFieldError('first_name') && (
          <p className="text-red-500 text-sm">
            {getErrorForField('first_name')}
          </p>
        )}
      </div>

      <div>
        <label>Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          className={hasFieldError('email') ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {hasFieldError('email') && (
          <p className="text-red-500 text-sm">
            {getErrorForField('email')}
          </p>
        )}
      </div>

      {/* Show general error if not field-specific */}
      {error && !Object.keys(fieldErrors).length && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-700">{error.message}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? 'Creando...' : 'Crear Paciente'}
      </button>
    </form>
  );
}

/**
 * Example 3: Manual Error Handling with async/await
 */
export function ManualApiCallExample() {
  const { withErrorHandling } = useErrorHandler();
  const [patients, setPatients] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadPatients = async () => {
    const result = await withErrorHandling(
      () => getAllPatients(1, 10, ''),
      {
        loadingState: true, // This will automatically manage loading state
        onSuccess: (data) => {
          setPatients(data);
          // Optionally show success message
          // notifications.general.loaded();
        },
        onError: (error) => {
          // Custom error handling
          if (error.code === ErrorCode.CENTER_NO_ASSOCIATION) {
            // Handle specific error case
          }
        }
      }
    );

    return result;
  };

  React.useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div>
      <button onClick={loadPatients} disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Recargar'}
      </button>
      
      {patients.map((patient: any) => (
        <div key={patient.id}>{patient.first_name}</div>
      ))}
    </div>
  );
}

/**
 * Example 4: Direct Error Handling without hooks
 */
export function DirectErrorHandlingExample() {
  const [patient, setPatient] = React.useState<any>(null);

  const updatePatientInfo = async (patientId: string, updates: Partial<PatientPayload>) => {
    try {
      const result = await updatePatient(patientId, updates);
      setPatient(result);
      notifications.patients.updated();
    } catch (error) {
      // Use the global error handler directly
      const processedError = handleError(error);
      
      // Handle specific cases
      if (processedError.code === ErrorCode.PATIENT_NOT_FOUND) {
        // Maybe navigate back to patient list
      }
    }
  };

  return (
    <div>
      {patient && (
        <div>
          <h3>{patient.first_name} {patient.last_name}</h3>
          <button onClick={() => updatePatientInfo(patient.id, { phone: '123-456-7890' })}>
            Actualizar Teléfono
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Error Boundary Integration
 */
export class ErrorBoundaryExample extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Use the error handler for logging and processing
    const processedError = handleError(error);
    
    // Log to external service
    console.error('Error boundary caught:', { processedError, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error inesperado.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Example 6: Global Error Context (if you want to track errors globally)
 */
const ErrorContext = React.createContext<{
  errors: any[];
  clearErrors: () => void;
}>({
  errors: [],
  clearErrors: () => {},
});

export function GlobalErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = React.useState<any[]>([]);

  const clearErrors = () => setErrors([]);

  // Listen to unhandled errors
  React.useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      const processedError = handleError(event.error);
      setErrors(prev => [...prev, processedError]);
    };

    window.addEventListener('error', handleUnhandledError);
    
    return () => {
      window.removeEventListener('error', handleUnhandledError);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export const useGlobalErrors = () => React.useContext(ErrorContext);
