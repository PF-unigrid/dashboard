// src/routes/AppRoutes.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/auth/components/LoginPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { UniGRIDApp } from '../modules/Gemelo/components/UniGRIDApp';
import { SettingsPage } from '@/modules/settings/components/SettingsPage';
import { useAuth } from '../modules/auth/hooks/useAuth';
import { LoadingScreen } from '../components/ui/LoadingSpinner';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirige si ya está autenticado)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UniGRIDApp />
            </ProtectedRoute>
          } 
        />
        
        <Route
          path="/legacy"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};