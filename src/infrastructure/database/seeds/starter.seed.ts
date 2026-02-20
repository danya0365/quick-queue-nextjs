/**
 * Starter Seed — Production-ready minimal data
 * Creates ONLY the admin user (no queue items)
 *
 * Usage: yarn db:seed:starter
 */

import { Client } from '@libsql/client';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function seedStarter(db: Client): Promise<void> {
  console.log('');
  console.log('📦 Starter Seed — Admin User Only');
  console.log('─'.repeat(40));

  // ── Admin User ──
  const existingAdmin = await db.execute({
    sql: 'SELECT id FROM admin_users WHERE username = ?',
    args: ['admin']
  });

  if (existingAdmin.rows.length === 0) {
    await db.execute({
      sql: `INSERT INTO admin_users (id, username, password_hash, display_name)
            VALUES (?, ?, ?, ?)`,
      args: ['admin-001', 'admin', hashPassword('admin'), 'เจ้าของร้าน']
    });
    console.log('  ✅ Admin user created (admin / admin)');
  } else {
    console.log('  ⏭️  Admin user already exists, skipped');
  }

  console.log('');
}
