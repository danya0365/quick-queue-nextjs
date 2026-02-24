import { DisplayView } from '@/src/presentation/components/display/DisplayView';
import { createServerQueuePresenter } from '@/src/presentation/presenters/queue/QueuePresenterServerFactory';
import { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Display Board | Quick Queue',
    description: 'หน้าจอแสดงสถานะคิวสำหรับลูกค้า',
  };
}

export default async function DisplayPage() {
  const presenter = createServerQueuePresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <DisplayView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching display data:', error);
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-400 mb-4">ไม่สามารถโหลดข้อมูลคิวได้</p>
          <Link href="/" className="bg-white text-black px-4 py-2 rounded-lg font-bold">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }
}
