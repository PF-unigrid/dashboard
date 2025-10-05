// src/services/auth/UserRepository.ts

import type { IUserRepository } from '../../types/services/auth.service.interface';
import type { 
  User, 
  CreateUserData, 
  UpdateUserData
} from '../../types/domain/user.types';
import { UserRole } from '../../types/domain/user.types';
import type { Result } from '../../types/domain/common.types';
import { asyncTryCatch } from '../../utils/result.utils';
import { NotFoundError, ValidationError } from '../../utils/error.utils';

/**
 * Implementación mock del repositorio de usuarios
 * En producción se conectaría a una base de datos real
 */
export class MockUserRepository implements IUserRepository {
  private readonly users: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.seedTestUsers();
  }

  async findByEmail(email: string): Promise<Result<User | null>> {
    return asyncTryCatch(async () => {
      for (const user of this.users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    });
  }

  async findById(id: string): Promise<Result<User | null>> {
    return asyncTryCatch(async () => {
      return this.users.get(id) || null;
    });
  }

  async create(userData: CreateUserData): Promise<Result<User>> {
    return asyncTryCatch(async () => {
      // Validar que el email no exista
      const existingUserResult = await this.findByEmail(userData.email);
      if (existingUserResult.success && existingUserResult.data) {
        throw new ValidationError(
          'Email already exists',
          'EMAIL_EXISTS',
          'email'
        );
      }

      // Crear nuevo usuario
      const user: User = {
        id: this.generateId(),
        email: userData.email,
        name: userData.name,
        role: userData.role || UserRole.VIEWER,
        createdAt: new Date(),
        lastLogin: undefined
      };

      this.users.set(user.id, user);
      return user;
    });
  }

  async update(id: string, userData: UpdateUserData): Promise<Result<User>> {
    return asyncTryCatch(async () => {
      const existingUser = this.users.get(id);
      if (!existingUser) {
        throw new NotFoundError(
          'User not found',
          'USER_NOT_FOUND',
          'User',
          id
        );
      }

      // Actualizar usuario
      const updatedUser: User = {
        ...existingUser,
        ...userData
      };

      this.users.set(id, updatedUser);
      return updatedUser;
    });
  }

  async delete(id: string): Promise<Result<void>> {
    return asyncTryCatch(async () => {
      const exists = this.users.has(id);
      if (!exists) {
        throw new NotFoundError(
          'User not found',
          'USER_NOT_FOUND',
          'User',
          id
        );
      }

      this.users.delete(id);
    });
  }

  /**
   * Métodos adicionales para testing y desarrollo
   */
  
  async updateLastLogin(id: string): Promise<Result<void>> {
    return asyncTryCatch(async () => {
      const user = this.users.get(id);
      if (!user) {
        throw new NotFoundError('User not found', 'USER_NOT_FOUND', 'User', id);
      }

      const updatedUser: User = {
        ...user,
        lastLogin: new Date()
      };

      this.users.set(id, updatedUser);
    });
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  clear(): void {
    this.users.clear();
    this.seedTestUsers();
  }

  private seedTestUsers(): void {
    const testUsers: User[] = [
      {
        id: '1',
        email: 'admin@fueloptimizer.com',
        name: 'Administrator',
        role: UserRole.ADMIN,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date()
      },
      {
        id: '2',
        email: 'operator@fueloptimizer.com',
        name: 'System Operator',
        role: UserRole.OPERATOR,
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date()
      },
      {
        id: '3',
        email: 'viewer@fueloptimizer.com',
        name: 'Data Viewer',
        role: UserRole.VIEWER,
        createdAt: new Date('2024-02-01'),
        lastLogin: new Date()
      }
    ];

    testUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}