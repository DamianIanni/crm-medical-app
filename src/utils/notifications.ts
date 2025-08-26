import { ToastFeedback } from "@/components/feedback/toastFeedback";
import { ErrorCode, ErrorSeverity } from "@/types/errors";
import { ProcessedError } from "@/utils/errorHandler";

// Toast type mapping based on context
export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * Enhanced notification system with better error integration
 */
export class NotificationService {
  /**
   * Show success notification
   */
  static success(message: string, title?: string) {
    ToastFeedback({
      title: title || "Éxito",
      description: message,
      type: "success",
    });
  }

  /**
   * Show error notification
   */
  static error(message: string, title?: string) {
    ToastFeedback({
      title: title || "Error",
      description: message,
      type: "error",
    });
  }

  /**
   * Show info notification
   */
  static info(message: string, title?: string) {
    ToastFeedback({
      title: title || "Información",
      description: message,
      type: "info",
    });
  }

  /**
   * Show warning notification
   */
  static warning(message: string, title?: string) {
    ToastFeedback({
      title: title || "Advertencia",
      description: message,
      type: "info", // Use info type since we don't have warning in ToastFeedback
    });
  }

  /**
   * Show notification based on processed error
   */
  static fromError(processedError: ProcessedError) {
    const title = this.getErrorTitle(processedError.severity);
    const type = this.getToastTypeFromSeverity(processedError.severity);

    ToastFeedback({
      title,
      description: processedError.message,
      type,
    });
  }

  /**
   * Show notification for specific error codes with custom handling
   */
  static forErrorCode(errorCode: ErrorCode, customMessage?: string) {
    const messages = this.getSpecialErrorMessages();
    const message = customMessage || messages[errorCode];
    
    if (message) {
      const severity = this.getSeverityForErrorCode(errorCode);
      const title = this.getErrorTitle(severity);
      const type = this.getToastTypeFromSeverity(severity);

      ToastFeedback({
        title,
        description: message,
        type,
      });
    }
  }

  /**
   * Get appropriate title based on error severity
   */
  private static getErrorTitle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return "Error Crítico";
      case ErrorSeverity.HIGH:
        return "Error";
      case ErrorSeverity.MEDIUM:
        return "Error";
      case ErrorSeverity.LOW:
        return "Aviso";
      default:
        return "Error";
    }
  }

  /**
   * Map severity to toast type
   */
  private static getToastTypeFromSeverity(severity: ErrorSeverity): "success" | "error" | "info" {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return "error";
      case ErrorSeverity.MEDIUM:
        return "error";
      case ErrorSeverity.LOW:
        return "info";
      default:
        return "error";
    }
  }

  /**
   * Special error messages for specific error codes
   */
  private static getSpecialErrorMessages(): Partial<Record<ErrorCode, string>> {
    return {
      [ErrorCode.INTERNAL_SERVER_ERROR]: "Estamos experimentando problemas técnicos. Nuestro equipo ya está trabajando en solucionarlo.",
      [ErrorCode.CENTER_NO_ASSOCIATION]: "Parece que no estás asociado a ningún centro médico. Contacta con tu administrador.",
      [ErrorCode.PATIENT_EMAIL_DUPLICATE]: "Este email ya está en uso por otro paciente en tu centro.",
      [ErrorCode.AUTH_EMAIL_IN_USE]: "Este email ya está registrado. ¿Intentaste iniciar sesión en su lugar?",
    };
  }

  /**
   * Get severity for error code (fallback mapping)
   */
  private static getSeverityForErrorCode(errorCode: ErrorCode): ErrorSeverity {
    // This is a simplified mapping - in real app you'd import from ErrorSeverityMap
    const criticalCodes = [ErrorCode.INTERNAL_SERVER_ERROR, ErrorCode.AUTH_SESSION_INVALID];
    const highCodes = [ErrorCode.AUTH_ACCESS_DENIED, ErrorCode.FORBIDDEN];
    const lowCodes = [ErrorCode.EMAIL_INVALID, ErrorCode.PASSWORD_TOO_SHORT];

    if (criticalCodes.includes(errorCode)) return ErrorSeverity.CRITICAL;
    if (highCodes.includes(errorCode)) return ErrorSeverity.HIGH;
    if (lowCodes.includes(errorCode)) return ErrorSeverity.LOW;
    
    return ErrorSeverity.MEDIUM;
  }
}

/**
 * Convenience functions for common notifications
 */

export const showSuccess = (message: string, title?: string) => {
  NotificationService.success(message, title);
};

export const showError = (message: string, title?: string) => {
  NotificationService.error(message, title);
};

export const showInfo = (message: string, title?: string) => {
  NotificationService.info(message, title);
};

export const showWarning = (message: string, title?: string) => {
  NotificationService.warning(message, title);
};

/**
 * Context-specific notification helpers
 */

export const notifications = {
  // Auth related
  auth: {
    loginSuccess: () => showSuccess("Has iniciado sesión correctamente", "Bienvenido"),
    logoutSuccess: () => showInfo("Has cerrado sesión correctamente", "Sesión cerrada"),
    sessionExpired: () => showWarning("Tu sesión ha expirado. Por favor, inicia sesión nuevamente."),
    passwordResetSent: () => showSuccess("Te hemos enviado un email con instrucciones para restablecer tu contraseña."),
    passwordResetSuccess: () => showSuccess("Tu contraseña ha sido restablecida correctamente."),
  },

  // Patient related
  patients: {
    created: () => showSuccess("Paciente creado correctamente"),
    updated: () => showSuccess("Información del paciente actualizada"),
    deleted: () => showInfo("Paciente eliminado correctamente"),
    noteAdded: () => showSuccess("Nota agregada correctamente"),
    noteUpdated: () => showSuccess("Nota actualizada correctamente"),
    noteDeleted: () => showInfo("Nota eliminada correctamente"),
  },

  // User management
  users: {
    invited: () => showSuccess("Invitación enviada correctamente"),
    roleUpdated: () => showSuccess("Rol de usuario actualizado"),
    removed: () => showInfo("Usuario removido del centro"),
  },

  // Center management
  centers: {
    created: () => showSuccess("Centro médico creado correctamente"),
    updated: () => showSuccess("Centro médico actualizado"),
    selected: () => showSuccess("Centro médico seleccionado"),
  },

  // Account management
  account: {
    updated: () => showSuccess("Perfil actualizado correctamente"),
    deleted: () => showInfo("Cuenta eliminada correctamente"),
  },

  // General operations
  general: {
    saved: () => showSuccess("Guardado correctamente"),
    loading: () => showInfo("Cargando..."),
    offline: () => showWarning("Sin conexión a internet"),
    online: () => showInfo("Conexión restablecida"),
  }
};

// Export default as the service
export default NotificationService;
