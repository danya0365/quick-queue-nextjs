/**
 * Database Singleton
 * Provides a single SQLite connection via better-sqlite3
 * DB file: data/quick-queue.db (project root)
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'quick-queue.db');

let db: Database.Database | null = null;

/**
 * Get the singleton database instance.
 * Auto-creates the data/ directory and runs migrations on first call.
 */
export function getDatabase(): Database.Database {
  if (db) return db;

  // Ensure data/ directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Run migrations on first connection
  runMigrations(db);

  return db;
}

/**
 * Run migrations — creates tables if they don't exist
 */
function runMigrations(db: Database.Database): void {
  db.exec(`
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

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_queue_items_status ON queue_items(status);
    CREATE INDEX IF NOT EXISTS idx_queue_items_queue_number ON queue_items(queue_number);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `);
}

/**
 * Close the database connection (for cleanup / testing)
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
