// src/types/domain/metrics.types.ts

/**
 * Tipos de métricas disponibles en el sistema
 */
export enum MetricType {
  CURRENT = 'current',
  VOLTAGE = 'voltage', 
  POWER = 'power',
  EFFICIENCY = 'efficiency',
  FREQUENCY = 'frequency',
  TEMPERATURE = 'temperature',
  CUSTOM = 'custom'
}

/**
 * Fases eléctricas disponibles
 */
export enum ElectricalPhase {
  A = 'A',
  B = 'B', 
  C = 'C',
  NEUTRAL = 'N'
}

/**
 * Unidades de medida comunes
 */
export enum MeasurementUnit {
  AMPERE = 'A',
  VOLT = 'V',
  WATT = 'W',
  KILOWATT = 'kW',
  HERTZ = 'Hz',
  CELSIUS = '°C',
  PERCENTAGE = '%',
  UNIT = 'unit'
}

/**
 * Representación base de una métrica
 */
export interface MetricData {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly value: number;
  readonly unit: MeasurementUnit;
  readonly type: MetricType;
  readonly phase?: ElectricalPhase;
  readonly timestamp: Date;
  readonly quality?: MetricQuality;
  readonly limits?: MetricLimits;
  readonly tags?: string[];
}

/**
 * Calidad de la métrica (para validación)
 */
export interface MetricQuality {
  readonly isValid: boolean;
  readonly confidence: number; // 0-1
  readonly source: string;
  readonly validationRules?: string[];
}

/**
 * Límites de la métrica para alertas
 */
export interface MetricLimits {
  readonly min?: number;
  readonly max?: number;
  readonly warning?: {
    readonly min?: number;
    readonly max?: number;
  };
  readonly critical?: {
    readonly min?: number;
    readonly max?: number;
  };
}

/**
 * Datos para crear una nueva métrica
 */
export interface CreateMetricData {
  readonly name: string;
  readonly description?: string;
  readonly unit: MeasurementUnit;
  readonly type: MetricType;
  readonly phase?: ElectricalPhase;
  readonly limits?: MetricLimits;
  readonly tags?: string[];
}

/**
 * Datos para actualizar una métrica existente
 */
export interface UpdateMetricData {
  readonly name?: string;
  readonly description?: string;
  readonly value?: number;
  readonly unit?: MeasurementUnit;
  readonly type?: MetricType;
  readonly phase?: ElectricalPhase;
  readonly limits?: MetricLimits;
  readonly tags?: string[];
}

/**
 * Filtros para consultar métricas
 */
export interface MetricFilters {
  readonly type?: MetricType[];
  readonly phase?: ElectricalPhase[];
  readonly tags?: string[];
  readonly dateRange?: {
    readonly from: Date;
    readonly to: Date;
  };
  readonly valueRange?: {
    readonly min?: number;
    readonly max?: number;
  };
}

/**
 * Agregación de datos históricos
 */
export interface MetricAggregation {
  readonly metricId: string;
  readonly timeframe: TimeFrame;
  readonly values: {
    readonly timestamp: Date;
    readonly average: number;
    readonly min: number;
    readonly max: number;
    readonly count: number;
  }[];
}

/**
 * Marcos temporales para agregación
 */
export enum TimeFrame {
  MINUTE = 'minute',
  HOUR = 'hour', 
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}