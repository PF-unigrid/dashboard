// src/services/auth/TokenService.ts

import type { ITokenService } from './AuthService';
import type { User } from '../../types/domain/user.types';

/**
 * Implementación del servicio de tokens JWT
 * En producción usar una librería como jose o jsonwebtoken
 */
export class TokenService implements ITokenService {
  private readonly secretKey: string;
  private readonly accessTokenExpiry: number = 15 * 60 * 1000; // 15 minutos
  private readonly refreshTokenExpiry: number = 7 * 24 * 60 * 60 * 1000; // 7 días

  constructor(secretKey: string = 'your-secret-key') {
    this.secretKey = secretKey;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + this.accessTokenExpiry) / 1000)
    };

    // Mock JWT implementation - en producción usar librería real
    return this.base64Encode(JSON.stringify(payload));
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + this.refreshTokenExpiry) / 1000)
    };

    // Mock JWT implementation - en producción usar librería real
    return this.base64Encode(JSON.stringify(payload));
  }

  async validateAccessToken(token: string): Promise<boolean> {
    try {
      const payload = this.decodeToken(token);
      return payload.type === 'access' && payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    try {
      const payload = this.decodeToken(token);
      return payload.type === 'refresh' && payload.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  async getUserIdFromToken(token: string): Promise<string> {
    const payload = this.decodeToken(token);
    return payload.sub;
  }

  getExpirationDate(token: string): Date {
    const payload = this.decodeToken(token);
    return new Date(payload.exp * 1000);
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(this.base64Decode(token));
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  private base64Encode(str: string): string {
    return btoa(unescape(encodeURIComponent(str)));
  }

  private base64Decode(str: string): string {
    return decodeURIComponent(escape(atob(str)));
  }
}