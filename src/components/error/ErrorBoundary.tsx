// src/components/error/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DomainError, ErrorType } from '../../utils/error.utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

/**
 * Error Boundary para capturar y manejar errores en la jerarquía de componentes
 * Aplica el patrón Fail Fast y proporciona una UX graceful
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generar ID único para el error
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error
    this.logError(error, errorInfo);
    
    // Callback opcional para manejo personalizado
    this.props.onError?.(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    // En desarrollo, log a la consola
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Details:', errorDetails);
      console.groupEnd();
    }

    // En producción, enviar a servicio de logging
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToLoggingService(errorDetails);
    }
  };

  private sendErrorToLoggingService = (errorDetails: any) => {
    // Implementar integración con servicio de logging (Sentry, LogRocket, etc.)
    try {
      // Mock implementation
      console.warn('Error sent to logging service:', errorDetails);
    } catch (loggingError) {
      console.error('Failed to send error to logging service:', loggingError);
    }
  };

  private retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  private getErrorType = (): ErrorType => {
    if (!this.state.error) return ErrorType.UNKNOWN_ERROR;
    
    if (this.state.error instanceof DomainError) {
      return this.state.error.type;
    }
    
    return ErrorType.SYSTEM_ERROR;
  };

  private getErrorSeverity = (): 'low' | 'medium' | 'high' | 'critical' => {
    const errorType = this.getErrorType();
    
    switch (errorType) {
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.NOT_FOUND_ERROR:
        return 'low';
      
      case ErrorType.NETWORK_ERROR:
      case ErrorType.API_ERROR:
        return 'medium';
      
      case ErrorType.AUTHENTICATION_ERROR:
      case ErrorType.AUTHORIZATION_ERROR:
        return 'high';
      
      case ErrorType.SYSTEM_ERROR:
      case ErrorType.UNKNOWN_ERROR:
        return 'critical';
      
      default:
        return 'medium';
    }
  };

  render() {
    if (this.state.hasError) {
      // Usar fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar UI de error por defecto
      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorId={this.state.errorId}
          errorType={this.getErrorType()}
          severity={this.getErrorSeverity()}
          onRetry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Componente de UI para mostrar errores
 */
interface ErrorFallbackProps {
  error: Error | null;
  errorId: string | null;
  errorType: ErrorType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  onRetry: () => void;
}

const ErrorFallbackUI: React.FC<ErrorFallbackProps> = ({
  error,
  errorId,
  errorType,
  severity,
  onRetry
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case ErrorType.NETWORK_ERROR:
        return 'Connection Problem';
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Authentication Required';
      case ErrorType.AUTHORIZATION_ERROR:
        return 'Access Denied';
      case ErrorType.NOT_FOUND_ERROR:
        return 'Content Not Found';
      case ErrorType.VALIDATION_ERROR:
        return 'Invalid Data';
      default:
        return 'Something went wrong';
    }
  };

  const getErrorMessage = () => {
    if (error instanceof DomainError) {
      return error.message;
    }
    
    switch (severity) {
      case 'low':
        return 'There was a minor issue. You can try again or continue using the app.';
      case 'medium':
        return 'There was a problem processing your request. Please try again.';
      case 'high':
        return 'A serious error occurred. Please refresh the page or contact support.';
      case 'critical':
        return 'A critical system error occurred. Please contact technical support immediately.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className={`max-w-md w-full rounded-lg border p-6 ${getSeverityColor()}`}>
        <div className="text-center">
          {/* Icono del error */}
          <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
            <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Título */}
          <h3 className="mb-2 text-lg font-semibold">
            {getErrorTitle()}
          </h3>

          {/* Mensaje */}
          <p className="mb-4 text-sm opacity-90">
            {getErrorMessage()}
          </p>

          {/* ID del error (para soporte técnico) */}
          {errorId && (
            <p className="mb-4 text-xs font-mono opacity-60">
              Error ID: {errorId}
            </p>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-white text-current border border-current rounded-md hover:bg-opacity-10 hover:bg-current transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-current text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>

          {/* Detalles técnicos (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium">
                Technical Details
              </summary>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32 text-gray-800">
                {error.stack || error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};