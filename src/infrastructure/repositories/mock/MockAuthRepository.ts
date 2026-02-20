/**
 * MockAuthRepository
 * Mock implementation for development
 * Uses hardcoded admin credentials
 */

import {
    AuthUser,
    IAuthRepository,
    LoginCredentials,
} from '@/src/application/repositories/IAuthRepository';

// Mock admin user
const MOCK_ADMIN: AuthUser = {
  id: 'admin-001',
  username: 'admin',
  displayName: 'เจ้าของร้าน',
};

const MOCK_PASSWORD = 'admin';

// Simple in-memory session storage
const activeSessions = new Map<string, AuthUser>();

export class MockAuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    await this.delay(300);

    if (
      credentials.username === MOCK_ADMIN.username &&
      credentials.password === MOCK_PASSWORD
    ) {
      // Generate simple token
      const token = `mock-token-${Date.now()}`;
      activeSessions.set(token, MOCK_ADMIN);
      return MOCK_ADMIN;
    }

    return null;
  }

  async validateSession(token: string): Promise<AuthUser | null> {
    await this.delay(50);
    return activeSessions.get(token) || null;
  }

  async logout(token: string): Promise<void> {
    await this.delay(100);
    activeSessions.delete(token);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockAuthRepository = new MockAuthRepository();
