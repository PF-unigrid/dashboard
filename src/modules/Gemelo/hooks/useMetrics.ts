// src/modules/fuel-optimizer/hooks/useMetrics.ts

import { useState, useEffect } from 'react';
import { MetricData } from '../../../types/global.types';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
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
  ]);

  useEffect(() => {
    // Actualización en tiempo real
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2,
        timestamp: new Date()
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addMetric = (newMetric: Omit<MetricData, 'id' | 'timestamp'>) => {
    const metric: MetricData = {
      ...newMetric,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMetrics(prev => [...prev, metric]);
  };

  const removeMetric = (id: string) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  return {
    metrics,
    addMetric,
    removeMetric
  };
};