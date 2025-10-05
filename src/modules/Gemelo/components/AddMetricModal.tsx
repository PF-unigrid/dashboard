// src/modules/fuel-optimizer/components/AddMetricModal.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { MetricData } from '../../../types/global.types';

interface AddMetricModalProps {
  onAdd: (metric: Omit<MetricData, 'id' | 'timestamp'>) => void;
  onClose: () => void;
}

export const AddMetricModal: React.FC<AddMetricModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<MetricData['type']>('custom');
  const [phase, setPhase] = useState<'A' | 'B' | 'C'>('A');
  const [unit, setUnit] = useState('');

  const handleSubmit = () => {
    if (name && unit) {
      onAdd({
        name,
        type,
        phase: ['current', 'voltage', 'power'].includes(type) ? phase : undefined,
        value: Math.random() * 100,
        unit
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Agregar Métrica</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <Input
              placeholder="Ej: Temperatura"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MetricData['type'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="current">Corriente</option>
              <option value="voltage">Voltaje</option>
              <option value="power">Potencia</option>
              <option value="efficiency">Eficiencia</option>
              <option value="frequency">Frecuencia</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {['current', 'voltage', 'power'].includes(type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fase
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as 'A' | 'B' | 'C')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="A">Fase A</option>
                <option value="B">Fase B</option>
                <option value="C">Fase C</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <Input
              placeholder="Ej: A, V, W, Hz"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1 justify-center">
              Agregar
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1 justify-center">
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};