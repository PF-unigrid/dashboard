// src/modules/settings/components/SettingsPage.tsx

import React, { useState } from 'react';
import { Settings, Bell, Shield, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('3');

  const handleSave = () => {
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Configuración
        </h1>
        <p className="text-gray-600 mt-1">Personaliza tu experiencia en Fuel Optimizer</p>
      </div>

      <div className="space-y-6">
        {/* Notificaciones */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Notificaciones</h2>
              <p className="text-gray-600 mb-4">Configura cómo quieres recibir alertas del sistema</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Habilitar notificaciones</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Actualización Automática */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Datos en Tiempo Real</h2>
              <p className="text-gray-600 mb-4">Configura la frecuencia de actualización de métricas</p>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Actualización automática</span>
                </label>

                {autoRefresh && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intervalo de actualización (segundos)
                    </label>
                    <Input
                      type="number"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Seguridad */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Seguridad</h2>
              <p className="text-gray-600 mb-4">Administra la seguridad de tu cuenta</p>
              
              <Button variant="secondary">
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        </Card>

        {/* Botón Guardar */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};