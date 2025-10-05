// src/modules/Gemelo/components/ElectricalChart.tsx

import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { TrendingUp, BarChart3, Activity, Zap } from 'lucide-react';

interface ElectricalDataPoint {
  time: string;
  voltageA: number;
  voltageB: number;
  voltageC: number;
  currentA: number;
  currentB: number;
  currentC: number;
  activePower: number;
  powerFactor: number;
  frequency: number;
  temperature: number;
}

interface ElectricalChartProps {
  timeRange: string;
  selectedNode: string;
}

interface MetricConfig {
  stroke: string;
  name: string;
}

interface CategoryConfig {
  metrics: Record<string, MetricConfig>;
  referenceLine: { value: number; label: string };
}

type MetricCategoryKey = 'voltage' | 'current' | 'power' | 'other';

const METRIC_CATEGORIES: Record<MetricCategoryKey, CategoryConfig> = {
  voltage: {
    metrics: {
      voltageA: { stroke: '#EF4444', name: 'Voltage Phase A (V)' },
      voltageB: { stroke: '#F59E0B', name: 'Voltage Phase B (V)' },
      voltageC: { stroke: '#3B82F6', name: 'Voltage Phase C (V)' }
    },
    referenceLine: { value: 230, label: 'Nominal (230V)' }
  },
  current: {
    metrics: {
      currentA: { stroke: '#EF4444', name: 'Current Phase A (A)' },
      currentB: { stroke: '#F59E0B', name: 'Current Phase B (A)' },
      currentC: { stroke: '#3B82F6', name: 'Current Phase C (A)' }
    },
    referenceLine: { value: 20, label: 'Max Rating (20A)' }
  },
  power: {
    metrics: {
      activePower: { stroke: '#10B981', name: 'Active Power (kW)' },
      powerFactor: { stroke: '#8B5CF6', name: 'Power Factor' }
    },
    referenceLine: { value: 15, label: 'Max Capacity (15kW)' }
  },
  other: {
    metrics: {
      frequency: { stroke: '#06B6D4', name: 'Frequency (Hz)' },
      temperature: { stroke: '#F97316', name: 'Temperature (°C)' }
    },
    referenceLine: { value: 60, label: 'Nominal (60Hz)' }
  }
};

export const ElectricalChart: React.FC<ElectricalChartProps> = ({ timeRange, selectedNode }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['voltageA', 'voltageB', 'voltageC']);
  const [metricCategory, setMetricCategory] = useState<MetricCategoryKey>('voltage');

  // Generate realistic electrical data
  const chartData = useMemo(() => {
    const points = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    const data: ElectricalDataPoint[] = [];
    
    const now = new Date();
    const interval = timeRange === '1h' ? 5 : timeRange === '24h' ? 60 : timeRange === '7d' ? 60 * 24 : 60 * 24;
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 1000);
      
      // Base values for electrical parameters
      const baseVoltage = 230;
      const baseCurrent = 15;
      const timeOffset = i * 0.1;
      
      data.push({
        time: timeRange === '1h' || timeRange === '24h' 
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        
        // Three-phase voltages (120° apart)
        voltageA: baseVoltage + Math.sin(timeOffset) * 3 + (Math.random() - 0.5) * 2,
        voltageB: baseVoltage + Math.sin(timeOffset + 2.09) * 3 + (Math.random() - 0.5) * 2, // +120°
        voltageC: baseVoltage + Math.sin(timeOffset + 4.19) * 3 + (Math.random() - 0.5) * 2, // +240°
        
        // Three-phase currents
        currentA: baseCurrent + Math.sin(timeOffset + 0.5) * 2 + (Math.random() - 0.5) * 1,
        currentB: baseCurrent + Math.sin(timeOffset + 2.59) * 2 + (Math.random() - 0.5) * 1,
        currentC: baseCurrent + Math.sin(timeOffset + 4.69) * 2 + (Math.random() - 0.5) * 1,
        
        // Power calculations
        activePower: 10 + Math.sin(timeOffset * 0.8) * 1.5 + (Math.random() - 0.5) * 0.8,
        powerFactor: 0.95 + Math.sin(timeOffset * 0.3) * 0.05 + (Math.random() - 0.5) * 0.02,
        
        // System parameters
        frequency: 60 + Math.sin(timeOffset * 0.2) * 0.2 + (Math.random() - 0.5) * 0.1,
        temperature: 65 + Math.sin(timeOffset * 0.15) * 8 + (Math.random() - 0.5) * 3,
      });
    }
    
    return data;
  }, [timeRange, selectedNode]);

  const currentCategory = METRIC_CATEGORIES[metricCategory];

  const getMetricConfig = (metric: string): MetricConfig => {
    return currentCategory.metrics[metric] || { stroke: '#000000', name: metric };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard variant="blur" padding="sm" className="border-none shadow-2xl">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(2)}
            </p>
          ))}
        </GlassCard>
      );
    }
    return null;
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handleCategoryChange = (category: MetricCategoryKey) => {
    setMetricCategory(category);
    setSelectedMetrics(Object.keys(METRIC_CATEGORIES[category].metrics));
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const chartElement = (() => {
      switch (chartType) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {currentCategory.referenceLine && (
                <ReferenceLine 
                  y={currentCategory.referenceLine.value} 
                  stroke="#94A3B8" 
                  strokeDasharray="5 5"
                  label={currentCategory.referenceLine.label}
                />
              )}
              {selectedMetrics.map(metric => {
                const config = getMetricConfig(metric);
                return (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={config.stroke}
                    strokeWidth={2}
                    dot={false}
                    name={config.name}
                  />
                );
              })}
            </LineChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {currentCategory.referenceLine && (
                <ReferenceLine 
                  y={currentCategory.referenceLine.value} 
                  stroke="#94A3B8" 
                  strokeDasharray="5 5"
                  label={currentCategory.referenceLine.label}
                />
              )}
              {selectedMetrics.map(metric => {
                const config = getMetricConfig(metric);
                return (
                  <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={config.stroke}
                    fill={`${config.stroke}20`}
                    strokeWidth={2}
                    name={config.name}
                  />
                );
              })}
            </AreaChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps} data={chartData.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {selectedMetrics.map(metric => {
                const config = getMetricConfig(metric);
                return (
                  <Bar
                    key={metric}
                    dataKey={metric}
                    fill={config.stroke}
                    name={config.name}
                    radius={[4, 4, 0, 0]}
                  />
                );
              })}
            </BarChart>
          );

        default:
          return null;
      }
    })();

    return chartElement;
  };

  return (
    <GlassCard variant="gradient" className="w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Electrical Parameters</h3>
          <p className="text-slate-600">Real-time electrical measurements visualization</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-white/50 rounded-xl p-1">
            {[
              { type: 'line' as const, icon: TrendingUp, label: 'Line' },
              { type: 'area' as const, icon: Activity, label: 'Area' },
              { type: 'bar' as const, icon: BarChart3, label: 'Bar' }
            ].map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={chartType === type ? "primary" : "secondary"}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 ${
                  chartType === type 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-transparent text-slate-600 hover:bg-white/60'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(METRIC_CATEGORIES) as MetricCategoryKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              metricCategory === key
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-600 bg-white/60 hover:bg-white/80'
            }`}
          >
            {key === 'voltage' && <Zap className="w-4 h-4 inline mr-1" />}
            {key === 'current' && <Activity className="w-4 h-4 inline mr-1" />}
            {key === 'power' && <TrendingUp className="w-4 h-4 inline mr-1" />}
            {key === 'other' && <BarChart3 className="w-4 h-4 inline mr-1" />}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(currentCategory.metrics).map(([key, config]) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMetrics.includes(key)
                ? 'text-white shadow-lg'
                : 'text-slate-600 bg-white/60 hover:bg-white/80'
            }`}
            style={selectedMetrics.includes(key) ? {
              backgroundColor: config.stroke,
              boxShadow: `0 4px 14px 0 ${config.stroke}40`
            } : {}}
          >
            {config.name}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>No data available</div>}
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
        {selectedMetrics.slice(0, 4).map(metric => {
          const values = chartData.map(d => d[metric as keyof ElectricalDataPoint] as number);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const config = getMetricConfig(metric);
          
          return (
            <div key={metric} className="text-center">
              <div className="text-xs text-slate-500 mb-1">{config.name.split(' ')[0]}</div>
              <div className="text-lg font-bold text-slate-800">{avg.toFixed(2)}</div>
              <div className="text-xs text-slate-500">
                {min.toFixed(1)} - {max.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};