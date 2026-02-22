/**
 * Queue Request by ID API Route
 * PUT /api/queue-requests/[id] — Admin: approve or reject a request
 */

import { requireAuth } from '@/src/infrastructure/auth/session';
import { getQueueRequestRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = await requireAuth(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();

    if (!body.action || !['approve', 'reject'].includes(body.action)) {
      return NextResponse.json(
        { error: 'กรุณาระบุ action: approve หรือ reject' },
        { status: 400 }
      );
    }

    const repository = getQueueRequestRepository();
    if (body.action === 'approve') {
      const result = await repository.approve(id);
      return NextResponse.json(result);
    }

    // Reject
    if (!body.rejectReason) {
      return NextResponse.json(
        { error: 'กรุณาระบุเหตุผลในการปฏิเสธ' },
        { status: 400 }
      );
    }

    const result = await repository.reject(id, body.rejectReason);
    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT /api/queue-requests/[id] error:', error);
    const message = error instanceof Error ? error.message : 'ไม่สามารถดำเนินการได้';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
