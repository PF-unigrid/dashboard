// src/types/global.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface MetricData {
  id: string;
  name: string;
  value: number;
  unit: string;
  type: 'current' | 'voltage' | 'power' | 'efficiency' | 'frequency' | 'custom';
  phase?: 'A' | 'B' | 'C';
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}