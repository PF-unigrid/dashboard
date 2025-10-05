// src/modules/auth/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../../../types/global.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de usuario desde almacenamiento
    const storedUser = (window as any).userStore || null;
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password) {
      const newUser: User = { 
        id: '1', 
        email, 
        name: email.split('@')[0] 
      };
      setUser(newUser);
      (window as any).userStore = newUser;
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    (window as any).userStore = null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};