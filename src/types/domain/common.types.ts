// src/types/domain/common.types.ts

/**
 * Estado de carga genérico para operaciones asíncronas
 */
export interface LoadingState {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly lastUpdated: Date | null;
}

/**
 * Resultado de operaciones que pueden fallar
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly success: true;
  readonly data: T;
}

export interface Failure<E = Error> {
  readonly success: false;
  readonly error: E;
}

/**
 * Información de paginación
 */
export interface PaginationInfo {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: PaginationInfo;
}

/**
 * Configuración de ordenamiento
 */
export interface SortConfig {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

/**
 * Opciones de consulta genéricas
 */
export interface QueryOptions {
  readonly page?: number;
  readonly pageSize?: number;
  readonly sort?: SortConfig;
  readonly search?: string;
}

/**
 * Configuración de notificaciones
 */
export interface NotificationConfig {
  readonly type: 'success' | 'error' | 'warning' | 'info';
  readonly title: string;
  readonly message: string;
  readonly duration?: number;
  readonly actions?: NotificationAction[];
}

export interface NotificationAction {
  readonly label: string;
  readonly handler: () => void;
  readonly variant?: 'primary' | 'secondary';
}

/**
 * Configuración de tema
 */
export interface ThemeConfig {
  readonly mode: 'light' | 'dark' | 'auto';
  readonly primaryColor: string;
  readonly fontSize: 'small' | 'medium' | 'large';
}

/**
 * Configuraciones de usuario
 */
export interface UserPreferences {
  readonly theme: ThemeConfig;
  readonly notifications: {
    readonly email: boolean;
    readonly push: boolean;
    readonly desktop: boolean;
  };
  readonly dashboard: {
    readonly defaultView: string;
    readonly refreshInterval: number;
    readonly chartType: 'line' | 'bar' | 'area';
  };
}