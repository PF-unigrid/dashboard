// src/modules/fuel-optimizer/components/MetricsChart.tsx

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../../components/ui/Card';
import { MetricData } from '../../../types/global.types';

interface MetricsChartProps {
  metrics: MetricData[];
}

interface ChartDataPoint {
  time: string;
  [key: string]: string | number;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ metrics }) => {
  const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Inicializar métricas seleccionadas (primeras 4 por defecto)
  useEffect(() => {
    if (selectedMetrics.length === 0 && metrics.length > 0) {
      setSelectedMetrics(metrics.slice(0, 4).map(m => m.id));
    }
  }, [metrics, selectedMetrics.length]);

  // Actualizar datos históricos
  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    const newDataPoint: ChartDataPoint = {
      time: timeString,
    };

    metrics.forEach(metric => {
      newDataPoint[metric.id] = metric.value;
    });

    setHistoricalData(prev => {
      const updated = [...prev, newDataPoint];
      // Mantener solo los últimos 20 puntos
      return updated.slice(-20);
    });
  }, [metrics]);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else {
        return [...prev, metricId];
      }
    });
  };

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  const getMetricColor = (index: number) => colors[index % colors.length];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Métricas</h2>
        
        {/* Selector de métricas */}
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric, index) => {
            const isSelected = selectedMetrics.includes(metric.id);
            const color = getMetricColor(index);
            
            return (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={isSelected ? { backgroundColor: color } : {}}
              >
                {metric.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gráfica */}
      {historicalData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const metric = metrics.find(m => m.id === value);
                return metric ? `${metric.name} (${metric.unit})` : value;
              }}
            />
            {selectedMetrics.map((metricId) => {
              const metric = metrics.find(m => m.id === metricId);
              if (!metric) return null;
              
              const metricIndex = metrics.findIndex(m => m.id === metricId);

              return (
                <Line
                  key={metricId}
                  type="monotone"
                  dataKey={metricId}
                  stroke={getMetricColor(metricIndex)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={metricId}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-500">
          <p>Recopilando datos...</p>
        </div>
      )}
    </Card>
  );
};