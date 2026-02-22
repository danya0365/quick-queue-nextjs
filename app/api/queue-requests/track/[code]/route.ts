/**
 * Queue Request Tracking API Route
 * GET /api/queue-requests/track/[code] — Public: track request by tracking code
 */

import { getQueueRequestRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'รหัสติดตามไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const repository = getQueueRequestRepository();
    const queueRequest = await repository.getByTrackingCode(code.toUpperCase());

    if (!queueRequest) {
      return NextResponse.json(
        { error: 'ไม่พบคำขอนี้' },
        { status: 404 }
      );
    }

    // If approved, also fetch queue item info
    let queueNumber: number | null = null;
    if (queueRequest.queueItemId) {
      const { getQueueItemRepository } = await import('@/src/infrastructure/repositories/RepositoryFactory');
      const queueRepo = getQueueItemRepository();
      const queueItem = await queueRepo.getById(queueRequest.queueItemId);
      if (queueItem) {
        queueNumber = queueItem.queueNumber;
      }
    }

    return NextResponse.json({
      ...queueRequest,
      queueNumber,
    });
  } catch (error) {
    console.error('GET /api/queue-requests/track/[code] error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลได้' },
      { status: 500 }
    );
  }
}
