// src/types/domain/user.types.ts

/**
 * Representación base de un usuario en el sistema
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role?: UserRole;
  readonly createdAt?: Date;
  readonly lastLogin?: Date;
}

/**
 * Roles disponibles para usuarios
 */
export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

/**
 * Datos requeridos para crear un nuevo usuario
 */
export interface CreateUserData {
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly role?: UserRole;
}

/**
 * Datos para actualizar un usuario existente
 */
export interface UpdateUserData {
  readonly name?: string;
  readonly role?: UserRole;
}

/**
 * Credenciales para autenticación
 */
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * Resultado del proceso de autenticación
 */
export interface AuthResult {
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresAt: Date;
}