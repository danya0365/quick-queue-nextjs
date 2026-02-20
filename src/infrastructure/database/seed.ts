/**
 * Seed Orchestrator
 * Runs seed scripts based on CLI flags
 *
 * Usage:
 *   yarn db:seed           → starter (admin user only)
 *   yarn db:seed:starter   → starter (admin user only)
 *   yarn db:seed:mock      → starter + 1000 mock queue items
 *   yarn db:reset           → wipe DB + starter
 *   yarn db:reset:mock      → wipe DB + starter + 1000 mock items
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { seedMock } from './seeds/mock.seed';
import { seedStarter } from './seeds/starter.seed';
import { getTursoDatabase, runMigrations } from './turso';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const mode = args[0] || 'starter';

  // Get single instance of the database (Local SQLite via Turso Client or Remote Turso)
  const db = getTursoDatabase();

  console.log('🌱 Quick Queue — Database Seed');
  console.log(`   Mode: ${mode}`);
  console.log(`   Provider: @libsql/client`);
  console.log('═'.repeat(40));

  console.log('  ⏳ Enforcing Database Schema (Migrations)...');
  await runMigrations(db);

  // Always run starter seed (admin user)
  await seedStarter(db);

  // Conditionally run mock seed
  if (mode === 'mock') {
    const count = parseInt(args[1] || '1000', 10);
    await seedMock(db, count);
  }

  // Close the client correctly
  db.close();

  console.log('═'.repeat(40));
  console.log('🌱 Seed complete!');
}

main().catch(err => {
  console.error('Seed Error:', err);
  process.exit(1);
});
