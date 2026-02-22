/**
 * Math Challenge API Route
 * GET /api/queue-requests/challenge — Public: get a new math challenge
 */

import { generateMathChallenge } from '@/src/infrastructure/auth/rateLimit';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const challenge = generateMathChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('GET /api/queue-requests/challenge error:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างคำถามได้' },
      { status: 500 }
    );
  }
}
