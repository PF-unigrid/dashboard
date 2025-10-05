// src/stores/authStore.ts

import { create } from 'zustand';
import React from 'react';
import type { User, LoginCredentials } from '../types/domain/user.types';
import type { LoadingState } from '../types/domain/common.types';
import { AuthService } from '../services/auth/AuthService';
import { TokenService } from '../services/auth/TokenService';
import { LocalStorageService } from '../services/auth/StorageService';
import { MockUserRepository } from '../services/auth/UserRepository';
import { isSuccess } from '../utils/result.utils';

/**
 * Estado de autenticación
 */
interface AuthState extends LoadingState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  
  // Estado interno
  _initialized: boolean;
  _initialize: () => Promise<void>;
}

/**
 * Dependencias del store - aplicando Dependency Injection
 */
const createAuthDependencies = () => {
  const userRepository = new MockUserRepository();
  const tokenService = new TokenService();
  const storageService = new LocalStorageService();
  const authService = new AuthService(userRepository, tokenService, storageService);
  
  return { authService };
};

/**
 * Store de autenticación simplificado pero robusto
 */
export const useAuthStore = create<AuthState>((set, get) => {
  const { authService } = createAuthDependencies();

  return {
    // Estado inicial
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastUpdated: null,
    _initialized: false,

    // Inicializar store
    _initialize: async () => {
      if (get()._initialized) return;

      set({ isLoading: true, error: null });

      try {
        const result = await authService.getCurrentUser();
        
        if (isSuccess(result) && result.data) {
          set({
            user: result.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastUpdated: new Date(),
            _initialized: true
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastUpdated: new Date(),
            _initialized: true
          });
        }
      } catch (error) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          lastUpdated: new Date(),
          _initialized: true
        });
      }
    },

    // Login
    login: async (credentials: LoginCredentials) => {
      set({ isLoading: true, error: null });

      try {
        const result = await authService.login(credentials);
        
        if (isSuccess(result)) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastUpdated: new Date()
          });
        } else {
          set({
            isLoading: false,
            error: result.error.message
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        set({
          isLoading: false,
          error: errorMessage
        });
      }
    },

    // Logout
    logout: async () => {
      set({ isLoading: true, error: null });

      try {
        await authService.logout();
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Logout failed';
        set({
          isLoading: false,
          error: errorMessage
        });
      }
    },

    // Refrescar autenticación
    refreshAuth: async () => {
      const refreshToken = localStorage.getItem('fuel-optimizer-refresh_token');
      if (!refreshToken) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const result = await authService.refreshToken(refreshToken);
        
        if (isSuccess(result)) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastUpdated: new Date()
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: result.error.message
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage
        });
      }
    },

    // Limpiar error
    clearError: () => {
      set({ error: null });
    }
  };
});

/**
 * Hook para inicialización automática del store
 */
export const useAuthInitialization = () => {
  const initialize = useAuthStore(state => state._initialize);
  const initialized = useAuthStore(state => state._initialized);

  React.useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);
};

// Selectors optimizados
export const authSelectors = {
  user: (state: AuthState) => state.user,
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  isLoading: (state: AuthState) => state.isLoading,
  error: (state: AuthState) => state.error,
  hasError: (state: AuthState) => !!state.error,
  userRole: (state: AuthState) => state.user?.role,
  userName: (state: AuthState) => state.user?.name,
  userEmail: (state: AuthState) => state.user?.email,
};