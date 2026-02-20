/**
 * Mock Seed — 1000 queue items for development & pagination testing
 * Generates realistic Thai laundry queue data
 *
 * Usage: yarn db:seed:mock
 */

import { Client, InStatement } from '@libsql/client';

// ── Thai name pools ──
const FIRST_NAMES = [
  'สมชาย', 'สมหญิง', 'วิชัย', 'นภา', 'ประเสริฐ', 'มาลี', 'เจษฎา',
  'อรุณ', 'สุภาพร', 'ธนา', 'พิมพ์', 'กิตติ', 'วรรณา', 'ชัยวัฒน์',
  'จันทร์', 'ดาว', 'สุรินทร์', 'พรทิพย์', 'อนันต์', 'ลัดดา',
  'ภาณุ', 'ปราณี', 'ศักดิ์', 'นิตยา', 'วีระ', 'สมศรี', 'อำนาจ',
  'บุญมี', 'แสงเดือน', 'ประสิทธิ์', 'สุพัตรา', 'วินัย', 'สายใจ',
  'ชาติชาย', 'จิราภา', 'ธีระ', 'ขวัญใจ', 'เกียรติ', 'รัตนา',
  'สุชาติ', 'วาสนา', 'พงศ์', 'เพ็ญ', 'บรรจง', 'มณี',
  'ไพโรจน์', 'อุไร', 'สถาพร', 'ปิยะ', 'ยุพิน',
];

const LAST_NAMES = [
  'แก้วใส', 'ทองดี', 'สุขสม', 'พงษ์เพชร', 'วงศ์สกุล',
  'ชูชาติ', 'ศรีสุข', 'มั่นคง', 'พิทักษ์', 'เจริญผล',
  'บุญเรือง', 'สมบูรณ์', 'กิจเจริญ', 'รุ่งเรือง', 'ใจดี',
  'ทวีศักดิ์', 'ศิริโชค', 'ประสงค์', 'พูลทรัพย์', 'วัฒนา',
];

const SERVICE_TYPES = ['general', 'express', 'vip'] as const;
const STATUSES = ['waiting', 'in_progress', 'completed', 'cancelled'] as const;

// Service type weights: general 60%, express 25%, vip 15%
const SERVICE_WEIGHTS = [0.6, 0.85, 1.0];

// Status distribution for mock realism:
// waiting 25%, in_progress 5%, completed 60%, cancelled 10%
const STATUS_WEIGHTS = [0.25, 0.30, 0.90, 1.0];

const NOTES_BY_SERVICE: Record<string, string[]> = {
  general: [
    'ซักผ้า 1 ถุง', 'ซักผ้า 2 ถุง', 'ซักผ้า 3 ถุง',
    'ผ้าห่ม + ผ้าปูที่นอน', 'ผ้าม่าน 2 ผืน', 'ผ้าขนหนู 10 ผืน',
    'เสื้อผ้าทั่วไป', 'เสื้อผ้าเด็ก', 'ผ้าปูโต๊ะ + ผ้าเช็ดหน้า',
    'ชุดนอน 5 ชุด', 'ผ้าเช็ดตัว + ผ้าเช็ดหน้า', '',
  ],
  express: [
    'รีดผ้า ชุดทำงาน', 'รีดผ้า 5 ตัว', 'ซัก+รีดด่วน 3 ชุด',
    'เสื้อเชิ้ต 4 ตัว ด่วน', 'กระโปรง + เสื้อ ด่วน', 'ชุดสูทด่วน 1 ชุด',
    'ซักด่วน เสื้อผ้ากีฬา', 'ชุดทำงานด่วน 2 วัน', '',
  ],
  vip: [
    'ซักแห้ง สูท 3 ตัว', 'ซักแห้ง ชุดราตรี', 'ซักแห้ง เสื้อขนสัตว์',
    'สูท Premium 2 ชุด', 'ชุดเดรส+ผ้าไหม', 'เสื้อหนัง 1 ตัว',
    'ผ้าไหมไทย 3 ผืน', 'สูทแบรนด์เนม', 'ชุดแต่งงาน',
  ],
};

// ── Seeded random for reproducibility ──
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pickWeighted<T>(items: readonly T[], weights: number[], rand: () => number): T {
  const r = rand();
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return items[i];
  }
  return items[items.length - 1];
}

function pickRandom<T>(items: readonly T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)];
}

function padId(n: number): string {
  return `q-${String(n).padStart(4, '0')}`;
}

function generateTimestamp(baseDate: Date, minutesOffset: number): string {
  const d = new Date(baseDate);
  d.setMinutes(d.getMinutes() + minutesOffset);
  return d.toISOString();
}

export async function seedMock(db: Client, count: number = 1000): Promise<void> {
  console.log('');
  console.log(`🧪 Mock Seed — Generating ${count} queue items`);
  console.log('─'.repeat(40));

  // Check existing items
  const existing = await db.execute('SELECT COUNT(*) as count FROM queue_items');
  const countRow = existing.rows[0].count as number;

  if (countRow > 0) {
    console.log(`  ⚠️  Found ${countRow} existing items. Clearing...`);
    await db.execute('DELETE FROM queue_items');
    console.log('  🗑️  Cleared existing queue items');
  }

  const rand = createSeededRandom(42); // Deterministic for reproducible data
  const baseDate = new Date();
  baseDate.setHours(8, 0, 0, 0); // Today at 08:00 AM

  let waitingCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;
  let cancelledCount = 0;

  const batchStatements: InStatement[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = pickRandom(FIRST_NAMES, rand);
    const lastName = pickRandom(LAST_NAMES, rand);
    const customerName = `คุณ${firstName} ${lastName.charAt(0)}.`;

    const serviceType = pickWeighted(SERVICE_TYPES, SERVICE_WEIGHTS, rand);
    const status = pickWeighted(STATUSES, STATUS_WEIGHTS, rand);
    const notes = NOTES_BY_SERVICE[serviceType];
    const note = pickRandom(notes, rand);

    // Stagger created_at by ~2-8 min per item
    const minuteOffset = Math.floor(i * (2 + rand() * 6));
    const createdAt = generateTimestamp(baseDate, minuteOffset);

    // Updated later for non-waiting items
    let updatedMinutes = minuteOffset;
    if (status === 'in_progress') {
      updatedMinutes += Math.floor(5 + rand() * 20);
    } else if (status === 'completed') {
      updatedMinutes += Math.floor(15 + rand() * 45);
    } else if (status === 'cancelled') {
      updatedMinutes += Math.floor(5 + rand() * 10);
    }
    const updatedAt = generateTimestamp(baseDate, updatedMinutes);

    batchStatements.push({
      sql: `INSERT INTO queue_items (id, queue_number, customer_name, service_type, status, note, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [padId(i), i, customerName, serviceType, status, note, createdAt, updatedAt]
    });

    // Count stats
    switch (status) {
      case 'waiting': waitingCount++; break;
      case 'in_progress': inProgressCount++; break;
      case 'completed': completedCount++; break;
      case 'cancelled': cancelledCount++; break;
    }
  }

  console.log('  ⏳  Executing batch insert over libSQL/Turso... (this may take a few seconds)');
  
  // Use batch operation to insert in one go (works for both local file: and remote libsql://)
  // Execute chunks to avoid max payload limits, 500 records at a time
  const maxBatchSize = 500;
  for (let i = 0; i < batchStatements.length; i += maxBatchSize) {
    const chunk = batchStatements.slice(i, i + maxBatchSize);
    await db.batch(chunk, 'write');
  }

  console.log(`  ✅ ${count} queue items created`);
  console.log(`     📊 Breakdown:`);
  console.log(`        ⏳ Waiting:     ${waitingCount}`);
  console.log(`        🔄 In Progress: ${inProgressCount}`);
  console.log(`        ✅ Completed:   ${completedCount}`);
  console.log(`        ❌ Cancelled:   ${cancelledCount}`);
  console.log('');
}
