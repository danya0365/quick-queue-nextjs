import { ShopMap } from '@/src/presentation/components/shop/ShopMap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ข้อมูลร้านค้า | Quick Queue',
  description: 'ข้อมูลสถานที่ตั้งร้านค้าและเวลาทำการ',
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">ข้อมูลร้านค้า (Shop Info)</h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl">
            ตรวจสอบข้อมูลสถานที่ตั้ง เวลาทำการ และข้อมูลการติดต่อของเราผ่านแผนที่แบบ Interactive
          </p>
        </div>

        {/* Map Section */}
        <div className="h-[auto] w-full min-h-[500px]">
          <ShopMap />
        </div>

      </div>
    </div>
  );
}
