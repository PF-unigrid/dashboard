// src/modules/fuel-optimizer/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingScreen } from '../../../components/ui/LoadingSpinner';
import { MetricCard } from './MetricCard';
import { AddMetricModal } from './AddMetricModal';
import { MetricsChart } from './MetricsChart';
import { MetricData } from '../../../types/global.types';

export const Dashboard: React.FC = () => {
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
  
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2,
        timestamp: new Date()
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAddMetric = (newMetric: Omit<MetricData, 'id' | 'timestamp'>) => {
    const metric: MetricData = {
      ...newMetric,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMetrics(prev => [...prev, metric]);
  };

  const handleRemoveMetric = (id: string) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitoreo de Sistema Eléctrico en Tiempo Real</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowChart(!showChart)}>
            <BarChart3 className="w-5 h-5" />
            {showChart ? 'Ocultar' : 'Mostrar'} Gráfica
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-5 h-5" />
            Agregar Métrica
          </Button>
        </div>
      </div>

      {showChart && (
        <div className="mb-8">
          <MetricsChart metrics={metrics} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <MetricCard 
            key={metric.id} 
            metric={metric}
            onRemove={handleRemoveMetric}
          />
        ))}
      </div>

      {showModal && (
        <AddMetricModal
          onAdd={handleAddMetric}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};