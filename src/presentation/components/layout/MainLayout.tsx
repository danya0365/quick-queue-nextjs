'use client';

import { MainClassicLayout } from '@/src/presentation/components/layout/layouts/MainClassicLayout';

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
    <MainClassicLayout>
      {children}
    </MainClassicLayout>
  );
}

