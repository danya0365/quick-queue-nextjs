import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';

const repository = getQueueItemRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    const items = await repository.getRecentActivity(limit);
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/queue-items/recent-activity error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดความเคลื่อนไหวได้' },
      { status: 500 }
    );
  }
}
