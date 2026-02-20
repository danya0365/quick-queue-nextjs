/**
 * Standalone Migration Script
 * Use this to initialize the database schema without seeding mock data.
 *
 * Usage: yarn db:migrate
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getTursoDatabase, runMigrations } from './turso';

async function main(): Promise<void> {
  console.log('🏗  Quick Queue — Database Migration');
  console.log('═'.repeat(40));

  const db = getTursoDatabase();
  const provider = process.env.DB_PROVIDER === 'turso' ? 'Turso (Cloud)' : 'SQLite (Local)';
  
  console.log(`📡 Connecting to Provider: ${provider}`);
  console.log('⏳ Running Migrations...');
  
  await runMigrations(db);

  db.close();

  console.log('✅ Migrations completed successfully!');
  console.log('═'.repeat(40));
}

main().catch(err => {
  console.error('❌ Migration Error:', err);
  process.exit(1);
});
