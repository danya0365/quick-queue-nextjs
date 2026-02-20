import { SqliteQueueItemRepository } from '@/src/infrastructure/repositories/sqlite/SqliteQueueItemRepository';
import { NextResponse } from 'next/server';

const repository = new SqliteQueueItemRepository();

export async function GET() {
  try {
    const currentServingNumber = await repository.getCurrentServingNumber();
    return NextResponse.json({ currentServingNumber });
  } catch (error) {
    console.error('GET /api/queue-items/current-serving error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลได้' },
      { status: 500 }
    );
  }
}
