// src/types/services/metrics.service.interface.ts

import type {
  MetricData,
  CreateMetricData,
  UpdateMetricData,
  MetricFilters,
  MetricAggregation,
  TimeFrame
} from '../domain/metrics.types';
import type { Result, PaginatedResponse, QueryOptions } from '../domain/common.types';

/**
 * Interfaz para el servicio de métricas
 * Aplica el principio de Inversión de Dependencias (DIP)
 */
export interface IMetricsService {
  /**
   * Obtiene todas las métricas con filtros opcionales
   */
  getMetrics(options?: QueryOptions & { filters?: MetricFilters }): Promise<Result<PaginatedResponse<MetricData>>>;
  
  /**
   * Obtiene una métrica específica por ID
   */
  getMetricById(id: string): Promise<Result<MetricData | null>>;
  
  /**
   * Crea una nueva métrica
   */
  createMetric(metricData: CreateMetricData): Promise<Result<MetricData>>;
  
  /**
   * Actualiza una métrica existente
   */
  updateMetric(id: string, metricData: UpdateMetricData): Promise<Result<MetricData>>;
  
  /**
   * Elimina una métrica
   */
  deleteMetric(id: string): Promise<Result<void>>;
  
  /**
   * Suscribe a actualizaciones en tiempo real de métricas
   */
  subscribeToMetrics(
    callback: (metrics: MetricData[]) => void,
    filters?: MetricFilters
  ): () => void;
  
  /**
   * Obtiene datos agregados históricos
   */
  getAggregatedData(
    metricIds: string[],
    timeFrame: TimeFrame,
    dateRange: { from: Date; to: Date }
  ): Promise<Result<MetricAggregation[]>>;
}

/**
 * Interfaz para el repositorio de métricas
 */
export interface IMetricsRepository {
  /**
   * Encuentra métricas con filtros
   */
  findMany(options?: QueryOptions & { filters?: MetricFilters }): Promise<Result<PaginatedResponse<MetricData>>>;
  
  /**
   * Encuentra una métrica por ID
   */
  findById(id: string): Promise<Result<MetricData | null>>;
  
  /**
   * Crea una nueva métrica
   */
  create(metricData: CreateMetricData): Promise<Result<MetricData>>;
  
  /**
   * Actualiza una métrica
   */
  update(id: string, metricData: UpdateMetricData): Promise<Result<MetricData>>;
  
  /**
   * Elimina una métrica
   */
  delete(id: string): Promise<Result<void>>;
  
  /**
   * Guarda valores históricos de métricas
   */
  saveHistoricalData(metricId: string, value: number, timestamp: Date): Promise<Result<void>>;
}

/**
 * Interfaz para cliente de datos en tiempo real
 */
export interface IRealtimeClient {
  /**
   * Se conecta al servidor de datos en tiempo real
   */
  connect(): Promise<Result<void>>;
  
  /**
   * Se desconecta del servidor
   */
  disconnect(): Promise<Result<void>>;
  
  /**
   * Suscribe a un canal específico
   */
  subscribe(channel: string, callback: (data: any) => void): () => void;
  
  /**
   * Publica datos a un canal
   */
  publish(channel: string, data: any): Promise<Result<void>>;
  
  /**
   * Verifica el estado de la conexión
   */
  isConnected(): boolean;
}