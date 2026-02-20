import { AuthUser } from '@/src/application/repositories/IAuthRepository';
import { getAuthRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { NextRequest, NextResponse } from 'next/server';

/**
 * requireAuth 
 * Helper function to validate session in API Routes
 * Returns AuthUser if valid, otherwise returns a Next.js JSON error response.
 */
export async function requireAuth(request: NextRequest): Promise<{ user?: AuthUser; errorResponse?: NextResponse }> {
  try {
    const token = request.cookies.get('qq_session')?.value;
    
    if (!token) {
      return {
        errorResponse: NextResponse.json({ error: 'Unauthorized: ไม่ได้เข้าสู่ระบบ' }, { status: 401 })
      };
    }

    const authRepo = getAuthRepository();
    const user = await authRepo.validateSession(token);

    if (!user) {
      // Session expired or invalid token
      return {
        errorResponse: NextResponse.json({ error: 'Unauthorized: เซสชันไม่ถูกต้อง หรือหมดอายุแล้ว' }, { status: 401 })
      };
    }

    return { user };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      errorResponse: NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' }, { status: 500 })
    };
  }
}
