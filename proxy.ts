import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * proxy.ts (Next.js Middleware)
 * Next.js 16 Proxy Middleware สำหรับปกป้อง API และ Route
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('qq_session')?.value;

  // 1. ปกป้อง API ที่มีการเขียนข้อมูล (POST, PUT, DELETE)
  // ให้เฉพาะ Admin ที่มีเซสชันเท่านั้นถึงเรียกใช้ได้
  if (pathname.startsWith('/api/queue-items')) {
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized : กรุณาเข้าสู่ระบบก่อนทำรายการ' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

// ระบุ Path ที่ต้องการให้ Proxy นี้ทำงาน
export const config = {
  matcher: [
    '/api/queue-items/:path*',
  ],
};
