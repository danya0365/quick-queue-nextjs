/**
 * Queue Item by ID API Route
 * GET    /api/queue-items/[id] — Get a single queue item
 * PUT    /api/queue-items/[id] — Update a queue item
 * DELETE /api/queue-items/[id] — Delete a queue item
 */

import { SqliteQueueItemRepository } from '@/src/infrastructure/repositories/sqlite/SqliteQueueItemRepository';
import { NextRequest, NextResponse } from 'next/server';

const repository = new SqliteQueueItemRepository();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await repository.getById(id);

    if (!item) {
      return NextResponse.json(
        { error: 'ไม่พบคิวนี้' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('GET /api/queue-items/[id] error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลได้' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const item = await repository.update(id, {
      customerName: body.customerName,
      serviceType: body.serviceType,
      status: body.status,
      note: body.note,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('PUT /api/queue-items/[id] error:', error);
    const message = error instanceof Error ? error.message : 'ไม่สามารถอัปเดตได้';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await repository.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: 'ไม่พบคิวนี้' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/queue-items/[id] error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถลบได้' },
      { status: 500 }
    );
  }
}
