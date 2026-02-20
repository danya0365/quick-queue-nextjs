/**
 * Auth Login API Route
 * POST /api/auth/login — Login with username/password
 * Returns session token in HTTP-only cookie
 */

import { getAuthRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';

const authRepo = getAuthRepository();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }

    const user = await authRepo.login({
      username: body.username,
      password: body.password,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Get the session token that was just created
    // The login method creates a session internally — we need to get the token
    // Retrieve the latest session for this user
    const { getTursoDatabase } = await import('@/src/infrastructure/database/turso');
    const db = getTursoDatabase();
    const sessionResult = await db.execute({
      sql: 'SELECT token FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      args: [user.id]
    });
    const sessionRow = sessionResult.rows[0];
    const session = sessionRow ? { token: sessionRow.token as string } : undefined;

    if (!session) {
      return NextResponse.json(
        { error: 'ไม่สามารถสร้าง session ได้' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
      },
    });

    // Set HTTP-only cookie for session
    response.cookies.set('qq_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}
