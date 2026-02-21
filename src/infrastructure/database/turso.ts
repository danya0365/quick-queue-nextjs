import { Client, createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

let tursoClient: Client | null = null;
let migrationsRun = false;

const DB_DIR = path.join(process.cwd(), 'data');

/**
 * Get the singleton Turso (libsql) database instance.
 */
export function getTursoDatabase(): Client {
  if (tursoClient) return tursoClient;

  // Ensure data/ directory exists for local files
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const url = process.env.TURSO_DATABASE_URL || 'file:data/quick-queue.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  tursoClient = createClient({
    url,
    authToken,
  });

  return tursoClient;
}

/**
 * Ensure database schema is created via @libsql/client
 */
export async function runMigrations(db: Client): Promise<void> {
  if (migrationsRun) return;

  await db.executeMultiple(`
    -- Queue Items
    CREATE TABLE IF NOT EXISTS queue_items (
      id            TEXT PRIMARY KEY,
      queue_number  INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      service_type  TEXT NOT NULL CHECK(service_type IN ('general','express','vip')),
      status        TEXT NOT NULL DEFAULT 'waiting'
                      CHECK(status IN ('waiting','in_progress','completed','cancelled')),
      note          TEXT DEFAULT '',
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Admin Users
    CREATE TABLE IF NOT EXISTS admin_users (
      id            TEXT PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name  TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Sessions
    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );

    -- Queue Requests (user-submitted, pending admin approval)
    CREATE TABLE IF NOT EXISTS queue_requests (
      id             TEXT PRIMARY KEY,
      tracking_code  TEXT NOT NULL UNIQUE,
      customer_name  TEXT NOT NULL,
      service_type   TEXT NOT NULL CHECK(service_type IN ('general','express','vip')),
      status         TEXT NOT NULL DEFAULT 'pending'
                       CHECK(status IN ('pending','approved','rejected')),
      note           TEXT DEFAULT '',
      reject_reason  TEXT DEFAULT '',
      queue_item_id  TEXT REFERENCES queue_items(id),
      ip_address     TEXT DEFAULT '',
      created_at     TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_queue_items_status ON queue_items(status);
    CREATE INDEX IF NOT EXISTS idx_queue_items_queue_number ON queue_items(queue_number);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_queue_requests_status ON queue_requests(status);
    CREATE INDEX IF NOT EXISTS idx_queue_requests_tracking_code ON queue_requests(tracking_code);
    CREATE INDEX IF NOT EXISTS idx_queue_requests_ip_address ON queue_requests(ip_address);
  `);

  migrationsRun = true;
}
