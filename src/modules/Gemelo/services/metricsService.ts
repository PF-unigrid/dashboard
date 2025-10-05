// src/modules/fuel-optimizer/services/metricsService.ts

import { MetricData } from '../../../types/global.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const metricsService = {
  /**
   * Obtiene todas las métricas del sistema
   */
  async getMetrics(): Promise<MetricData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics`);
      if (!response.ok) throw new Error('Error fetching metrics');
      return await response.json();
    } catch (error) {
      console.error('Error getting metrics:', error);
      // Retornar datos mock en caso de error
      return [];
    }
  },

  /**
   * Obtiene una métrica específica por ID
   */
  async getMetricById(id: string): Promise<MetricData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/${id}`);
      if (!response.ok) throw new Error('Error fetching metric');
      return await response.json();
    } catch (error) {
      console.error('Error getting metric:', error);
      return null;
    }
  },

  /**
   * Crea una nueva métrica
   */
  async createMetric(metric: Omit<MetricData, 'id' | 'timestamp'>): Promise<MetricData> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
      if (!response.ok) throw new Error('Error creating metric');
      return await response.json();
    } catch (error) {
      console.error('Error creating metric:', error);
      throw error;
    }
  },

  /**
   * Actualiza una métrica existente
   */
  async updateMetric(id: string, metric: Partial<MetricData>): Promise<MetricData> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
      if (!response.ok) throw new Error('Error updating metric');
      return await response.json();
    } catch (error) {
      console.error('Error updating metric:', error);
      throw error;
    }
  },

  /**
   * Elimina una métrica
   */
  async deleteMetric(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting metric');
    } catch (error) {
      console.error('Error deleting metric:', error);
      throw error;
    }
  },

  /**
   * Obtiene métricas en tiempo real (WebSocket simulado)
   */
  subscribeToMetrics(callback: (metrics: MetricData[]) => void): () => void {
    // Simular actualización en tiempo real
    const interval = setInterval(async () => {
      const metrics = await this.getMetrics();
      callback(metrics);
    }, 3000);

    return () => clearInterval(interval);
  }
};