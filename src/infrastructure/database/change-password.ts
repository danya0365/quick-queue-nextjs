/**
 * Change Admin Password Script
 * Utility script to update an administrator's password directly in the database.
 * Supports both Local SQLite and Turso Cloud (via .env.local).
 *
 * Usage:
 *   yarn db:password <username> <new_password>
 *   Example: yarn db:password admin newP@ssw0rd!
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import crypto from 'crypto';
import { DEFAULT_SHOP_CONFIG } from '../../config/shop.config';
import { getTursoDatabase } from './turso';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const username = args[0];
  const newPassword = args[1];

  console.log(`🔐 ${DEFAULT_SHOP_CONFIG.shopName} — Change Password`);
  console.log('═'.repeat(40));

  if (!username || !newPassword) {
    console.error('❌ Error: Missing arguments.');
    console.log('Usage: yarn db:password <username> <new_password>');
    console.log('Example: yarn db:password admin 123456');
    process.exit(1);
  }

  const db = getTursoDatabase();
  const provider = process.env.DB_PROVIDER === 'turso' ? 'Turso (Cloud)' : 'SQLite (Local)';
  console.log(`📡 Connecting to Provider: ${provider}`);

  try {
    // 1. Check if user exists
    const userResult = await db.execute({
      sql: 'SELECT id FROM admin_users WHERE username = ?',
      args: [username],
    });

    if (userResult.rows.length === 0) {
      console.error(`❌ Error: User '${username}' not found in the database.`);
      process.exit(1);
    }

    // 2. Hash new password and update
    const newHash = hashPassword(newPassword);
    
    await db.execute({
      sql: 'UPDATE admin_users SET password_hash = ? WHERE username = ?',
      args: [newHash, username],
    });

    // 3. (Optional but recommended) Invalidate all existing sessions for this user
    await db.execute({
      sql: 'DELETE FROM sessions WHERE user_id = ?',
      args: [userResult.rows[0].id],
    });

    console.log(`✅ Success! Password for '${username}' has been updated.`);
    console.log(`⚠️  Notice: All active sessions for '${username}' have been logged out.`);

  } catch (error) {
    console.error('❌ Database Error:', error);
  } finally {
    db.close();
    console.log('═'.repeat(40));
  }
}

main().catch((err) => {
  console.error('❌ Fatal Error:', err);
  process.exit(1);
});
