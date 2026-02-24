import { AdminKioskView } from '@/src/presentation/components/admin/kiosk/AdminKioskView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Kiosk Mode | ${DEFAULT_SHOP_CONFIG.shopName} Admin`,
    description: 'หน้าจอจัดการคิวสำหรับพนักงานหน้าร้าน — โหมด Kiosk',
  };
}

export default function AdminKioskPage() {
  return <AdminKioskView />;
}
