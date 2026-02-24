/**
 * Database Reset Script
 * Drops all tables in the database to start fresh.
 * Supports both Local SQLite and Turso Cloud (via .env.local).
 *
 * Usage: yarn db:reset
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getTursoDatabase } from './turso';

import { DEFAULT_SHOP_CONFIG } from '../../config/shop.config';

async function main(): Promise<void> {
  console.log(`🗑️  ${DEFAULT_SHOP_CONFIG.shopName} — Database Reset`);
  console.log('═'.repeat(40));

  const db = getTursoDatabase();
  const provider = process.env.DB_PROVIDER === 'turso' ? 'Turso (Cloud)' : 'SQLite (Local)';
  
  console.log(`📡 Connecting to Provider: ${provider}`);
  console.log('⏳ Dropping existing tables...');

  try {
    // Drop all tables
    // Note: Order matters due to foreign keys (sessions depends on admin_users)
    await db.executeMultiple(`
      DROP TABLE IF EXISTS sessions;
      DROP TABLE IF EXISTS queue_items;
      DROP TABLE IF EXISTS admin_users;
    `);

    console.log('✅ Database reset completed successfully!');
  } catch (error) {
    console.error('❌ Database Reset Error:', error);
  } finally {
    db.close();
    console.log('═'.repeat(40));
  }
}

main().catch(err => {
  console.error('❌ Fatal Error:', err);
  process.exit(1);
});
