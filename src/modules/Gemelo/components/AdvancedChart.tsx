// src/modules/Gemelo/components/AdvancedChart.tsx

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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  fuelConsumption: number;
  efficiency: number;
  co2Emissions: number;
  engineTemp: number;
  rpm: number;
  cost: number;
}

interface AdvancedChartProps {
  timeRange: string;
}

export const AdvancedChart: React.FC<AdvancedChartProps> = ({ timeRange }) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('area');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['fuelConsumption', 'efficiency']);

  // Generate realistic data based on time range
  const chartData = useMemo(() => {
    const points = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    const data: ChartDataPoint[] = [];
    
    const now = new Date();
    const interval = timeRange === '1h' ? 5 : timeRange === '24h' ? 60 : timeRange === '7d' ? 60 * 24 : 60 * 24;
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 1000);
      const baseConsumption = 15.5;
      const baseEfficiency = 93;
      
      data.push({
        time: timeRange === '1h' || timeRange === '24h' 
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fuelConsumption: baseConsumption + Math.sin(i * 0.1) * 2 + (Math.random() - 0.5) * 1.5,
        efficiency: baseEfficiency + Math.cos(i * 0.15) * 4 + (Math.random() - 0.5) * 2,
        co2Emissions: 2.2 + Math.sin(i * 0.08) * 0.5 + (Math.random() - 0.5) * 0.3,
        engineTemp: 85 + Math.sin(i * 0.12) * 8 + (Math.random() - 0.5) * 3,
        rpm: 1800 + Math.sin(i * 0.09) * 150 + (Math.random() - 0.5) * 50,
        cost: (baseConsumption + Math.sin(i * 0.1) * 2) * 1.45 // $1.45 per liter
      });
    }
    
    return data;
  }, [timeRange]);

  const pieData = [
    { name: 'Engine Efficiency', value: 94.2, color: '#10B981' },
    { name: 'Transmission Loss', value: 3.1, color: '#F59E0B' },
    { name: 'Heat Loss', value: 1.8, color: '#EF4444' },
    { name: 'Other Losses', value: 0.9, color: '#8B5CF6' }
  ];

  const metricConfig = {
    fuelConsumption: { 
      stroke: '#3B82F6', 
      fill: '#3B82F6', 
      name: 'Fuel Consumption (L/h)' 
    },
    efficiency: { 
      stroke: '#10B981', 
      fill: '#10B981', 
      name: 'Efficiency (%)' 
    },
    co2Emissions: { 
      stroke: '#8B5CF6', 
      fill: '#8B5CF6', 
      name: 'CO2 Emissions (kg/h)' 
    },
    engineTemp: { 
      stroke: '#F59E0B', 
      fill: '#F59E0B', 
      name: 'Engine Temp (°C)' 
    },
    rpm: { 
      stroke: '#EF4444', 
      fill: '#EF4444', 
      name: 'RPM' 
    },
    cost: { 
      stroke: '#06B6D4', 
      fill: '#06B6D4', 
      name: 'Cost ($/h)' 
    }
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

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metric => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={metricConfig[metric as keyof typeof metricConfig].stroke}
                strokeWidth={3}
                dot={false}
                name={metricConfig[metric as keyof typeof metricConfig].name}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metric => (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={metricConfig[metric as keyof typeof metricConfig].stroke}
                fill={`${metricConfig[metric as keyof typeof metricConfig].fill}20`}
                strokeWidth={2}
                name={metricConfig[metric as keyof typeof metricConfig].name}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData.slice(-12)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map(metric => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={metricConfig[metric as keyof typeof metricConfig].fill}
                name={metricConfig[metric as keyof typeof metricConfig].name}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <GlassCard variant="gradient" className="w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Performance Analytics</h3>
          <p className="text-slate-600">Real-time metrics visualization</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-white/50 rounded-xl p-1">
            {[
              { type: 'area' as const, icon: Activity, label: 'Area' },
              { type: 'line' as const, icon: TrendingUp, label: 'Line' },
              { type: 'bar' as const, icon: BarChart3, label: 'Bar' },
              { type: 'pie' as const, icon: PieChartIcon, label: 'Pie' }
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

      {/* Metric Selection */}
      {chartType !== 'pie' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(metricConfig).map(([key, config]) => (
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
      )}

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>No data available</div>}
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
        {selectedMetrics.slice(0, 4).map(metric => {
          const values = chartData.map(d => d[metric as keyof ChartDataPoint] as number);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const config = metricConfig[metric as keyof typeof metricConfig];
          
          return (
            <div key={metric} className="text-center">
              <div className="text-xs text-slate-500 mb-1">{config.name}</div>
              <div className="text-lg font-bold text-slate-800">{avg.toFixed(1)}</div>
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