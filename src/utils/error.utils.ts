// src/utils/error.utils.ts

/**
 * Tipos de errores del dominio de la aplicación
 */
export enum ErrorType {
  // Errores de validación
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Errores de red/API
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  
  // Errores de autenticación/autorización
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  
  // Errores de datos
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  
  // Errores del sistema
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Clase base para errores del dominio
 */
export abstract class DomainError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    type: ErrorType,
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.code = code;
    this.context = context;
    this.timestamp = new Date();
    
    // Mantener el stack trace correcto
    if ('captureStackTrace' in Error && typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializa el error para logging/debugging
   */
  public toJSON() {
    return {
      name: this.name,
      type: this.type,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }
}

/**
 * Error de validación de datos
 */
export class ValidationError extends DomainError {
  public readonly field?: string;
  public readonly constraints?: string[];

  constructor(
    message: string,
    code: string = 'VALIDATION_FAILED',
    field?: string,
    constraints?: string[],
    context?: Record<string, unknown>
  ) {
    super(ErrorType.VALIDATION_ERROR, message, code, context);
    this.field = field;
    this.constraints = constraints;
  }
}

/**
 * Error de red/conectividad
 */
export class NetworkError extends DomainError {
  public readonly statusCode?: number;
  public readonly url?: string;

  constructor(
    message: string,
    code: string = 'NETWORK_FAILED',
    statusCode?: number,
    url?: string,
    context?: Record<string, unknown>
  ) {
    super(ErrorType.NETWORK_ERROR, message, code, context);
    this.statusCode = statusCode;
    this.url = url;
  }
}

/**
 * Error de API/servicio externo
 */
export class ApiError extends DomainError {
  public readonly statusCode: number;
  public readonly response?: unknown;

  constructor(
    message: string,
    statusCode: number,
    code: string = 'API_ERROR',
    response?: unknown,
    context?: Record<string, unknown>
  ) {
    super(ErrorType.API_ERROR, message, code, context);
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Error de autenticación
 */
export class AuthenticationError extends DomainError {
  constructor(
    message: string = 'Authentication failed',
    code: string = 'AUTH_FAILED',
    context?: Record<string, unknown>
  ) {
    super(ErrorType.AUTHENTICATION_ERROR, message, code, context);
  }
}

/**
 * Error de autorización
 */
export class AuthorizationError extends DomainError {
  public readonly requiredPermission?: string;

  constructor(
    message: string = 'Access denied',
    code: string = 'ACCESS_DENIED',
    requiredPermission?: string,
    context?: Record<string, unknown>
  ) {
    super(ErrorType.AUTHORIZATION_ERROR, message, code, context);
    this.requiredPermission = requiredPermission;
  }
}

/**
 * Error de recurso no encontrado
 */
export class NotFoundError extends DomainError {
  public readonly resourceType?: string;
  public readonly resourceId?: string;

  constructor(
    message: string = 'Resource not found',
    code: string = 'NOT_FOUND',
    resourceType?: string,
    resourceId?: string,
    context?: Record<string, unknown>
  ) {
    super(ErrorType.NOT_FOUND_ERROR, message, code, context);
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
}

/**
 * Error del sistema/aplicación
 */
export class SystemError extends DomainError {
  constructor(
    message: string = 'System error occurred',
    code: string = 'SYSTEM_ERROR',
    context?: Record<string, unknown>
  ) {
    super(ErrorType.SYSTEM_ERROR, message, code, context);
  }
}

/**
 * Utilidades para manejo de errores
 */
export class ErrorUtils {
  /**
   * Convierte errores de HTTP en errores del dominio
   */
  static fromHttpError(error: any, url?: string): DomainError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError(
        'Network connection failed',
        'NETWORK_UNAVAILABLE',
        undefined,
        url
      );
    }

    if (error.status || error.statusCode) {
      const status = error.status || error.statusCode;
      
      if (status === 401) {
        return new AuthenticationError('Authentication required');
      }
      
      if (status === 403) {
        return new AuthorizationError('Access forbidden');
      }
      
      if (status === 404) {
        return new NotFoundError('Resource not found');
      }
      
      if (status >= 400 && status < 500) {
        return new ApiError(
          error.message || 'Client error',
          status,
          'CLIENT_ERROR',
          error.response
        );
      }
      
      if (status >= 500) {
        return new ApiError(
          error.message || 'Server error',
          status,
          'SERVER_ERROR',
          error.response
        );
      }
    }

    return new SystemError(
      error.message || 'Unknown error occurred',
      'UNKNOWN_ERROR',
      { originalError: error }
    );
  }

  /**
   * Determina si un error es recuperable
   */
  static isRecoverable(error: DomainError): boolean {
    const recoverableTypes = [
      ErrorType.NETWORK_ERROR,
      ErrorType.VALIDATION_ERROR
    ];
    
    return recoverableTypes.includes(error.type);
  }

  /**
   * Obtiene mensaje user-friendly para el error
   */
  static getUserFriendlyMessage(error: DomainError): string {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return 'Connection problem. Please check your internet connection and try again.';
      
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Please log in to continue.';
      
      case ErrorType.AUTHORIZATION_ERROR:
        return 'You do not have permission to perform this action.';
      
      case ErrorType.NOT_FOUND_ERROR:
        return 'The requested resource was not found.';
      
      case ErrorType.VALIDATION_ERROR:
        return error.message; // Los errores de validación ya son user-friendly
      
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
}