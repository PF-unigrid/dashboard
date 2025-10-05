// src/services/auth/AuthService.ts

import type { IAuthService, IUserRepository } from '../../types/services/auth.service.interface';
import type { 
  User, 
  LoginCredentials, 
  AuthResult
} from '../../types/domain/user.types';
import type { Result } from '../../types/domain/common.types';
import { 
  success, 
  failure, 
  asyncTryCatch 
} from '../../utils/result.utils';
import { 
  AuthenticationError, 
  ValidationError
} from '../../utils/error.utils';

/**
 * Implementación del servicio de autenticación
 * Aplica principios SOLID:
 * - SRP: Solo maneja autenticación
 * - OCP: Extendible sin modificar código existente
 * - DIP: Depende de abstracciones (IUserRepository)
 */
export class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository;
  private readonly tokenService: ITokenService;
  private readonly storageService: IStorageService;

  constructor(
    userRepository: IUserRepository,
    tokenService: ITokenService,
    storageService: IStorageService
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.storageService = storageService;
  }

  /**
   * Autentica un usuario con credenciales
   */
  async login(credentials: LoginCredentials): Promise<Result<AuthResult>> {
    return asyncTryCatch(async () => {
      // Validar credenciales
      const validationResult = this.validateCredentials(credentials);
      if (!validationResult.success) {
        throw validationResult.error;
      }

      // Buscar usuario por email
      const userResult = await this.userRepository.findByEmail(credentials.email);
      if (!userResult.success) {
        throw userResult.error;
      }

      const user = userResult.data;
      if (!user) {
        throw new AuthenticationError('Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Verificar password (en producción usar bcrypt)
      const isValidPassword = await this.verifyPassword(credentials.password, user);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Generar tokens
      const token = await this.tokenService.generateAccessToken(user);
      const refreshToken = await this.tokenService.generateRefreshToken(user);
      const expiresAt = this.tokenService.getExpirationDate(token);

      const authResult: AuthResult = {
        user,
        token,
        refreshToken,
        expiresAt
      };

      // Guardar en storage
      await this.storageService.setItem('auth_token', token);
      await this.storageService.setItem('refresh_token', refreshToken);
      await this.storageService.setItem('user', JSON.stringify(user));

      return authResult;
    });
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async logout(): Promise<Result<void>> {
    return asyncTryCatch(async () => {
      await this.storageService.removeItem('auth_token');
      await this.storageService.removeItem('refresh_token');
      await this.storageService.removeItem('user');
    });
  }

  /**
   * Refresca el token de autenticación
   */
  async refreshToken(refreshToken: string): Promise<Result<AuthResult>> {
    return asyncTryCatch(async () => {
      // Validar refresh token
      const isValid = await this.tokenService.validateRefreshToken(refreshToken);
      if (!isValid) {
        throw new AuthenticationError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }

      // Obtener usuario del token
      const userId = await this.tokenService.getUserIdFromToken(refreshToken);
      const userResult = await this.userRepository.findById(userId);
      
      if (!userResult.success || !userResult.data) {
        throw new AuthenticationError('User not found', 'USER_NOT_FOUND');
      }

      const user = userResult.data;

      // Generar nuevos tokens
      const newToken = await this.tokenService.generateAccessToken(user);
      const newRefreshToken = await this.tokenService.generateRefreshToken(user);
      const expiresAt = this.tokenService.getExpirationDate(newToken);

      const authResult: AuthResult = {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt
      };

      // Actualizar storage
      await this.storageService.setItem('auth_token', newToken);
      await this.storageService.setItem('refresh_token', newRefreshToken);

      return authResult;
    });
  }

  /**
   * Obtiene el usuario actualmente autenticado
   */
  async getCurrentUser(): Promise<Result<User | null>> {
    return asyncTryCatch(async () => {
      const token = await this.storageService.getItem('auth_token');
      if (!token) {
        return null;
      }

      const isValid = await this.tokenService.validateAccessToken(token);
      if (!isValid) {
        return null;
      }

      const userJson = await this.storageService.getItem('user');
      if (!userJson) {
        return null;
      }

      return JSON.parse(userJson) as User;
    });
  }

  /**
   * Verifica si el token actual es válido
   */
  async validateToken(token: string): Promise<Result<boolean>> {
    return asyncTryCatch(async () => {
      return await this.tokenService.validateAccessToken(token);
    });
  }

  /**
   * Valida las credenciales de login
   */
  private validateCredentials(credentials: LoginCredentials): Result<void> {
    if (!credentials.email || !credentials.email.includes('@')) {
      return failure(new ValidationError(
        'Valid email is required',
        'INVALID_EMAIL',
        'email'
      ));
    }

    if (!credentials.password || credentials.password.length < 6) {
      return failure(new ValidationError(
        'Password must be at least 6 characters',
        'INVALID_PASSWORD',
        'password'
      ));
    }

    return success(undefined);
  }

  /**
   * Verifica la contraseña (mock implementation)
   */
  private async verifyPassword(password: string, _user: User): Promise<boolean> {
    // En producción, usar bcrypt.compare()
    // Por ahora, mock implementation
    return password.length >= 6;
  }
}

/**
 * Interfaz para servicio de tokens
 */
export interface ITokenService {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(user: User): Promise<string>;
  validateAccessToken(token: string): Promise<boolean>;
  validateRefreshToken(token: string): Promise<boolean>;
  getUserIdFromToken(token: string): Promise<string>;
  getExpirationDate(token: string): Date;
}

/**
 * Interfaz para servicio de almacenamiento
 */
export interface IStorageService {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}