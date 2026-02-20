/**
 * Auth Logout API Route
 * POST /api/auth/logout — Logout (invalidate session)
 */

import { SqliteAuthRepository } from '@/src/infrastructure/repositories/sqlite/SqliteAuthRepository';
import { NextRequest, NextResponse } from 'next/server';

const authRepo = new SqliteAuthRepository();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('qq_session')?.value;

    if (token) {
      await authRepo.logout(token);
    }

    const response = NextResponse.json({ success: true });

    // Clear the cookie
    response.cookies.set('qq_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/logout error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}
