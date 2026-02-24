import { AdminKioskView } from '@/src/presentation/components/admin/kiosk/AdminKioskView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Kiosk Mode | Quick Queue Admin',
    description: 'หน้าจอจัดการคิวสำหรับพนักงานหน้าร้าน — โหมด Kiosk',
  };
}

export default function AdminKioskPage() {
  return <AdminKioskView />;
}
