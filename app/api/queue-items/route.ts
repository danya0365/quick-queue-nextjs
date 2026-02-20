/**
 * Queue Items API Route
 * GET  /api/queue-items — List all queue items
 * POST /api/queue-items — Create a new queue item
 *
 * Server-side only: uses SqliteQueueItemRepository
 */

import { SqliteQueueItemRepository } from '@/src/infrastructure/repositories/sqlite/SqliteQueueItemRepository';
import { NextRequest, NextResponse } from 'next/server';

const repository = new SqliteQueueItemRepository();

export async function GET() {
  try {
    const items = await repository.getAll();
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/queue-items error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลคิวได้' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.serviceType) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อลูกค้าและประเภทบริการ' },
        { status: 400 }
      );
    }

    const item = await repository.create({
      customerName: body.customerName,
      serviceType: body.serviceType,
      note: body.note,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('POST /api/queue-items error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างคิวได้' },
      { status: 500 }
    );
  }
}
