'use client';

import { Footer } from '@/src/presentation/components/layout/Footer';
import { Header } from '@/src/presentation/components/layout/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout - Full screen layout, no scrolling on the outer container.
 * Content area scrolls internally if needed.
 * Structure: Header (fixed h-16) + Content (flex-1) + Footer (fixed h-12)
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
    </div>
  );
}
