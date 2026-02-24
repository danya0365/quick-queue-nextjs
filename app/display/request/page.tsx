import { DisplayRequestView } from '@/src/presentation/components/display/request/DisplayRequestView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `ขอบัตรคิว | ${DEFAULT_SHOP_CONFIG.shopName}`,
    description: 'ขอบัตรคิวออนไลน์ สะดวก รวดเร็ว',
  };
}

export default function DisplayRequestPage() {
  return <DisplayRequestView />;
}
