'use client';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ShopInfoBanner() {
  const { template } = useTemplate();
  const pathname = usePathname();

  // ไม่แสดงแบนเนอร์ในหน้า /shop เอง เพื่อหลีกเลี่ยงความซ้ำซ้อน
  if (pathname === '/shop' || pathname.startsWith('/admin')) return null;

  if (template === 'retroTechMagazine') {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-8 mb-4">
        <Link href="/shop" className="block w-full bg-[#00FFFF] border-4 border-black p-4 text-center text-black font-black uppercase tracking-widest shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3">
          <MapPin className="w-6 h-6" strokeWidth={3} />
          ดูข้อมูลและแผนที่ร้านค้า
        </Link>
      </div>
    );
  }

  if (template === 'editorial') {
    return (
      <div className="w-full px-6 py-10 flex justify-center border-t-[3px] border-black mt-10 shrink-0">
        <Link href="/shop" className="group flex items-center justify-center gap-3 w-full max-w-md px-6 py-4 border-[4px] border-black bg-white text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
          <MapPin className="w-5 h-5" strokeWidth={2.5} />
          <span>LOCATION & INFO</span>
        </Link>
      </div>
    );
  }

  // Classic Template
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 shrink-0">
      <Link href="/shop" className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl hover:bg-surface-alt transition-colors group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">ข้อมูลร้านค้าและแผนที่</h3>
            <p className="text-xs text-muted">ตรวจสอบเวลาทำการและสถานที่ตั้งของ {DEFAULT_SHOP_CONFIG.shopName}</p>
          </div>
        </div>
        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 font-bold">
          →
        </div>
      </Link>
    </div>
  );
}
