// src/modules/fuel-optimizer/components/MetricCard.tsx

import React from 'react';
import { Activity, Zap, TrendingUp, X } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { MetricData } from '../../../types/global.types';

interface MetricCardProps {
  metric: MetricData;
  onRemove?: (id: string) => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, onRemove }) => {
  const icons = {
    current: Activity,
    voltage: Zap,
    power: TrendingUp,
    efficiency: TrendingUp,
    frequency: Activity,
    custom: Activity
  };

  const Icon = icons[metric.type];
  
  const phaseColors = {
    A: 'bg-red-100 text-red-600',
    B: 'bg-yellow-100 text-yellow-600',
    C: 'bg-blue-100 text-blue-600'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${metric.phase ? phaseColors[metric.phase] : 'bg-gray-100 text-gray-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{metric.name}</h3>
            {metric.phase && (
              <span className="text-xs text-gray-500">Fase {metric.phase}</span>
            )}
          </div>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(metric.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-800">
            {metric.value.toFixed(2)}
          </span>
          <span className="text-lg text-gray-500">{metric.unit}</span>
        </div>
        <div className="text-xs text-gray-400">
          Actualizado: {metric.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
};