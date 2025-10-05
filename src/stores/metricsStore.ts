// src/stores/metricsStore.ts

import { create } from 'zustand';
import { MetricData } from '../types/global.types';

interface MetricsState {
  metrics: MetricData[];
  isLoading: boolean;
  addMetric: (metric: Omit<MetricData, 'id' | 'timestamp'>) => void;
  removeMetric: (id: string) => void;
  updateMetric: (id: string, updates: Partial<MetricData>) => void;
  updateMetrics: (metrics: MetricData[]) => void;
  setLoading: (isLoading: boolean) => void;
}

const initialMetrics: MetricData[] = [
  { id: '1', name: 'Corriente A', value: 45.2, unit: 'A', type: 'current', phase: 'A', timestamp: new Date() },
  { id: '2', name: 'Corriente B', value: 43.8, unit: 'A', type: 'current', phase: 'B', timestamp: new Date() },
  { id: '3', name: 'Corriente C', value: 44.5, unit: 'A', type: 'current', phase: 'C', timestamp: new Date() },
  { id: '4', name: 'Voltaje A', value: 220, unit: 'V', type: 'voltage', phase: 'A', timestamp: new Date() },
  { id: '5', name: 'Voltaje B', value: 218, unit: 'V', type: 'voltage', phase: 'B', timestamp: new Date() },
  { id: '6', name: 'Voltaje C', value: 221, unit: 'V', type: 'voltage', phase: 'C', timestamp: new Date() },
  { id: '7', name: 'Potencia A', value: 9944, unit: 'W', type: 'power', phase: 'A', timestamp: new Date() },
  { id: '8', name: 'Potencia B', value: 9546, unit: 'W', type: 'power', phase: 'B', timestamp: new Date() },
  { id: '9', name: 'Potencia C', value: 9835, unit: 'W', type: 'power', phase: 'C', timestamp: new Date() },
  { id: '10', name: 'Eficiencia', value: 94.5, unit: '%', type: 'efficiency', timestamp: new Date() },
  { id: '11', name: 'Frecuencia', value: 60, unit: 'Hz', type: 'frequency', timestamp: new Date() },
];

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: initialMetrics,
  isLoading: true,

  addMetric: (newMetric) => {
    const metric: MetricData = {
      ...newMetric,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    set((state) => ({ metrics: [...state.metrics, metric] }));
  },

  removeMetric: (id) => {
    set((state) => ({
      metrics: state.metrics.filter((m) => m.id !== id)
    }));
  },

  updateMetric: (id, updates) => {
    set((state) => ({
      metrics: state.metrics.map((m) =>
        m.id === id ? { ...m, ...updates, timestamp: new Date() } : m
      )
    }));
  },

  updateMetrics: (metrics) => {
    set({ metrics });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

// Función para simular actualización en tiempo real
export const startMetricsPolling = () => {
  const interval = setInterval(() => {
    const { metrics } = useMetricsStore.getState();
    const updatedMetrics = metrics.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 2,
      timestamp: new Date()
    }));
    useMetricsStore.getState().updateMetrics(updatedMetrics);
  }, 3000);

  return () => clearInterval(interval);
};