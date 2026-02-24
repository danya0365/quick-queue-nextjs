import '@/public/styles/index.css';
import { MainTemplate } from '@/src/presentation/components/layout/MainTemplate';
import { ThemeProvider } from '@/src/presentation/providers/ThemeProvider';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';

export const metadata: Metadata = {
  title: `${DEFAULT_SHOP_CONFIG.shopName} — ${DEFAULT_SHOP_CONFIG.shopDescription}`,
  description: 'ระบบจดบันทึกคิวแบบ Simple เช็คสถานะคิวได้ง่ายๆ ผ่านหน้าเว็บ',
  keywords: ['queue', 'คิว', 'ระบบคิว', 'จัดการคิว'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-noto-sans-thai), sans-serif' }}
      >
        <ThemeProvider>
          <MainTemplate>
            {children}
          </MainTemplate>
        </ThemeProvider>
      </body>
    </html>
  );
}
