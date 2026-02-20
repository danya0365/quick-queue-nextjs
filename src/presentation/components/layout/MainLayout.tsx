'use client';

import { Footer } from '@/src/presentation/components/layout/Footer';
import { Header } from '@/src/presentation/components/layout/Header';
import { MobileBottomNav } from '@/src/presentation/components/layout/MobileBottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout - Full screen layout, no scrolling on the outer container.
 * Content area scrolls internally if needed.
 * Structure: Header (fixed) + Content (flex-1) + Footer/MobileNav (fixed)
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className="
        flex flex-col
        h-screen w-screen
        overflow-hidden
        bg-background text-foreground
      "
      id="main-layout"
    >
      <Header />

      {/* Content Area - scrolls internally */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative" id="main-content">
        {children}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

