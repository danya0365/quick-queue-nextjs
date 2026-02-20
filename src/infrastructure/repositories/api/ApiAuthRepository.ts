/**
 * ApiAuthRepository
 * Implements IAuthRepository using API calls
 *
 * ✅ For use in CLIENT-SIDE components only
 * ✅ Session is managed via HTTP-only cookie (set by server)
 */

'use client';

import {
    AuthUser,
    IAuthRepository,
    LoginCredentials,
} from '@/src/application/repositories/IAuthRepository';

export class ApiAuthRepository implements IAuthRepository {
  private baseUrl = '/api/auth';

  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (res.status === 401) return null;
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }

    const data = await res.json();
    return data.user;
  }

  async validateSession(_token: string): Promise<AuthUser | null> {
    // Token is managed by HTTP-only cookie, so we just call /me
    const res = await fetch(`${this.baseUrl}/me`);

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  }

  async logout(_token: string): Promise<void> {
    await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
    });
  }
}
