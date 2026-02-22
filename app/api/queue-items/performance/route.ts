import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextResponse } from 'next/server';

const repository = getQueueItemRepository();

export async function GET() {
  try {
    const performance = await repository.getPerformanceInsights();
    return NextResponse.json(performance);
  } catch (error) {
    console.error('GET /api/queue-items/performance error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดสถิติประสิทธิภาพได้' },
      { status: 500 }
    );
  }
}
