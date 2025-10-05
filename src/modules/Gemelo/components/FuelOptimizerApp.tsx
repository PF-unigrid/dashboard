// src/modules/Gemelo/components/FuelOptimizerApp.tsx

import React, { useState } from 'react';
import { ProfessionalDashboard } from './ProfessionalDashboard';
import { AdvancedChart } from './AdvancedChart';
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
  X 
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

export const FuelOptimizerApp: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      component: ProfessionalDashboard
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: () => <AdvancedChart timeRange={selectedTimeRange} />
    }
  ];

  const ActiveComponent = navigationItems.find(item => item.id === activeView)?.component || ProfessionalDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <GlassCard variant="gradient" className="h-full m-4 flex flex-col">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">FO</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Fuel Optimizer</h2>
                <p className="text-xs text-slate-600">Pro Dashboard</p>
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
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Button variant="ghost" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-slate-500 text-center">
              v2.1.0 • © 2025 Fuel Optimizer Pro
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="hidden md:flex items-center gap-3 bg-white/60 rounded-xl px-4 py-2 min-w-96">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search metrics, alerts, or settings..."
                  className="bg-transparent border-none outline-none flex-1 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-slate-800">Admin User</div>
                  <div className="text-xs text-slate-600">System Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-4">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};