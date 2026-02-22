/**
 * Queue Requests API Route
 * POST /api/queue-requests — Public: submit a new queue request (with anti-bot)
 * GET  /api/queue-requests — Admin: list pending requests
 */

import { checkRateLimit, verifyMathChallenge } from '@/src/infrastructure/auth/rateLimit';
import { requireAuth } from '@/src/infrastructure/auth/session';
import { getQueueRequestRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerName || !body.serviceType) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อและประเภทบริการ' },
        { status: 400 }
      );
    }

    // Verify math challenge
    if (!body.challengeToken || body.challengeAnswer === undefined) {
      return NextResponse.json(
        { error: 'กรุณาตอบคำถามยืนยันตัวตน' },
        { status: 400 }
      );
    }

    if (!verifyMathChallenge(body.challengeToken, Number(body.challengeAnswer))) {
      return NextResponse.json(
        { error: 'คำตอบไม่ถูกต้อง กรุณาลองใหม่' },
        { status: 400 }
      );
    }

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่' },
        { status: 429 }
      );
    }

    // Also check DB-level rate limit
    const repository = getQueueRequestRepository();
    const recentCount = await repository.countByIpRecent(ip, 10);
    if (recentCount >= 5) {
      return NextResponse.json(
        { error: 'คุณส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่' },
        { status: 429 }
      );
    }

    const queueRequest = await repository.create(
      {
        customerName: body.customerName,
        serviceType: body.serviceType,
        note: body.note,
      },
      ip
    );

    return NextResponse.json(queueRequest, { status: 201 });
  } catch (error) {
    console.error('POST /api/queue-requests error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถส่งคำขอได้' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireAuth(req); // Use req instead of request
    if (errorResponse) return errorResponse;

    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const searchParam = url.searchParams.get('search');
    const serviceTypeParam = url.searchParams.get('serviceType');
    
    let limit: number | undefined;
    let offset: number | undefined;
    let search: string | undefined = searchParam || undefined;
    let serviceType: string | undefined = serviceTypeParam || undefined;
    
    if (limitParam !== null) {
      limit = parseInt(limitParam, 10);
      if (isNaN(limit)) limit = undefined;
    }
    
    if (offsetParam !== null) {
      offset = parseInt(offsetParam, 10);
      if (isNaN(offset)) offset = undefined;
    }

    const repository = getQueueRequestRepository();
    const [requests, totalCount] = await Promise.all([
      repository.getPending(limit, offset, search, serviceType),
      repository.getPendingCount(search, serviceType)
    ]);
    
    return NextResponse.json({ requests, totalCount });
  } catch (error) {
    console.error('GET /api/queue-requests error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลได้' },
      { status: 500 }
    );
  }
}
