// ─── Master Data: Shop Configuration ───
export interface ShopConfig {
  shopName: string;
  shopDescription: string;
  maxQueuePerDay: number;
  operatingHours: {
    open: string;
    close: string;
  };
}

// ─── Static Data: Default Shop Config ───
export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  shopName: 'บัตรคิวด่วน',
  shopDescription: 'ระบบจัดการคิวอัจฉริยะ',
  maxQueuePerDay: 100,
  operatingHours: {
    open: '09:00',
    close: '18:00',
  },
};
