// src/modules/Gemelo/components/ProfessionalDashboard.tsx

import React, { useState, useEffect } from 'react';
import { 
  Fuel, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Gauge,
  ThermometerSun,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// ADVANCED METRICS INTERFACES
// ============================================================================

interface AdvancedMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: 'fuel' | 'efficiency' | 'environmental' | 'performance' | 'maintenance';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  target?: number;
  min?: number;
  max?: number;
  description: string;
  lastUpdated: Date;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
}

interface KPICard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  target?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ============================================================================
// PROFESSIONAL DASHBOARD COMPONENT
// ============================================================================

export const ProfessionalDashboard: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState<AdvancedMetric[]>([
    {
      id: '1',
      name: 'Fuel Consumption Rate',
      value: 15.7,
      unit: 'L/h',
      category: 'fuel',
      trend: 'down',
      trendValue: -2.3,
      status: 'optimal',
      target: 16.0,
      description: 'Current fuel consumption per hour',
      lastUpdated: new Date(),
      icon: Fuel,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: '2',
      name: 'Engine Efficiency',
      value: 94.2,
      unit: '%',
      category: 'efficiency',
      trend: 'up',
      trendValue: 1.8,
      status: 'optimal',
      target: 92.0,
      description: 'Overall engine fuel efficiency',
      lastUpdated: new Date(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500/20 to-green-500/20'
    },
    {
      id: '3',
      name: 'CO2 Emissions',
      value: 2.4,
      unit: 'kg/h',
      category: 'environmental',
      trend: 'down',
      trendValue: -5.2,
      status: 'optimal',
      target: 3.0,
      description: 'Carbon dioxide emissions rate',
      lastUpdated: new Date(),
      icon: ThermometerSun,
      color: 'text-green-600',
      bgGradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: '4',
      name: 'Engine RPM',
      value: 1850,
      unit: 'RPM',
      category: 'performance',
      trend: 'stable',
      trendValue: 0.1,
      status: 'optimal',
      target: 1800,
      min: 1500,
      max: 2200,
      description: 'Engine rotations per minute',
      lastUpdated: new Date(),
      icon: Gauge,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/20 to-violet-500/20'
    },
    {
      id: '5',
      name: 'Engine Temperature',
      value: 87,
      unit: '°C',
      category: 'performance',
      trend: 'up',
      trendValue: 2.1,
      status: 'warning',
      target: 85,
      max: 95,
      description: 'Engine operating temperature',
      lastUpdated: new Date(),
      icon: ThermometerSun,
      color: 'text-orange-600',
      bgGradient: 'from-orange-500/20 to-red-500/20'
    },
    {
      id: '6',
      name: 'Fuel Pressure',
      value: 42.3,
      unit: 'PSI',
      category: 'performance',
      trend: 'stable',
      trendValue: 0.0,
      status: 'optimal',
      target: 42.0,
      min: 38,
      max: 45,
      description: 'Fuel system pressure',
      lastUpdated: new Date(),
      icon: Activity,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-500/20 to-blue-500/20'
    }
  ]);

  const kpiCards: KPICard[] = [
    {
      title: 'Daily Fuel Savings',
      value: '12.5L',
      change: 8.2,
      changeType: 'increase',
      target: '15L',
      icon: Fuel,
      color: 'text-emerald-600'
    },
    {
      title: 'Cost Reduction',
      value: '$127.30',
      change: 15.4,
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Efficiency Score',
      value: '94.2%',
      change: 2.1,
      changeType: 'increase',
      target: '95%',
      icon: Gauge,
      color: 'text-blue-600'
    },
    {
      title: 'CO2 Reduction',
      value: '18.7kg',
      change: 11.3,
      changeType: 'increase',
      icon: ThermometerSun,
      color: 'text-purple-600'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * (metric.value * 0.02),
        lastUpdated: new Date(),
        trend: Math.random() > 0.7 ? 
          (Math.random() > 0.5 ? 'up' : 'down') : 
          metric.trend
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'offline': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50 bg-gradient-to-br from-slate-50 to-blue-50' : ''}`}>
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Fuel Optimizer Pro
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Real-time fuel consumption monitoring & optimization
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <Button
              variant="secondary"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
            
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <Settings className="w-5 h-5" />
              Settings
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <GlassCard key={index} variant="gradient" className="group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color.replace('text-', 'from-').replace('-600', '-100')} to-white/50`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  kpi.changeType === 'increase' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {kpi.changeType === 'increase' ? '↗' : '↘'} {kpi.change}%
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-600">{kpi.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">{kpi.value}</span>
                  {kpi.target && (
                    <span className="text-sm text-slate-500">/ {kpi.target}</span>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Advanced Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const StatusIcon = getStatusIcon(metric.status);
            
            return (
              <GlassCard key={metric.id} variant="gradient" className="group hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.bgGradient}`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{metric.name}</h3>
                      <p className="text-sm text-slate-600">{metric.description}</p>
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Value Display */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">
                      {metric.value.toFixed(1)}
                    </span>
                    <span className="text-lg text-slate-600">{metric.unit}</span>
                    
                    <div className={`ml-auto px-2 py-1 rounded-lg text-xs font-semibold ${
                      metric.trend === 'up' ? 'text-green-600 bg-green-100' :
                      metric.trend === 'down' ? 'text-red-600 bg-red-100' :
                      'text-slate-600 bg-slate-100'
                    }`}>
                      {metric.trend === 'up' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                      {metric.trend === 'down' && <TrendingDown className="w-3 h-3 inline mr-1" />}
                      {metric.trend === 'stable' && <Activity className="w-3 h-3 inline mr-1" />}
                      {Math.abs(metric.trendValue).toFixed(1)}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {metric.target && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Target: {metric.target} {metric.unit}</span>
                        <span className={`font-semibold ${
                          metric.value <= metric.target ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {((metric.value / metric.target) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            metric.value <= metric.target ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                          }`}
                          style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Last Updated */}
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated {metric.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Alert Center */}
        <GlassCard variant="gradient" className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">System Alerts</h3>
              <p className="text-slate-600">Recent notifications and recommendations</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">Engine Temperature Warning</h4>
                  <p className="text-yellow-700 text-sm">Engine temperature is approaching optimal range limit (87°C/85°C target)</p>
                  <span className="text-xs text-yellow-600">2 minutes ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Efficiency Optimization Complete</h4>
                  <p className="text-green-700 text-sm">Fuel consumption reduced by 2.3% through automatic optimization</p>
                  <span className="text-xs text-green-600">5 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};