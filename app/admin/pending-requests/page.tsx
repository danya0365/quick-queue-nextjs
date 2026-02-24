import { PendingRequestsView } from '@/src/presentation/components/admin/PendingRequestsView';
import { Metadata } from 'next';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';

export const metadata: Metadata = {
  title: `Pending Requests | ${DEFAULT_SHOP_CONFIG.shopName}`,
  description: 'คำขอบัตรคิวที่รอการอนุมัติ',
};

export default function PendingRequestsPage() {
  return <PendingRequestsView />;
}
