import { ShopView } from '@/src/presentation/components/shop/ShopView';
import { Metadata } from 'next';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';

export const metadata: Metadata = {
  title: `ข้อมูลร้านค้า | ${DEFAULT_SHOP_CONFIG.shopName}`,
  description: 'ข้อมูลสถานที่ตั้งร้านค้าและเวลาทำการ',
};

export default function ShopPage() {
  // Let the templates handle their own layout designs (titles, spacing, map, etc.)
  return <ShopView />;
}
