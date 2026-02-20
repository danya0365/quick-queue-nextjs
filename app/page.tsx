import { HomeView } from '@/src/presentation/components/home/HomeView';
import { createServerHomePresenter } from '@/src/presentation/presenters/home/HomePresenterServerFactory';
import type { Metadata } from 'next';

// Tell Next.js this is a dynamic page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Generate metadata for the home page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerHomePresenter();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Quick Queue — ระบบจัดการคิวอัจฉริยะ',
      description: 'ระบบจดบันทึกคิวแบบ Simple เช็คสถานะคิวได้ง่ายๆ ผ่านหน้าเว็บ',
    };
  }
}

/**
 * Home page - Server Component for SEO optimization
 * Follows Clean Architecture with presenter pattern
 */
export default async function HomePage() {
  const presenter = createServerHomePresenter();

  try {
    const viewModel = await presenter.getViewModel();

    return <HomeView initialViewModel={viewModel} />;
  } catch (error) {
    console.error('Error fetching home data:', error);

    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลคิวได้</p>
        </div>
      </div>
    );
  }
}
