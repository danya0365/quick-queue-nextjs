/**
 * Starter Seed — Production-ready minimal data
 * Creates ONLY the admin user (no queue items)
 *
 * Usage: yarn db:seed:starter
 */

import type Database from 'better-sqlite3';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function seedStarter(db: Database.Database): void {
  console.log('');
  console.log('📦 Starter Seed — Admin User Only');
  console.log('─'.repeat(40));

  // ── Admin User ──
  const existingAdmin = db
    .prepare('SELECT id FROM admin_users WHERE username = ?')
    .get('admin');

  if (!existingAdmin) {
    db.prepare(
      `INSERT INTO admin_users (id, username, password_hash, display_name)
       VALUES (?, ?, ?, ?)`
    ).run('admin-001', 'admin', hashPassword('admin'), 'เจ้าของร้าน');
    console.log('  ✅ Admin user created (admin / admin)');
  } else {
    console.log('  ⏭️  Admin user already exists, skipped');
  }

  console.log('');
}
