import { AdminFocusView } from '@/src/presentation/components/admin/focus/AdminFocusView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Focus Mode | Quick Queue Admin',
    description: 'หน้าจอจัดการคิวสำหรับพนักงานหน้าร้าน',
  };
}

export default function AdminFocusPage() {
  return <AdminFocusView />;
}
