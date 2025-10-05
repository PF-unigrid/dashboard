// src/modules/Gemelo/components/UniGRIDApp.tsx

import React, { useState } from 'react';
import { UniGRIDDashboard } from './UniGRIDDashboard';
import { ElectricalChart } from './ElectricalChart';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Users, 
  Bell,
  Search,
  Menu,
  X,
  Zap,
  Activity
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

export const UniGRIDApp: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedNode, setSelectedNode] = useState('all');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      component: UniGRIDDashboard
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: () => (
        <div className="space-y-6">
          <ElectricalChart timeRange={selectedTimeRange} selectedNode={selectedNode} />
        </div>
      )
    }
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeView)?.component || UniGRIDDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 z-40">
        <GlassCard variant="gradient" className="h-full m-4 flex flex-col">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">UniGRID</h2>
                <p className="text-xs text-slate-600">Laboratory System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* System Status */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">System Online</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Active Nodes:</span>
                <span className="font-medium">7/8</span>
              </div>
              <div className="flex justify-between">
                <span>Data Points:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="font-medium">99.2%</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeView === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* Quick Actions */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <div className="text-xs font-semibold text-slate-500 mb-2 px-2">QUICK ACTIONS</div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-white/50 hover:text-slate-800 transition-all duration-200">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Export Data</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-white/50 hover:text-slate-800 transition-all duration-200">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">System Config</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-white/50 hover:text-slate-800 transition-all duration-200">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Alerts (3)</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="text-xs text-slate-500 text-center">
              UniGRID Lab v1.2.0<br/>
              © 2025 Electrical Engineering Lab
            </div>
          </div>
        </GlassCard>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar con navegación */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              {/* Navegación Dashboard/Analytics */}
              <div className="flex items-center gap-2 bg-white/60 rounded-xl p-1">
                {navigationItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${activeView === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-3 bg-white/60 rounded-xl px-4 py-2 min-w-96">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search nodes, parameters, or alerts..."
                  className="bg-transparent border-none outline-none flex-1 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Dropdown de Last 24 Hours */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/60 border border-white/30 shadow-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-slate-400 font-medium"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              {/* Dropdown de All Nodes */}
              <select
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/60 border border-white/30 shadow-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 placeholder-slate-400 font-medium"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <option value="all">All Nodes</option>
                <option value="node1">Node 1</option>
                <option value="node2">Node 2</option>
                <option value="node3">Node 3</option>
                <option value="node4">Node 4</option>
                {/* Agrega más nodos si es necesario */}
              </select>
              <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-slate-800">Lab Engineer</div>
                  <div className="text-xs text-slate-600">Monitoring System</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Contenido dinámico */}
        <div className="p-4 pb-8 flex-1">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};