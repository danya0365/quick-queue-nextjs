import { PendingRequestsView } from '@/src/presentation/components/admin/PendingRequestsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pending Requests | Quick Queue',
  description: 'คำขอบัตรคิวที่รอการอนุมัติ',
};

export default function PendingRequestsPage() {
  return <PendingRequestsView />;
}
