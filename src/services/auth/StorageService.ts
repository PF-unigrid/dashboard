// src/services/auth/StorageService.ts

import type { IStorageService } from './AuthService';

/**
 * Implementación del servicio de almacenamiento usando localStorage
 * Aplica el patrón Adapter para abstraer el mecanismo de storage
 */
export class LocalStorageService implements IStorageService {
  private readonly prefix: string;

  constructor(prefix: string = 'fuel-optimizer-') {
    this.prefix = prefix;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  async clear(): Promise<void> {
    try {
      // Solo limpiar las claves con nuestro prefix
      const keys = Object.keys(localStorage);
      const keysToRemove = keys.filter(key => key.startsWith(this.prefix));
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

/**
 * Implementación alternativa usando sessionStorage
 */
export class SessionStorageService implements IStorageService {
  private readonly prefix: string;

  constructor(prefix: string = 'fuel-optimizer-') {
    this.prefix = prefix;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return sessionStorage.getItem(this.getKey(key));
    } catch (error) {
      console.error('Error getting item from sessionStorage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      sessionStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.error('Error setting item in sessionStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      sessionStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing item from sessionStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(sessionStorage);
      const keysToRemove = keys.filter(key => key.startsWith(this.prefix));
      
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      throw new Error('Storage operation failed');
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}