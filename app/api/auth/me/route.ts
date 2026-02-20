/**
 * Auth Session Check API Route
 * GET /api/auth/me — Check if current session is valid
 */

import { SqliteAuthRepository } from '@/src/infrastructure/repositories/sqlite/SqliteAuthRepository';
import { NextRequest, NextResponse } from 'next/server';

const authRepo = new SqliteAuthRepository();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('qq_session')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้เข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const user = await authRepo.validateSession(token);

    if (!user) {
      // Session expired or invalid
      const response = NextResponse.json(
        { error: 'เซสชันหมดอายุ' },
        { status: 401 }
      );

      // Clear invalid cookie
      response.cookies.set('qq_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });

      return response;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    );
  }
}
