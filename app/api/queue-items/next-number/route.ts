/**
 * Queue Next Number API Route
 * GET /api/queue-items/next-number — Get the next queue number
 */

import { getQueueItemRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextResponse } from 'next/server';

const repository = getQueueItemRepository();

export async function GET() {
  try {
    const nextNumber = await repository.getNextQueueNumber();
    return NextResponse.json({ nextNumber });
  } catch (error) {
    console.error('GET /api/queue-items/next-number error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดหมายเลขถัดไปได้' },
      { status: 500 }
    );
  }
}
