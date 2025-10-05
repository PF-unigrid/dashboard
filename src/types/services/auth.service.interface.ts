// src/types/services/auth.service.interface.ts

import type { 
  User, 
  LoginCredentials, 
  AuthResult, 
  CreateUserData,
  UpdateUserData 
} from '../domain/user.types';
import type { Result } from '../domain/common.types';

/**
 * Interfaz para el servicio de autenticación
 * Aplica el principio de Inversión de Dependencias (DIP)
 */
export interface IAuthService {
  /**
   * Autentica un usuario con credenciales
   */
  login(credentials: LoginCredentials): Promise<Result<AuthResult>>;
  
  /**
   * Cierra la sesión del usuario actual
   */
  logout(): Promise<Result<void>>;
  
  /**
   * Refresca el token de autenticación
   */
  refreshToken(refreshToken: string): Promise<Result<AuthResult>>;
  
  /**
   * Obtiene el usuario actualmente autenticado
   */
  getCurrentUser(): Promise<Result<User | null>>;
  
  /**
   * Verifica si el token actual es válido
   */
  validateToken(token: string): Promise<Result<boolean>>;
}

/**
 * Interfaz para el repositorio de usuarios
 */
export interface IUserRepository {
  /**
   * Busca un usuario por email
   */
  findByEmail(email: string): Promise<Result<User | null>>;
  
  /**
   * Busca un usuario por ID
   */
  findById(id: string): Promise<Result<User | null>>;
  
  /**
   * Crea un nuevo usuario
   */
  create(userData: CreateUserData): Promise<Result<User>>;
  
  /**
   * Actualiza un usuario existente
   */
  update(id: string, userData: UpdateUserData): Promise<Result<User>>;
  
  /**
   * Elimina un usuario
   */
  delete(id: string): Promise<Result<void>>;
}