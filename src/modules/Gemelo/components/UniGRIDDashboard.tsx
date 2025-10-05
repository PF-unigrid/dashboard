// src/modules/Gemelo/components/UniGRIDDashboard.tsx

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Gauge,
  ThermometerSun,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Maximize2,
  Minimize2,
  Cpu,
  Wifi,
  Battery
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';

// ============================================================================
// ELECTRICAL METRICS INTERFACES
// ============================================================================

interface ElectricalNode {
  id: string;
  name: string;
  location: string;
  type: 'generator' | 'load' | 'transformer' | 'meter' | 'switch';
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  lastUpdate: Date;
}

interface ElectricalMetric {
  id: string;
  nodeId: string;
  nodeName: string;
  name: string;
  value: number;
  unit: string;
  category: 'voltage' | 'current' | 'power' | 'frequency' | 'temperature' | 'energy';
  phase: 'A' | 'B' | 'C' | 'N' | 'ALL';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  limits: {
    min?: number;
    max?: number;
    warning?: { min?: number; max?: number };
    critical?: { min?: number; max?: number };
  };
  description: string;
  lastUpdated: Date;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
}

interface SystemKPI {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  target?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: 'good' | 'warning' | 'critical';
}

// ============================================================================
// UniGRID LAB DASHBOARD COMPONENT
// ============================================================================

export const UniGRIDDashboard: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedNode, setSelectedNode] = useState<string>('all');
  
  const [nodes] = useState<ElectricalNode[]>([
    {
      id: 'node-001',
      name: 'Generator Node 1',
      location: 'Lab Section A',
      type: 'generator',
      status: 'online',
      lastUpdate: new Date()
    },
    {
      id: 'node-002', 
      name: 'Load Node 1',
      location: 'Lab Section B',
      type: 'load',
      status: 'online',
      lastUpdate: new Date()
    },
    {
      id: 'node-003',
      name: 'Transformer T1',
      location: 'Lab Section C',
      type: 'transformer',
      status: 'warning',
      lastUpdate: new Date()
    },
    {
      id: 'node-004',
      name: 'Main Meter',
      location: 'Control Room',
      type: 'meter',
      status: 'online',
      lastUpdate: new Date()
    }
  ]);

  const [metrics, setMetrics] = useState<ElectricalMetric[]>([
    {
      id: '1',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Voltage Phase A',
      value: 230.5,
      unit: 'V',
      category: 'voltage',
      phase: 'A',
      trend: 'stable',
      trendValue: 0.2,
      status: 'normal',
      limits: { min: 207, max: 253, warning: { min: 215, max: 245 } },
      description: 'Line voltage measurement for phase A',
      lastUpdated: new Date(),
      icon: Zap,
      color: 'text-red-600',
      bgGradient: 'from-red-500/20 to-pink-500/20'
    },
    {
      id: '2',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Voltage Phase B',
      value: 229.8,
      unit: 'V',
      category: 'voltage',
      phase: 'B',
      trend: 'up',
      trendValue: 0.8,
      status: 'normal',
      limits: { min: 207, max: 253, warning: { min: 215, max: 245 } },
      description: 'Line voltage measurement for phase B',
      lastUpdated: new Date(),
      icon: Zap,
      color: 'text-yellow-600',
      bgGradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: '3',
      nodeId: 'node-001', 
      nodeName: 'Generator Node 1',
      name: 'Voltage Phase C',
      value: 231.2,
      unit: 'V',
      category: 'voltage',
      phase: 'C',
      trend: 'down',
      trendValue: -0.5,
      status: 'normal',
      limits: { min: 207, max: 253, warning: { min: 215, max: 245 } },
      description: 'Line voltage measurement for phase C',
      lastUpdated: new Date(),
      icon: Zap,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: '4',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Current Phase A',
      value: 15.7,
      unit: 'A',
      category: 'current',
      phase: 'A',
      trend: 'up',
      trendValue: 2.3,
      status: 'normal',
      limits: { max: 20, warning: { max: 18 }, critical: { max: 20 } },
      description: 'Line current measurement for phase A',
      lastUpdated: new Date(),
      icon: Activity,
      color: 'text-red-600',
      bgGradient: 'from-red-500/20 to-pink-500/20'
    },
    {
      id: '5',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Current Phase B',
      value: 14.2,
      unit: 'A',
      category: 'current',
      phase: 'B',
      trend: 'stable',
      trendValue: 0.1,
      status: 'normal',
      limits: { max: 20, warning: { max: 18 }, critical: { max: 20 } },
      description: 'Line current measurement for phase B',
      lastUpdated: new Date(),
      icon: Activity,
      color: 'text-yellow-600',
      bgGradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: '6',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Current Phase C',
      value: 16.1,
      unit: 'A',
      category: 'current',
      phase: 'C',
      trend: 'down',
      trendValue: -1.2,
      status: 'normal',
      limits: { max: 20, warning: { max: 18 }, critical: { max: 20 } },
      description: 'Line current measurement for phase C',
      lastUpdated: new Date(),
      icon: Activity,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: '7',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Active Power',
      value: 10.2,
      unit: 'kW',
      category: 'power',
      phase: 'ALL',
      trend: 'up',
      trendValue: 3.8,
      status: 'normal',
      limits: { max: 15, warning: { max: 12 } },
      description: 'Total active power consumption',
      lastUpdated: new Date(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500/20 to-green-500/20'
    },
    {
      id: '8',
      nodeId: 'node-001',
      nodeName: 'Generator Node 1',
      name: 'Power Factor',
      value: 0.95,
      unit: 'PF',
      category: 'power',
      phase: 'ALL',
      trend: 'stable',
      trendValue: 0.0,
      status: 'normal',
      limits: { min: 0.8, warning: { min: 0.85 } },
      description: 'System power factor',
      lastUpdated: new Date(),
      icon: Gauge,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/20 to-violet-500/20'
    },
    {
      id: '9',
      nodeId: 'node-002',
      nodeName: 'Load Node 1',
      name: 'Frequency',
      value: 59.98,
      unit: 'Hz',
      category: 'frequency',
      phase: 'ALL',
      trend: 'stable',
      trendValue: -0.02,
      status: 'normal',
      limits: { min: 59.5, max: 60.5, warning: { min: 59.7, max: 60.3 } },
      description: 'System frequency measurement',
      lastUpdated: new Date(),
      icon: Activity,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-500/20 to-blue-500/20'
    },
    {
      id: '10',
      nodeId: 'node-003',
      nodeName: 'Transformer T1',
      name: 'Temperature',
      value: 67,
      unit: '°C',
      category: 'temperature',
      phase: 'ALL',
      trend: 'up',
      trendValue: 2.5,
      status: 'warning',
      limits: { max: 80, warning: { max: 70 }, critical: { max: 85 } },
      description: 'Transformer winding temperature',
      lastUpdated: new Date(),
      icon: ThermometerSun,
      color: 'text-orange-600',
      bgGradient: 'from-orange-500/20 to-red-500/20'
    }
  ]);

  const systemKPIs: SystemKPI[] = [
    {
      title: 'Grid Stability',
      value: '99.2%',
      change: 0.3,
      changeType: 'increase',
      target: '99.5%',
      icon: Wifi,
      color: 'text-emerald-600',
      status: 'good'
    },
    {
      title: 'Power Quality',
      value: '94.7%',
      change: -1.2,
      changeType: 'decrease',
      icon: Gauge,
      color: 'text-blue-600',
      status: 'warning'
    },
    {
      title: 'System Efficiency',
      value: '96.8%',
      change: 2.1,
      changeType: 'increase',
      target: '97%',
      icon: TrendingUp,
      color: 'text-green-600',
      status: 'good'
    },
    {
      title: 'Active Nodes',
      value: '7/8',
      change: 0,
      changeType: 'increase',
      icon: Cpu,
      color: 'text-purple-600',
      status: 'warning'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        let newValue = metric.value;
        
        // Realistic electrical variations
        switch (metric.category) {
          case 'voltage':
            newValue = metric.value + (Math.random() - 0.5) * 2; // ±1V variation
            break;
          case 'current':
            newValue = Math.max(0, metric.value + (Math.random() - 0.5) * 1); // ±0.5A variation
            break;
          case 'power':
            newValue = Math.max(0, metric.value + (Math.random() - 0.5) * 0.5); // ±0.25kW variation
            break;
          case 'frequency':
            newValue = metric.value + (Math.random() - 0.5) * 0.1; // ±0.05Hz variation
            break;
          case 'temperature':
            newValue = Math.max(0, metric.value + (Math.random() - 0.5) * 2); // ±1°C variation
            break;
        }
        
        // Determine status based on limits
        let status: 'normal' | 'warning' | 'critical' | 'offline' = 'normal';
        if (metric.limits.critical) {
          if ((metric.limits.critical.min && newValue < metric.limits.critical.min) ||
              (metric.limits.critical.max && newValue > metric.limits.critical.max)) {
            status = 'critical';
          }
        }
        if (status === 'normal' && metric.limits.warning) {
          if ((metric.limits.warning.min && newValue < metric.limits.warning.min) ||
              (metric.limits.warning.max && newValue > metric.limits.warning.max)) {
            status = 'warning';
          }
        }
        
        return {
          ...metric,
          value: newValue,
          status,
          lastUpdated: new Date(),
          trend: Math.random() > 0.8 ? 
            (Math.random() > 0.5 ? 'up' : 'down') : 
            metric.trend
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'offline': return Clock;
      default: return Clock;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'A': return 'bg-red-100 text-red-700 border-red-200';
      case 'B': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'C': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'N': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'ALL': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredMetrics = selectedNode === 'all' 
    ? metrics 
    : metrics.filter(m => m.nodeId === selectedNode);

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50 bg-gradient-to-br from-slate-50 to-blue-50' : ''}`}>
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              UniGRID Laboratory
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Real-time electrical parameters monitoring system
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Nodes</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
            
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

        {/* System KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemKPIs.map((kpi, index) => (
            <GlassCard key={index} variant="gradient" className="group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color.replace('text-', 'from-').replace('-600', '-100')} to-white/50`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  kpi.status === 'good' ? 'text-green-600 bg-green-100' :
                  kpi.status === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {kpi.changeType === 'increase' ? '↗' : '↘'} {Math.abs(kpi.change)}%
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

        {/* Electrical Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMetrics.map((metric) => {
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
                      <p className="text-sm text-slate-600">{metric.nodeName}</p>
                      {metric.phase !== 'ALL' && (
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border ${getPhaseColor(metric.phase)}`}>
                          Phase {metric.phase}
                        </span>
                      )}
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
                      {metric.value.toFixed(2)}
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

                  {/* Limits Display */}
                  {(metric.limits.min || metric.limits.max) && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>
                          Range: {metric.limits.min || 0} - {metric.limits.max || '∞'} {metric.unit}
                        </span>
                        <span className={`font-semibold ${
                          metric.status === 'normal' ? 'text-green-600' :
                          metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {metric.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {metric.limits.max && (
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              metric.status === 'normal' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              metric.status === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                            style={{ 
                              width: `${Math.min((metric.value / metric.limits.max) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      )}
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
              <p className="text-slate-600">Recent electrical system notifications</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">Transformer Temperature Warning</h4>
                  <p className="text-yellow-700 text-sm">Transformer T1 temperature is 67°C, approaching warning threshold (70°C)</p>
                  <span className="text-xs text-yellow-600">2 minutes ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">All Voltage Parameters Normal</h4>
                  <p className="text-green-700 text-sm">All three-phase voltages are within acceptable ranges</p>
                  <span className="text-xs text-green-600">5 minutes ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-800">Grid Synchronization Stable</h4>
                  <p className="text-blue-700 text-sm">Frequency maintained at 59.98 Hz within normal operating range</p>
                  <span className="text-xs text-blue-600">10 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};