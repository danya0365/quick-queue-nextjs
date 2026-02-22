import { AdminView } from '@/src/presentation/components/admin/AdminView';
import { createServerAdminPresenter } from '@/src/presentation/presenters/admin/AdminPresenterServerFactory';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for admin page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerAdminPresenter();
  try {
    return presenter.generateMetadata();
  } catch {
    return {
      title: 'จัดการคิว | Quick Queue',
      description: 'หน้าจัดการคิวสำหรับเจ้าของร้าน',
    };
  }
}

/**
 * Admin page - Server Component with presenter pattern
 * Auth is handled client-side via LoginGate component
 */
export default async function AdminPage() {
  const presenter = createServerAdminPresenter();

  try {
    const dashboardData = await presenter.loadDashboardData();
    // Reconstruct a full AdminViewModel to pass down safely with empty array fallbacks
    const viewModel = {
      ...dashboardData,
      items: [],
      totalItems: dashboardData.stats.totalItems,
      currentPage: 1,
      perPage: 20,
      totalPages: 1,
    };
    return <AdminView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching admin data:', error);

    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลได้</p>
          <Link
            href="/"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }
}
