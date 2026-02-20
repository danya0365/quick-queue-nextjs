/**
 * TursoAuthRepository
 * @libsql/client implementation of IAuthRepository
 * Uses SHA-256 for password hashing (via Node.js crypto)
 */

import {
    AuthUser,
    IAuthRepository,
    LoginCredentials,
} from '@/src/application/repositories/IAuthRepository';
import { getTursoDatabase } from '@/src/infrastructure/database/turso';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export class TursoAuthRepository implements IAuthRepository {
  private get db() {
    return getTursoDatabase();
  }

  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    const passwordHash = hashPassword(credentials.password);

    const result = await this.db.execute({
      sql: 'SELECT * FROM admin_users WHERE username = ? AND password_hash = ?',
      args: [credentials.username, passwordHash]
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    // Create a session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    await this.db.execute({
      sql: `INSERT INTO sessions (token, user_id, created_at, expires_at)
            VALUES (?, ?, datetime('now'), ?)`,
      args: [token, row.id as string, expiresAt]
    });

    return {
      id: row.id as string,
      username: row.username as string,
      displayName: row.display_name as string,
    };
  }

  async validateSession(token: string): Promise<AuthUser | null> {
    const result = await this.db.execute({
      sql: `SELECT s.*, u.username, u.display_name
            FROM sessions s
            JOIN admin_users u ON s.user_id = u.id
            WHERE s.token = ? AND s.expires_at > datetime('now')`,
      args: [token]
    });

    if (result.rows.length === 0) return null;

    const session = result.rows[0];

    return {
      id: session.user_id as string,
      username: session.username as string,
      displayName: session.display_name as string,
    };
  }

  async logout(token: string): Promise<void> {
    await this.db.execute({
      sql: 'DELETE FROM sessions WHERE token = ?',
      args: [token]
    });
  }
}
