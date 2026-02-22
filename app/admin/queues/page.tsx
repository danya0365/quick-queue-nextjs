import { QueuesView } from '@/src/presentation/components/admin/queues/QueuesView';
import { createServerAdminPresenter } from '@/src/presentation/presenters/admin/AdminPresenterServerFactory';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for queues page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerAdminPresenter();
  try {
    return presenter.generateMetadata();
  } catch {
    return {
      title: 'จัดการคิว | Quick Queue',
      description: 'หน้ารายการคิวทั้งหมดสำหรับแอดมิน',
    };
  }
}

/**
 * Admin Queues page - Server Component with presenter pattern
 */
export default async function AdminQueuesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  
  const presenter = createServerAdminPresenter();

  try {
    const viewModel = await presenter.loadQueuesData(page, 20, status);
    return <QueuesView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching admin queues data:', error);

    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-muted mb-6">ไม่สามารถโหลดข้อมูลคิวได้</p>
          <Link
            href="/admin"
            className="bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors font-medium"
          >
            กลับแผงควบคุม
          </Link>
        </div>
      </div>
    );
  }
}
