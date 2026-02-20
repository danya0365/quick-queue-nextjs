import { QueueView } from '@/src/presentation/components/queue/QueueView';
import { createServerQueuePresenter } from '@/src/presentation/presenters/queue/QueuePresenterServerFactory';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for the queue page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerQueuePresenter();
  try {
    return presenter.generateMetadata();
  } catch {
    return {
      title: 'เช็คสถานะคิว | Quick Queue',
      description: 'ตรวจสอบสถานะคิวของคุณแบบเรียลไทม์',
    };
  }
}

/**
 * Queue status page - read-only for customers
 * Server Component for SEO + presenter pattern
 */
export default async function QueuePage() {
  const presenter = createServerQueuePresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <QueueView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching queue data:', error);

    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลคิวได้</p>
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
