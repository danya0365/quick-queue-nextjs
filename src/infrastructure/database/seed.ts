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

import { closeDatabase, getDatabase } from './database';
import { seedMock } from './seeds/mock.seed';
import { seedStarter } from './seeds/starter.seed';

function main(): void {
  const args = process.argv.slice(2);
  const mode = args[0] || 'starter';

  const db = getDatabase();

  console.log('🌱 Quick Queue — Database Seed');
  console.log(`   Mode: ${mode}`);
  console.log('═'.repeat(40));

  // Always run starter seed (admin user)
  seedStarter(db);

  // Conditionally run mock seed
  if (mode === 'mock') {
    const count = parseInt(args[1] || '1000', 10);
    seedMock(db, count);
  }

  closeDatabase();
  console.log('═'.repeat(40));
  console.log('🌱 Seed complete!');
}

main();
