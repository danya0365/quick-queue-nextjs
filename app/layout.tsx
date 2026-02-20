import '@/public/styles/index.css';
import { MainLayout } from '@/src/presentation/components/layout/MainLayout';
import { ThemeProvider } from '@/src/presentation/providers/ThemeProvider';
import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

export const metadata: Metadata = {
  title: 'Quick Queue — ระบบจัดการคิวอัจฉริยะ',
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
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
