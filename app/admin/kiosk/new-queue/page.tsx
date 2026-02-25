import { AdminKioskNewQueueView } from '@/src/presentation/components/admin/kiosk/new-queue/AdminKioskNewQueueView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `สร้างคิวใหม่ | ${DEFAULT_SHOP_CONFIG.shopName} Admin`,
    description: 'สร้างคิวใหม่จากจอปฏิบัติการ Kiosk',
  };
}

export default function AdminKioskNewQueuePage() {
  return <AdminKioskNewQueueView />;
}
