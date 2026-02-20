/**
 * Seed Script
 * Populates the database with initial Thai demo data
 * Idempotent: skips if data already exists
 *
 * Usage: npx tsx src/infrastructure/database/seed.ts
 */

import crypto from 'crypto';
import { closeDatabase, getDatabase } from './database';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function seed(): void {
  const db = getDatabase();

  console.log('🌱 Seeding database...');

  // ── Seed Admin User ──
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

  // ── Seed Queue Items ──
  const itemCount = db
    .prepare('SELECT COUNT(*) as count FROM queue_items')
    .get() as { count: number };

  if (itemCount.count === 0) {
    const insert = db.prepare(
      `INSERT INTO queue_items (id, queue_number, customer_name, service_type, status, note, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const seedItems = [
      {
        id: 'q-001',
        queueNumber: 1,
        customerName: 'คุณสมชาย',
        serviceType: 'general',
        status: 'completed',
        note: 'ซักผ้า 2 ถุง',
        createdAt: '2026-02-21T09:00:00.000Z',
        updatedAt: '2026-02-21T09:45:00.000Z',
      },
      {
        id: 'q-002',
        queueNumber: 2,
        customerName: 'คุณสมหญิง',
        serviceType: 'express',
        status: 'completed',
        note: 'รีดผ้า ชุดทำงาน',
        createdAt: '2026-02-21T09:15:00.000Z',
        updatedAt: '2026-02-21T10:00:00.000Z',
      },
      {
        id: 'q-003',
        queueNumber: 3,
        customerName: 'คุณวิชัย',
        serviceType: 'vip',
        status: 'in_progress',
        note: 'ซักแห้ง สูท 3 ตัว',
        createdAt: '2026-02-21T09:30:00.000Z',
        updatedAt: '2026-02-21T10:15:00.000Z',
      },
      {
        id: 'q-004',
        queueNumber: 4,
        customerName: 'คุณนภา',
        serviceType: 'general',
        status: 'waiting',
        note: 'ผ้าห่ม + ผ้าปูที่นอน',
        createdAt: '2026-02-21T10:00:00.000Z',
        updatedAt: '2026-02-21T10:00:00.000Z',
      },
      {
        id: 'q-005',
        queueNumber: 5,
        customerName: 'คุณประเสริฐ',
        serviceType: 'express',
        status: 'waiting',
        note: '',
        createdAt: '2026-02-21T10:20:00.000Z',
        updatedAt: '2026-02-21T10:20:00.000Z',
      },
      {
        id: 'q-006',
        queueNumber: 6,
        customerName: 'คุณมาลี',
        serviceType: 'general',
        status: 'waiting',
        note: 'ซักผ้า 1 ถุง',
        createdAt: '2026-02-21T10:35:00.000Z',
        updatedAt: '2026-02-21T10:35:00.000Z',
      },
      {
        id: 'q-007',
        queueNumber: 7,
        customerName: 'คุณเจษฎา',
        serviceType: 'general',
        status: 'cancelled',
        note: '',
        createdAt: '2026-02-21T10:50:00.000Z',
        updatedAt: '2026-02-21T11:00:00.000Z',
      },
    ];

    const insertMany = db.transaction(() => {
      for (const item of seedItems) {
        insert.run(
          item.id,
          item.queueNumber,
          item.customerName,
          item.serviceType,
          item.status,
          item.note,
          item.createdAt,
          item.updatedAt
        );
      }
    });

    insertMany();
    console.log(`  ✅ ${seedItems.length} queue items created`);
  } else {
    console.log(`  ⏭️  Queue items already exist (${itemCount.count}), skipped`);
  }

  closeDatabase();
  console.log('🌱 Seed complete!');
}

seed();
