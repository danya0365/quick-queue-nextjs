import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';

const repository = getQueueItemRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    if (!status) {
      return NextResponse.json(
        { error: 'Missing required parameter: status' },
        { status: 400 }
      );
    }

    let items;
    switch (status) {
      case 'waiting':
        items = await repository.getWaitingItems(limit);
        break;
      case 'in_progress':
        items = await repository.getInProgressItems(limit);
        break;
      case 'completed':
        items = await repository.getCompletedItems(limit);
        break;
      default:
        return NextResponse.json(
          { error: `Invalid status: ${status}. Must be waiting, in_progress, or completed` },
          { status: 400 }
        );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/queue-items/by-status error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลคิวได้' },
      { status: 500 }
    );
  }
}
