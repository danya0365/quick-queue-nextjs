/**
 * SqliteAuthRepository
 * Real SQLite implementation of IAuthRepository
 * Uses SHA-256 for password hashing (via Node.js crypto)
 */

import {
    AuthUser,
    IAuthRepository,
    LoginCredentials,
} from '@/src/application/repositories/IAuthRepository';
import { getDatabase } from '@/src/infrastructure/database/database';
import crypto from 'crypto';

// ─── Row types ───
interface AdminUserRow {
  id: string;
  username: string;
  password_hash: string;
  display_name: string;
  created_at: string;
}

interface SessionRow {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export class SqliteAuthRepository implements IAuthRepository {
  private get db() {
    return getDatabase();
  }

  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    const passwordHash = hashPassword(credentials.password);

    const row = this.db
      .prepare('SELECT * FROM admin_users WHERE username = ? AND password_hash = ?')
      .get(credentials.username, passwordHash) as AdminUserRow | undefined;

    if (!row) return null;

    // Create a session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    this.db
      .prepare(
        `INSERT INTO sessions (token, user_id, created_at, expires_at)
         VALUES (?, ?, datetime('now'), ?)`
      )
      .run(token, row.id, expiresAt);

    return {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
    };
  }

  async validateSession(token: string): Promise<AuthUser | null> {
    const session = this.db
      .prepare(
        `SELECT s.*, u.username, u.display_name
         FROM sessions s
         JOIN admin_users u ON s.user_id = u.id
         WHERE s.token = ? AND s.expires_at > datetime('now')`
      )
      .get(token) as (SessionRow & { username: string; display_name: string }) | undefined;

    if (!session) return null;

    return {
      id: session.user_id,
      username: session.username,
      displayName: session.display_name,
    };
  }

  async logout(token: string): Promise<void> {
    this.db
      .prepare('DELETE FROM sessions WHERE token = ?')
      .run(token);
  }
}
