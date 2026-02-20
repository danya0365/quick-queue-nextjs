/**
 * Queue Stats API Route
 * GET /api/queue-items/stats — Get queue statistics
 */

import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextResponse } from 'next/server';

const repository = getQueueItemRepository();

export async function GET() {
  try {
    const stats = await repository.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/queue-items/stats error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดสถิติได้' },
      { status: 500 }
    );
  }
}
