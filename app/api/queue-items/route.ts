/**
 * Queue Items API Route
 * GET  /api/queue-items — List all queue items
 * POST /api/queue-items — Create a new queue item
 *
 * Server-side only: uses TursoQueueItemRepository
 */

import { requireAuth } from '@/src/infrastructure/auth/session';
import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';

const repository = getQueueItemRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');
    const status = searchParams.get('status') || undefined;

    // If page/perPage provided → paginated response
    if (page && perPage) {
      const result = await repository.getPaginated(
        parseInt(page, 10),
        parseInt(perPage, 10),
        status
      );
      return NextResponse.json(result);
    }

    // Otherwise → return all items (backward compatible)
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
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;
    const body = await request.json();

    if (!body.customerName || !body.serviceType) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อลูกค้าและประเภทบริการ' },
        { status: 400 }
      );
    }

    const item = await repository.create({
      id: body.id,
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

export async function DELETE(request: NextRequest) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    await repository.deleteAll();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/queue-items error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถล้างคิวได้' },
      { status: 500 }
    );
  }
}
